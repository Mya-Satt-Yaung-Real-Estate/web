/**
 * Myanmar Phone Number Validation Utility
 * 
 * Validates and normalizes Myanmar phone numbers
 * Format: 09XXXXXXXXX (11 digits starting with 09)
 * Alternative formats: +959XXXXXXXXX, 959XXXXXXXXX
 */

/**
 * Normalizes a phone number to standard Myanmar format (09XXXXXXXXX)
 * @param phone - Phone number in any format
 * @returns Normalized phone number or empty string if invalid
 */
export function normalizeMyanmarPhone(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Handle +959 format
  if (cleaned.startsWith('+959')) {
    cleaned = '09' + cleaned.slice(4);
  }
  // Handle 959 format
  else if (cleaned.startsWith('959')) {
    cleaned = '09' + cleaned.slice(3);
  }
  // If it doesn't start with 09, try to add it if it's 9 digits
  else if (cleaned.length === 9 && !cleaned.startsWith('09')) {
    cleaned = '09' + cleaned;
  }
  
  return cleaned;
}

/**
 * Validates Myanmar phone number format
 * @param phone - Phone number to validate
 * @returns Object with isValid flag and normalized phone
 */
export function validateMyanmarPhone(phone: string): { isValid: boolean; normalized: string; error?: string } {
  if (!phone || !phone.trim()) {
    return {
      isValid: false,
      normalized: '',
      error: 'required',
    };
  }
  
  const normalized = normalizeMyanmarPhone(phone);
  
  // Must start with 09
  if (!normalized.startsWith('09')) {
    return {
      isValid: false,
      normalized,
      error: 'mustStartWith09',
    };
  }
  
  // Must be exactly 11 digits
  if (normalized.length !== 11) {
    return {
      isValid: false,
      normalized,
      error: normalized.length < 11 ? 'tooShort' : 'tooLong',
    };
  }
  
  // Must contain only digits
  if (!/^\d+$/.test(normalized)) {
    return {
      isValid: false,
      normalized,
      error: 'onlyNumbers',
    };
  }
  
  return {
    isValid: true,
    normalized,
  };
}

