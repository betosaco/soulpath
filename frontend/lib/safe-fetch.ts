/**
 * Safe Fetch Utility
 * 
 * Provides a robust fetch wrapper that handles JSON parsing errors
 * and provides better error messages when APIs return HTML instead of JSON.
 */

export interface SafeFetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

export interface SafeFetchResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
  statusText: string;
}

/**
 * Safe fetch wrapper that handles JSON parsing errors gracefully
 */
export async function safeFetch<T = unknown>(
  url: string | URL,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResponse<T>> {
  const { timeout = 10000, retries = 0, ...fetchOptions } = options;
  
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });
      
      clearTimeout(timeoutId);
      
      // Check if response is OK
      if (!response.ok) {
        // Check if response is HTML (error page)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          const errorText = await response.text();
          console.error('❌ API returned HTML instead of JSON:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            attempt: attempt + 1,
            body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')
          });
          
          lastError = new Error(`API returned HTML error page: ${response.status} ${response.statusText}`);
          if (attempt < retries) continue;
          
          return {
            success: false,
            error: lastError.message,
            status: response.status,
            statusText: response.statusText,
          };
        }
        
        // Try to parse JSON error response
        try {
          const errorData = await response.json();
          lastError = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        } catch {
          lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        if (attempt < retries) continue;
        
        return {
          success: false,
          error: lastError.message,
          status: response.status,
          statusText: response.statusText,
        };
      }
      
      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('❌ Non-JSON response received:', {
          status: response.status,
          statusText: response.statusText,
          contentType,
          url: response.url,
          attempt: attempt + 1,
          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')
        });
        
        lastError = new Error(`API returned non-JSON response: ${contentType}`);
        if (attempt < retries) continue;
        
        return {
          success: false,
          error: lastError.message,
          status: response.status,
          statusText: response.statusText,
        };
      }
      
      // Parse JSON response
      try {
        const data = await response.json();
        return {
          success: true,
          data: data as T,
          status: response.status,
          statusText: response.statusText,
        };
      } catch (parseError) {
        console.error('❌ JSON parsing failed:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          attempt: attempt + 1,
          error: parseError
        });
        
        lastError = new Error(`Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        if (attempt < retries) continue;
        
        return {
          success: false,
          error: lastError.message,
          status: response.status,
          statusText: response.statusText,
        };
      }
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Check if it's a timeout or network error that we should retry
      if (error instanceof Error && (
        error.name === 'AbortError' || 
        error.message.includes('fetch') ||
        error.message.includes('network')
      )) {
        console.warn(`⚠️ Network error on attempt ${attempt + 1}/${retries + 1}:`, error.message);
        if (attempt < retries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }
      }
      
      console.error('❌ Fetch error:', {
        url,
        attempt: attempt + 1,
        error: lastError.message
      });
      
      return {
        success: false,
        error: lastError.message,
        status: 0,
        statusText: 'Network Error',
      };
    }
  }
  
  // This should never be reached, but just in case
  return {
    success: false,
    error: lastError?.message || 'Unknown error',
    status: 0,
    statusText: 'Unknown Error',
  };
}

/**
 * Convenience function for GET requests
 */
export async function safeGet<T = unknown>(
  url: string | URL,
  options: Omit<SafeFetchOptions, 'method' | 'body'> = {}
): Promise<SafeFetchResponse<T>> {
  return safeFetch<T>(url, { ...options, method: 'GET' });
}

/**
 * Convenience function for POST requests
 */
export async function safePost<T = unknown>(
  url: string | URL,
  data?: unknown,
  options: Omit<SafeFetchOptions, 'method'> = {}
): Promise<SafeFetchResponse<T>> {
  return safeFetch<T>(url, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Convenience function for PUT requests
 */
export async function safePut<T = unknown>(
  url: string | URL,
  data?: unknown,
  options: Omit<SafeFetchOptions, 'method'> = {}
): Promise<SafeFetchResponse<T>> {
  return safeFetch<T>(url, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Convenience function for DELETE requests
 */
export async function safeDelete<T = unknown>(
  url: string | URL,
  options: Omit<SafeFetchOptions, 'method' | 'body'> = {}
): Promise<SafeFetchResponse<T>> {
  return safeFetch<T>(url, { ...options, method: 'DELETE' });
}

/**
 * Check if an error is a JSON parsing error
 */
export function isJsonError(error: unknown): boolean {
  return error instanceof Error && (
    error.message.includes('JSON') ||
    error.message.includes('Unexpected token') ||
    error.message.includes('HTML error page') ||
    error.message.includes('non-JSON response')
  );
}

export default safeFetch;
