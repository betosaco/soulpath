/**
 * API Utility Functions
 * 
 * Provides safe API calling functions that handle JSON parsing errors
 * and provide better error messages when APIs return HTML instead of JSON.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiError extends Error {
  status: number;
  statusText: string;
  isJsonError: boolean;

  constructor({ message, status, statusText, isJsonError }: {
    message: string;
    status: number;
    statusText: string;
    isJsonError: boolean;
  }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.isJsonError = isJsonError;
  }
}

/**
 * Safely parse JSON response, handling cases where API returns HTML error pages
 */
export async function safeJsonParse<T = unknown>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    const errorText = await response.text();
    console.error('❌ Non-JSON response received:', {
      status: response.status,
      statusText: response.statusText,
      contentType,
      url: response.url,
      body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')
    });
    
    throw new ApiError({
      message: `API returned ${response.status} ${response.statusText} instead of JSON`,
      status: response.status,
      statusText: response.statusText,
      isJsonError: true
    });
  }
  
  try {
    return await response.json();
  } catch (parseError) {
    console.error('❌ JSON parsing failed:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      error: parseError
    });
    
    throw new ApiError({
      message: `Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
      status: response.status,
      statusText: response.statusText,
      isJsonError: true
    });
  }
}

/**
 * Make a safe API call with proper error handling
 */
export async function safeApiCall<T = unknown>(
  url: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const data = await safeJsonParse<ApiResponse<T>>(response);
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        message: data.message || 'Request failed'
      };
    }
    
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        message: `API call failed: ${error.status} ${error.statusText}`
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Network or parsing error occurred'
    };
  }
}

/**
 * Make a safe API call with authentication
 */
export async function safeApiCallWithAuth<T = unknown>(
  url: string,
  token: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  return safeApiCall<T>(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });
}

/**
 * Check if an error is a JSON parsing error
 */
export function isJsonError(error: unknown): error is ApiError {
  return error !== null && typeof error === 'object' && 'isJsonError' in error && (error as ApiError).isJsonError === true;
}