// ===============================================
// خدمة API الأساسية (Base API Service)
// ===============================================
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginationParams } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private buildParams(pagination?: PaginationParams, filters?: Record<string, any>): HttpParams {
    let params = new HttpParams();
    if (pagination) {
      params = params.set('page', pagination.page.toString());
      params = params.set('pageSize', pagination.pageSize.toString());
      if (pagination.sortBy) params = params.set('sortBy', pagination.sortBy);
      if (pagination.sortOrder) params = params.set('sortOrder', pagination.sortOrder);
      if (pagination.search) params = params.set('search', pagination.search);
    }
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params = params.set(key, filters[key].toString());
        }
      });
    }
    return params;
  }

  getAll<T>(endpoint: string, pagination?: PaginationParams, filters?: Record<string, any>): Observable<ApiResponse<T[]>> {
    const params = this.buildParams(pagination, filters);
    return this.http.get<ApiResponse<T[]>>(`${this.baseUrl}/${endpoint}`, { params });
  }

  getById<T>(endpoint: string, id: number | string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`);
  }

  create<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, data);
  }

  update<T>(endpoint: string, id: number | string, data: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`, data);
  }

  patch<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, data);
  }

  delete<T>(endpoint: string, id: number | string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`);
  }

  search<T>(endpoint: string, query: string): Observable<ApiResponse<T[]>> {
    return this.http.get<ApiResponse<T[]>>(`${this.baseUrl}/${endpoint}/search`, {
      params: new HttpParams().set('q', query)
    });
  }

  export(endpoint: string, format: 'excel' | 'pdf', filters?: Record<string, any>): Observable<Blob> {
    const params = this.buildParams(undefined, filters);
    return this.http.get(`${this.baseUrl}/${endpoint}/export/${format}`, {
      params,
      responseType: 'blob'
    });
  }
}
