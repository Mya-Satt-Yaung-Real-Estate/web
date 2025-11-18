/**
 * Signup Flow Session Management
 * 
 * Manages the signup flow state using sessionStorage to prevent
 * direct URL access to verify and register pages.
 */

const SIGNUP_PHONE_KEY = 'signup_phone';
const SIGNUP_PHONE_TIMESTAMP_KEY = 'signup_phone_timestamp';
const OTP_ACTION_TYPE_KEY = 'otp_action_type';
const OTP_VERIFIED_KEY = 'otp_verified';
const OTP_VERIFIED_TIMESTAMP_KEY = 'otp_verified_timestamp';

// OTP request expires after 15 minutes
const OTP_REQUEST_EXPIRY_MS = 15 * 60 * 1000;
// OTP verification expires after 10 minutes
const OTP_VERIFIED_EXPIRY_MS = 10 * 60 * 1000;

/**
 * Store phone number and action type when OTP is successfully requested
 */
export function storeOtpRequestedPhone(phone: string, actionType?: string): void {
  const timestamp = Date.now();
  sessionStorage.setItem(SIGNUP_PHONE_KEY, phone);
  sessionStorage.setItem(SIGNUP_PHONE_TIMESTAMP_KEY, timestamp.toString());
  if (actionType) {
    sessionStorage.setItem(OTP_ACTION_TYPE_KEY, actionType);
  }
}

/**
 * Get phone number from sessionStorage if valid
 * Returns null if not found or expired
 */
export function getOtpRequestedPhone(): string | null {
  const phone = sessionStorage.getItem(SIGNUP_PHONE_KEY);
  const timestampStr = sessionStorage.getItem(SIGNUP_PHONE_TIMESTAMP_KEY);

  if (!phone || !timestampStr) {
    return null;
  }

  const timestamp = parseInt(timestampStr, 10);
  const now = Date.now();
  const elapsed = now - timestamp;

  if (elapsed > OTP_REQUEST_EXPIRY_MS) {
    // Expired, clear it
    clearOtpRequestedPhone();
    return null;
  }

  return phone;
}

/**
 * Get stored action type from OTP request
 */
export function getOtpActionType(): string | null {
  return sessionStorage.getItem(OTP_ACTION_TYPE_KEY);
}

/**
 * Clear OTP requested phone from sessionStorage
 */
export function clearOtpRequestedPhone(): void {
  sessionStorage.removeItem(SIGNUP_PHONE_KEY);
  sessionStorage.removeItem(SIGNUP_PHONE_TIMESTAMP_KEY);
  sessionStorage.removeItem(OTP_ACTION_TYPE_KEY);
}

/**
 * Store OTP verification status
 */
export function storeOtpVerified(phone: string): void {
  const timestamp = Date.now();
  sessionStorage.setItem(OTP_VERIFIED_KEY, 'true');
  sessionStorage.setItem(OTP_VERIFIED_TIMESTAMP_KEY, timestamp.toString());
  // Also update the phone to ensure it matches
  storeOtpRequestedPhone(phone);
}

/**
 * Check if OTP was verified and is still valid
 */
export function isOtpVerified(): boolean {
  const verified = sessionStorage.getItem(OTP_VERIFIED_KEY);
  const timestampStr = sessionStorage.getItem(OTP_VERIFIED_TIMESTAMP_KEY);

  if (verified !== 'true' || !timestampStr) {
    return false;
  }

  const timestamp = parseInt(timestampStr, 10);
  const now = Date.now();
  const elapsed = now - timestamp;

  if (elapsed > OTP_VERIFIED_EXPIRY_MS) {
    // Expired, clear it
    clearOtpVerified();
    return false;
  }

  return true;
}

/**
 * Get verified phone number (if OTP was verified)
 */
export function getVerifiedPhone(): string | null {
  if (!isOtpVerified()) {
    return null;
  }
  return getOtpRequestedPhone();
}

/**
 * Clear OTP verification status
 */
export function clearOtpVerified(): void {
  sessionStorage.removeItem(OTP_VERIFIED_KEY);
  sessionStorage.removeItem(OTP_VERIFIED_TIMESTAMP_KEY);
}

/**
 * Clear all signup flow data
 */
export function clearSignupFlow(): void {
  clearOtpRequestedPhone();
  clearOtpVerified();
}

