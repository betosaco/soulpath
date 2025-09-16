/**
 * Safe JSON parsing utility to prevent "Unexpected token '<'" errors
 * This utility checks content-type headers before attempting to parse JSON
 */

export interface SafeJsonParseResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  isHtmlResponse?: boolean;
}

/**
 * Safely parse JSON response with content-type checking
 * @param response - The fetch Response object
 * @returns Promise with parsed data or error information
 */
export async function safeJsonParse<T = unknown>(
  response: Response
): Promise<SafeJsonParseResult<T>> {
  try {
    // Check content type before parsing JSON
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const errorText = await response.text();
      
      // Check if it's an HTML response (common cause of JSON parsing errors)
      const isHtmlResponse = contentType?.includes('text/html') || 
                            errorText.trim().startsWith('<!DOCTYPE') ||
                            errorText.trim().startsWith('<html');
      
      console.error('❌ SafeJsonParse: Non-JSON response received:', {
        status: response.status,
        statusText: response.statusText,
        contentType,
        url: response.url,
        isHtmlResponse,
        body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')
      });
      
      return {
        success: false,
        error: `API returned ${response.status} ${response.statusText} instead of JSON`,
        isHtmlResponse
      };
    }
    
    // Parse JSON response
    const data = await response.json();
    return {
      success: true,
      data: data as T
    };
    
  } catch (parseError) {
    console.error('❌ SafeJsonParse: JSON parsing failed:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      error: parseError
    });
    
    return {
      success: false,
      error: `Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
    };
  }
}

/**
 * Enhanced fetch wrapper with automatic safe JSON parsing
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @returns Promise with parsed data or error information
 */
export async function safeFetch<T = unknown>(
  url: string | URL,
  options: RequestInit = {}
): Promise<SafeJsonParseResult<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    return await safeJsonParse<T>(response);
    
  } catch (error) {
    console.error('❌ SafeFetch: Network error:', {
      url: url.toString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return {
      success: false,
      error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Helper function to handle common fetch patterns with safe JSON parsing
 * @param response - The fetch Response object
 * @param context - Context for error logging (e.g., component name)
 * @returns Promise with parsed data or throws error
 */
export async function handleApiResponse<T = unknown>(
  response: Response,
  context: string = 'Unknown'
): Promise<T> {
  const result = await safeJsonParse<T>(response);
  
  if (!result.success) {
    throw new Error(`${context}: ${result.error}`);
  }
  
  return result.data!;
}
