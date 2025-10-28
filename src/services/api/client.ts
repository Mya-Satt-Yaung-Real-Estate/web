/**
 * Base API Client
 * 
 * Simple HTTP client for TanStack Query.
 */

import { CONFIG } from '@/lib/config';
import type { ApiResponse } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

// ============================================================================
// API CLIENT
// ============================================================================

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor() {
    this.baseUrl = CONFIG.api.baseUrl;
    this.defaultTimeout = CONFIG.api.timeout;
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit & RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { timeout = this.defaultTimeout, headers = {}, params, ...fetchOptions } = options;
    
    let url = `${this.baseUrl}${endpoint}`;
    
    // Add query parameters
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Only include credentials for authentication endpoints
      const isAuthEndpoint = endpoint.includes('/auth/');
      
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...headers,
        },
        credentials: isAuthEndpoint ? 'include' : 'same-origin',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Try to parse error response body for detailed error messages
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorData = null;
        
        try {
          errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // If parsing fails, we'll use the default error message
        }
        
        // Create a custom error object with the response data
        const error = new Error(errorMessage);
        (error as any).response = {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        };
        throw error;
      }

      const data = await response.json();
      
      return {
        data,
        message: 'Success',
        success: true,
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', ...options });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options });
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const apiClient = new ApiClient();

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    apiClient.get<T>(endpoint, options),
  
  post: <T>(endpoint: string, data?: any, options?: RequestOptions) => 
    apiClient.post<T>(endpoint, data, options),
  
  put: <T>(endpoint: string, data?: any, options?: RequestOptions) => 
    apiClient.put<T>(endpoint, data, options),
  
  patch: <T>(endpoint: string, data?: any, options?: RequestOptions) => 
    apiClient.patch<T>(endpoint, data, options),
  
  delete: <T>(endpoint: string, options?: RequestOptions) => 
    apiClient.delete<T>(endpoint, options),
};

// ============================================================================
// ERROR HANDLING
// ============================================================================

export function handleApiError(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

export function isNetworkError(error: any): boolean {
  return error?.message?.includes('Network') || 
         error?.message?.includes('fetch') ||
         error?.name === 'NetworkError';
}

export function isTimeoutError(error: any): boolean {
  return error?.message?.includes('timeout') ||
         error?.name === 'AbortError';
}
