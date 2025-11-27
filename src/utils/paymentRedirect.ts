import type { PaymentProvider, PaymentMethod } from '@/types/payments';

export function requiresRedirect(provider: PaymentProvider, method: PaymentMethod): boolean {
  
  const noRedirectProviders: PaymentProvider[] = ['AYA Pay', 'Onepay', 'Sai Sai Pay'];
  
  if (provider === 'KBZ Pay' && method === 'QR') {
    return false;
  }
  
  // CB Pay QR needs redirect (special case)
  if (provider === 'CB Pay' && method === 'QR') {
    return true;
  }
  
  if (noRedirectProviders.includes(provider)) {
    return false;
  }
  
  return method === 'PIN' || method === 'PWA';
}


export function buildRedirectUrl(
  provider: PaymentProvider,
  method: PaymentMethod,
  formToken: string,
  transactionNum: string,
  merchantOrderId: string
): string | null {
  if (!formToken || !transactionNum || !merchantOrderId) {
    return null;
  }

  const baseUrl = 'https://portal.dinger.asia';

  // CB Pay QR Gateway
  if (provider === 'CB Pay' && method === 'QR') {
    return `${baseUrl}/gateway/cbpay?transactionNumber=${encodeURIComponent(transactionNum)}&formToken=${encodeURIComponent(formToken)}&merchantOrderId=${encodeURIComponent(merchantOrderId)}`;
  }

  // M-Pitesan Gateway
  if (provider === 'MPitesan') {
    return `${baseUrl}/gateway/mpitesan?transactionNumber=${encodeURIComponent(transactionNum)}&formToken=${encodeURIComponent(formToken)}&merchantOrderId=${encodeURIComponent(merchantOrderId)}`;
  }

  // Default redirect for: Wave Pay, OK$, MPT Pay, UAB Pay
  // Uses transactionNo (not transactionNumber)
  return `${baseUrl}/gateway/redirect?transactionNo=${encodeURIComponent(transactionNum)}&formToken=${encodeURIComponent(formToken)}&merchantOrderId=${encodeURIComponent(merchantOrderId)}`;
}

/**
 * Redirects to payment gateway in the same window
 * 
 * @param url - Redirect URL
 * @returns true if redirect was initiated, false if failed
 */
export function redirectToPaymentGateway(url: string): boolean {
  if (!url) {
    console.error('Payment redirect URL is empty');
    return false;
  }

  try {
    // Redirect in the same window
    window.location.href = url;
    return true;
  } catch (error) {
    console.error('Error redirecting to payment gateway:', error);
    return false;
  }
}

