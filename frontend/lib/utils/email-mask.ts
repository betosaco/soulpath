/**
 * ========================================================================================
 * EMAIL MASKING UTILITY
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * Provides utility functions to mask email addresses for privacy protection
 * when displaying existing customer information.
 *
 * FEATURES:
 * - Partial email masking (e.g., albe***@matmax.world)
 * - Configurable masking patterns
 * - Preserves domain visibility
 * - Handles edge cases (short usernames, etc.)
 */

/**
 * MASK EMAIL ADDRESS
 * ------------------
 * Masks an email address for privacy while keeping it recognizable
 *
 * @param email - The email address to mask
 * @param visibleChars - Number of characters to show at the beginning (default: 3)
 * @param maskChar - Character to use for masking (default: '*')
 * @returns Masked email address
 *
 * @example
 * maskEmail('alberto@matmax.world') // Returns 'alb***@matmax.world'
 * maskEmail('test@example.com', 2) // Returns 'te***@example.com'
 * maskEmail('a@test.com', 1) // Returns 'a***@test.com'
 */
export function maskEmail(
  email: string, 
  visibleChars: number = 3, 
  maskChar: string = '*'
): string {
  if (!email || typeof email !== 'string') {
    return email;
  }

  // Split email into local and domain parts
  const [localPart, domain] = email.split('@');
  
  if (!localPart || !domain) {
    return email; // Return original if invalid format
  }

  // Handle very short usernames
  if (localPart.length <= visibleChars) {
    return `${localPart}${maskChar.repeat(3)}@${domain}`;
  }

  // Mask the local part
  const visiblePart = localPart.substring(0, visibleChars);
  const maskedPart = maskChar.repeat(3);
  
  return `${visiblePart}${maskedPart}@${domain}`;
}

/**
 * MASK EMAIL FOR DISPLAY
 * ----------------------
 * Masks an email address specifically for UI display purposes
 * Uses a more conservative masking approach
 *
 * @param email - The email address to mask
 * @returns Masked email address for display
 *
 * @example
 * maskEmailForDisplay('alberto@matmax.world') // Returns 'alb***@matmax.world'
 * maskEmailForDisplay('test@example.com') // Returns 'tes***@example.com'
 */
export function maskEmailForDisplay(email: string): string {
  return maskEmail(email, 3, '*');
}

/**
 * MASK EMAIL FOR LOGS
 * -------------------
 * Masks an email address for logging purposes
 * Uses more aggressive masking for security
 *
 * @param email - The email address to mask
 * @returns Masked email address for logs
 *
 * @example
 * maskEmailForLogs('alberto@matmax.world') // Returns 'alb***@matmax.world'
 * maskEmailForLogs('test@example.com') // Returns 'te***@example.com'
 */
export function maskEmailForLogs(email: string): string {
  return maskEmail(email, 2, '*');
}

/**
 * VALIDATE EMAIL FORMAT
 * ---------------------
 * Validates if an email address has a valid format
 *
 * @param email - The email address to validate
 * @returns True if email format is valid
 */
export function isValidEmailFormat(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
