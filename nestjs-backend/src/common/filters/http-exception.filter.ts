// =============================================
// Global Exception Filter
// =============================================
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'حدث خطأ داخلي في الخادم';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exResponse = exception.getResponse();

      if (typeof exResponse === 'string') {
        message = exResponse;
      } else if (typeof exResponse === 'object') {
        message = (exResponse as any).message || message;
        errors = (exResponse as any).errors || null;
        // Handle class-validator errors
        if (Array.isArray(message)) {
          errors = message;
          message = 'بيانات غير صالحة';
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `${request.method} ${request.url} - ${exception.message}`,
        exception.stack,
      );
    }

    // Map common status codes to Arabic messages
    const statusMessages: Record<number, string> = {
      400: 'طلب غير صالح',
      401: 'غير مصرح - يرجى تسجيل الدخول',
      403: 'ممنوع - ليس لديك صلاحية',
      404: 'غير موجود',
      409: 'تعارض في البيانات',
      422: 'بيانات غير قابلة للمعالجة',
      429: 'عدد الطلبات تجاوز الحد المسموح',
      500: 'خطأ داخلي في الخادم',
    };

    if (!message || message === 'حدث خطأ داخلي في الخادم') {
      message = statusMessages[status] || message;
    }

    response.status(status).json({
      success: false,
      data: null,
      message,
      errors,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
