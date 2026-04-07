// =============================================
// Response Helper + Global Exception Filter +
// Transform Interceptor + Pagination Decorator
// =============================================

// ─── src/common/interceptors/transform.interceptor.ts ───
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseFormat<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data: data?.data !== undefined ? data.data : data,
        message: data?.message || 'تمت العملية بنجاح',
        statusCode,
        timestamp: new Date().toISOString(),
        ...(data?.totalCount !== undefined && {
          totalCount: data.totalCount,
          page: data.page,
          pageSize: data.pageSize,
          totalPages: data.totalPages,
        }),
      })),
    );
  }
}
