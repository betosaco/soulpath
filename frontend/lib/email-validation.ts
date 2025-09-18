/**
 * Comprehensive email validation utility
 * Supports all valid email formats including special domain types
 */

// RFC 5322 compliant email regex (simplified but comprehensive)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Common TLD patterns for validation
const COMMON_TLDS = [
  // Generic TLDs
  'com', 'org', 'net', 'edu', 'gov', 'mil', 'int', 'info', 'biz', 'name', 'pro',
  // Country code TLDs (major ones)
  'us', 'uk', 'ca', 'au', 'de', 'fr', 'es', 'it', 'nl', 'be', 'ch', 'at', 'se', 'no', 'dk', 'fi',
  'jp', 'cn', 'kr', 'in', 'br', 'mx', 'ar', 'cl', 'co', 'pe', 've', 'ec', 'uy', 'py', 'bo',
  'za', 'ng', 'eg', 'ma', 'ke', 'gh', 'tz', 'ug', 'rw', 'et', 'zm', 'bw', 'sz', 'ls',
  'ru', 'pl', 'cz', 'hu', 'ro', 'bg', 'hr', 'si', 'sk', 'lt', 'lv', 'ee', 'ua', 'by',
  'tr', 'gr', 'cy', 'mt', 'is', 'ie', 'pt', 'lu', 'li', 'mc', 'ad', 'sm', 'va',
  'il', 'ae', 'sa', 'kw', 'qa', 'bh', 'om', 'jo', 'lb', 'sy', 'iq', 'ir', 'af',
  'pk', 'bd', 'lk', 'mv', 'bt', 'np', 'mm', 'th', 'la', 'kh', 'vn', 'my', 'sg',
  'id', 'ph', 'tw', 'hk', 'mo', 'mn', 'kz', 'uz', 'tm', 'kg', 'tj', 'af',
  'nz', 'fj', 'pg', 'sb', 'vu', 'nc', 'pf', 'ws', 'to', 'ki', 'tv', 'nr', 'fm',
  // New gTLDs (popular ones)
  'app', 'dev', 'io', 'ai', 'co', 'me', 'tv', 'cc', 'ly', 'be', 'fm', 'ms', 'gs',
  'tk', 'ml', 'ga', 'cf', 'click', 'download', 'link', 'online', 'site', 'store',
  'tech', 'website', 'work', 'email', 'news', 'blog', 'shop', 'buy', 'sale',
  'money', 'bank', 'finance', 'invest', 'trade', 'crypto', 'bitcoin', 'ethereum',
  'music', 'video', 'photo', 'pics', 'gallery', 'art', 'design', 'style', 'fashion',
  'food', 'restaurant', 'cafe', 'bar', 'pub', 'club', 'party', 'event', 'wedding',
  'travel', 'hotel', 'vacation', 'trip', 'tour', 'guide', 'booking', 'reservation',
  'health', 'medical', 'doctor', 'clinic', 'hospital', 'pharmacy', 'drug', 'medicine',
  'fitness', 'gym', 'sport', 'football', 'soccer', 'basketball', 'tennis', 'golf',
  'education', 'school', 'university', 'college', 'academy', 'course', 'training',
  'job', 'career', 'work', 'employment', 'recruitment', 'hiring', 'resume',
  'business', 'company', 'corp', 'inc', 'llc', 'ltd', 'group', 'team', 'agency',
  'consulting', 'services', 'solutions', 'systems', 'software', 'apps', 'mobile',
  'cloud', 'data', 'analytics', 'marketing', 'advertising', 'promotion', 'social',
  'media', 'content', 'creative', 'digital', 'online', 'internet', 'web', 'www'
];

// Special domain patterns
const SPECIAL_DOMAINS = [
  // Educational institutions
  'edu', 'ac', 'school', 'university', 'college', 'academy',
  // Government
  'gov', 'mil', 'int', 'org',
  // International organizations
  'un', 'who', 'wto', 'imf', 'worldbank',
  // Tech companies and services
  'gmail', 'yahoo', 'hotmail', 'outlook', 'icloud', 'protonmail', 'tutanota',
  'zoho', 'fastmail', 'hey', 'mail', 'email', 'inbox',
  // Corporate domains
  'corp', 'inc', 'ltd', 'llc', 'company', 'business', 'enterprise',
  // Regional domains
  'local', 'internal', 'private', 'test', 'dev', 'staging'
];

/**
 * Validates if an email address has a valid format
 */
export function isValidEmailFormat(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  // Basic length check
  if (email.length < 5 || email.length > 254) return false;
  
  // Check for basic structure
  if (!EMAIL_REGEX.test(email)) return false;
  
  // Check for consecutive dots
  if (email.includes('..')) return false;
  
  // Check for leading/trailing dots
  if (email.startsWith('.') || email.endsWith('.')) return false;
  
  return true;
}

/**
 * Validates if an email domain is valid
 */
export function isValidEmailDomain(email: string): boolean {
  if (!isValidEmailFormat(email)) return false;
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  // Check if domain has at least one dot (TLD requirement)
  if (!domain.includes('.')) return false;
  
  // Split domain into parts
  const parts = domain.split('.');
  if (parts.length < 2) return false;
  
  // Check each part
  for (const part of parts) {
    if (!part || part.length === 0) return false;
    if (part.startsWith('-') || part.endsWith('-')) return false;
    if (!/^[a-zA-Z0-9-]+$/.test(part)) return false;
  }
  
  // Check TLD
  const tld = parts[parts.length - 1];
  if (tld.length < 2 || tld.length > 63) return false;
  
  return true;
}

/**
 * Validates if an email uses a common or recognized TLD
 * Returns true for any valid TLD (including uncommon ones)
 */
export function hasValidTLD(email: string): boolean {
  if (!isValidEmailDomain(email)) return false;
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  const tld = domain.split('.').pop();
  if (!tld) return false;
  
  // Accept any valid TLD format (2-63 characters, alphanumeric)
  return tld.length >= 2 && tld.length <= 63 && /^[a-zA-Z0-9-]+$/.test(tld);
}

/**
 * Validates if an email uses a special domain type
 */
export function hasSpecialDomain(email: string): boolean {
  if (!isValidEmailDomain(email)) return false;
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  // Check for special domain patterns
  return SPECIAL_DOMAINS.some(specialDomain => 
    domain.includes(specialDomain)
  );
}

/**
 * Comprehensive email validation
 * Returns validation result with detailed information
 */
export function validateEmail(email: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  // Basic format validation
  if (!isValidEmailFormat(email)) {
    errors.push('Invalid email format');
    return { isValid: false, errors, warnings, suggestions };
  }
  
  // Domain validation
  if (!isValidEmailDomain(email)) {
    errors.push('Invalid email domain');
    return { isValid: false, errors, warnings, suggestions };
  }
  
  // TLD validation - only check format, not commonality
  if (!hasValidTLD(email)) {
    errors.push('Invalid email domain format');
    return { isValid: false, errors, warnings, suggestions };
  }
  
  // Additional checks for obviously invalid patterns
  const domain = email.split('@')[1]?.toLowerCase();
  if (domain) {
    // Check for suspicious patterns that might indicate invalid emails
    if (domain.includes('temp') || domain.includes('throwaway')) {
      warnings.push('Email appears to be temporary');
    }
    
    // Check for very long domains (might be invalid)
    if (domain.length > 50) {
      warnings.push('Email domain is unusually long');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
}

/**
 * Simple email validation for forms (returns boolean)
 */
export function isEmailValid(email: string): boolean {
  return validateEmail(email).isValid;
}

/**
 * Email validation with custom error messages
 * Only returns error messages for actual validation failures, not warnings
 */
export function validateEmailWithMessage(email: string): string | null {
  const result = validateEmail(email);
  
  if (!result.isValid) {
    return result.errors[0] || 'Invalid email address';
  }
  
  // Don't show warnings as blocking errors - allow booking to continue
  return null;
}
