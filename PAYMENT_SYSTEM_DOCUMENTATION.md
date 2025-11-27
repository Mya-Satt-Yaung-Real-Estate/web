# Payment Integration System Documentation

## Table of Contents

1. [Overview](#overview)
2. [Feature Flag System](#feature-flag-system)
3. [Payment Providers and Methods](#payment-providers-and-methods)
4. [Payment Flow](#payment-flow)
5. [Frontend Architecture](#frontend-architecture)
6. [Backend API](#backend-api)
7. [Redirect Logic](#redirect-logic)
8. [Customer Information Requirements](#customer-information-requirements)
9. [Payment Status Polling](#payment-status-polling)
10. [Return Handling](#return-handling)
11. [Error Handling](#error-handling)
12. [Database Schema](#database-schema)
13. [Configuration](#configuration)

---

## Overview

The Payment Integration System is a comprehensive payment gateway integration built on top of the Dinger payment platform. It allows users to purchase points using various Myanmar payment providers and credit cards.

### Key Features

- **Multi-Provider Support**: Supports 13 payment providers including local Myanmar payment apps and international credit cards
- **Multiple Payment Methods**: QR Code, PIN, PWA, and OTP methods
- **Feature Flag Control**: Toggle between integrated payment and manual purchase flows
- **Real-time Status Polling**: Automatic payment status updates
- **Redirect Support**: Handles both same-window and new-tab redirects
- **Customer Information Collection**: Conditional collection based on provider requirements

---

## Feature Flag System

The payment integration is controlled by a feature flag that determines which purchase flow to use.

### Configuration

The feature flag is stored in the backend point settings API:

**Endpoint**: `GET /api/v1/frontend/point-settings`

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "payment_integration_status": true  // or false
  }
}
```

### Frontend Implementation

**Hook**: `usePaymentIntegrationStatus()`

**Location**: `web/src/hooks/queries/usePaymentIntegrationStatus.ts`

**Usage**:
```typescript
const { isPaymentEnabled } = usePaymentIntegrationStatus();

if (isPaymentEnabled) {
  // Show payment integration modal
} else {
  // Show manual purchase modal
}
```

### Behavior

- **When `payment_integration_status = true`**: 
  - Shows `PaymentModal` with provider/method selection
  - Integrates with Dinger payment gateway
  - Handles automatic payment processing

- **When `payment_integration_status = false`**:
  - Shows manual purchase modal
  - Requires admin approval for point allocation
  - Traditional workflow

---

## Payment Providers and Methods

### Supported Providers

| Provider | Methods | Redirect Required | Customer Info Required |
|----------|---------|-------------------|----------------------|
| AYA Pay | QR, PIN | No | PIN only |
| KBZ Pay | QR | No (QR) | No |
| Wave Pay | PIN | Yes | No |
| OK$ | PIN | Yes (New Tab) | No |
| Sai Sai Pay | PIN | No | Yes |
| Onepay | PIN | No | Yes |
| MPitesan | PIN | Yes | Yes |
| MPT Pay | PIN | Yes | No |
| CB Pay | QR | Yes | No |
| UAB Pay | PIN | No | Yes |
| Visa | OTP | Yes | No |
| Master | OTP | Yes | No |
| JCB | OTP | Yes | No |

### Payment Methods

- **QR**: QR Code scanning (requires `qrCode` in response)
- **PIN**: PIN entry in payment app (requires transaction details)
- **PWA**: Progressive Web App method
- **OTP**: One-Time Password (used for credit cards)

### Provider-Method Mapping

```typescript
const PROVIDER_METHODS: Record<PaymentProvider, PaymentMethod[]> = {
  'AYA Pay': ['QR', 'PIN'],
  'KBZ Pay': ['QR'],
  'Wave Pay': ['PIN'],
  'OK$': ['PIN'],
  'Sai Sai Pay': ['PIN'],
  'Onepay': ['PIN'],
  'MPitesan': ['PIN'],
  'MPT Pay': ['PIN'],
  'CB Pay': ['QR'],
  'UAB Pay': ['PIN'],
  'Visa': ['OTP'],
  'Master': ['OTP'],
  'JCB': ['OTP'],
};
```

---

## Payment Flow

### Step-by-Step Flow

#### 1. Package Selection (`select` step)

**User Actions**:
- Selects a point package
- Clicks "Buy Now" button

**System Actions**:
- Checks `payment_integration_status`
- Opens `PaymentModal` if enabled
- Displays package summary

#### 2. Provider and Method Selection

**User Actions**:
- Selects payment provider
- Selects payment method (if multiple available)
- Enters customer information (if required)

**System Actions**:
- Auto-selects method if provider has only one
- Shows/hides customer info fields based on provider
- Validates customer phone number (11 digits, Myanmar format)

**Customer Information Logic**:
- **Shown for**: Sai Sai Pay, Onepay, MPitesan, AYA Pay (PIN), UAB Pay
- **Hidden for**: All other providers
- **QR Method**: Auto-fills from authenticated user profile
- **PIN Method**: Manual entry required (for providers that show fields)

#### 3. Billing Information (Credit Cards Only)

**User Actions**:
- Enters email address
- Enters billing address
- Enters billing city

**System Actions**:
- Validates email format
- Validates required fields

**Applies to**: Visa, Master, JCB

#### 4. Processing (`processing` step)

**System Actions**:
- Calls `POST /api/v2/website/payments/token`
- Sends payment request to Dinger API
- Creates `PointOrder` record
- Receives payment token response

**Request Payload**:
```typescript
{
  providerName: string;
  methodName: 'QR' | 'PIN' | 'PWA' | 'OTP';
  packageId: number;
  customerName?: string;
  customerPhone?: string;
  email?: string;        // Credit cards only
  billAddress?: string;  // Credit cards only
  billCity?: string;     // Credit cards only
}
```

**Response Structure**:
```json
{
  "status": "success",
  "message": "Payment executed successfully",
  "response": {
    "code": "000",
    "message": "Request Success",
    "time": "20251127 141621",
    "response": {
      "amount": 500,
      "merchOrderId": "JADE-1764229579473",
      "transactionNum": "TRX201708920251627141621",
      "qrCode": "...",        // For QR methods
      "formToken": "...",     // For redirect methods
      "sign": "...",
      "signType": "SHA256"
    }
  }
}
```

#### 5. Payment Execution (`payment` step)

**Three Possible Paths**:

##### A. QR Code Display (Non-Redirect QR Methods)

**Providers**: AYA Pay (QR), KBZ Pay (QR)

**Flow**:
- Displays QR code
- User scans with payment app
- System polls for payment status

##### B. PIN Instructions (Non-Redirect PIN Methods)

**Providers**: AYA Pay (PIN), Onepay, Sai Sai Pay, UAB Pay

**Flow**:
- Displays payment instructions
- Shows transaction details (amount, order ID)
- User completes payment in app
- System polls for payment status

##### C. Redirect (Redirect Methods)

**Providers**: Wave Pay, OK$, MPT Pay, CB Pay, MPitesan, Visa, Master, JCB

**Flow**:
- Builds redirect URL
- Redirects to payment gateway
  - **OK$**: Opens in new tab
  - **Others**: Same-window redirect
- User completes payment on gateway
- Returns to application with status

#### 6. Status Polling

**System Actions**:
- Polls `GET /api/v2/website/payments/order/{orderId}` every 5 seconds
- Maximum polling duration: 10 minutes
- Stops when status is: `SUCCESS`, `ERROR`, `CANCELLED`, `TIMEOUT`, `DECLINED`, `SYSTEM_ERROR`

**Status Values**:
- `SUCCESS`: Payment completed successfully
- `ERROR`: Payment failed
- `CANCELLED`: Payment cancelled by user
- `TIMEOUT`: Payment timed out
- `DECLINED`: Payment declined
- `SYSTEM_ERROR`: System error occurred

#### 7. Success/Error Handling

**Success Flow**:
- Updates `PointOrder` status
- Allocates points to user
- Creates `PointTransaction` record
- Sends notification
- Refreshes point balance
- Shows success message

**Error Flow**:
- Displays error message
- Allows retry
- Logs error details

---

## Frontend Architecture

### Component Structure

```
PointManagement/
├── index.tsx                    # Main page component
├── components/
│   ├── PackageList.tsx         # Package selection list
│   ├── PaymentModal.tsx        # Main payment modal (multi-step)
│   ├── PaymentProviderSelect.tsx # Provider selection
│   ├── PaymentMethodSelect.tsx  # Method selection
│   ├── QRCodeDisplay.tsx       # QR code display
│   └── PaymentStatusPolling.tsx # Status polling hook
```

### Key Components

#### PaymentModal

**Location**: `web/src/pages/PointManagement/components/PaymentModal.tsx`

**Props**:
```typescript
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: PointPackage | null;
  onPaymentSuccess?: () => void;
}
```

**Steps**:
- `select`: Provider/method selection
- `billingInfo`: Billing information (credit cards)
- `processing`: Payment processing
- `payment`: Payment execution (QR/PIN/redirect)
- `success`: Payment successful
- `error`: Payment error

**State Management**:
- Uses React Query for API calls
- Local state for form data
- Zustand for authentication

#### PaymentProviderSelect

**Location**: `web/src/pages/PointManagement/components/PaymentProviderSelect.tsx`

**Features**:
- Displays provider cards with logos
- Brand colors for each provider
- 5 providers per row
- Auto-selects method if provider has only one

#### PaymentMethodSelect

**Location**: `web/src/pages/PointManagement/components/PaymentMethodSelect.tsx`

**Features**:
- Only shows for providers with multiple methods (currently only AYA Pay)
- Auto-hides for single-method providers
- Icons for each method type

### Utilities

#### paymentRedirect.ts

**Location**: `web/src/utils/paymentRedirect.ts`

**Functions**:
- `requiresRedirect(provider, method)`: Determines if redirect is needed
- `buildRedirectUrl(...)`: Builds redirect URL for provider
- `shouldUseNewTab(provider)`: Determines if new tab redirect
- `redirectToPaymentGateway(url)`: Same-window redirect
- `openPaymentGatewayInNewTab(url)`: New tab redirect

#### phoneValidation.ts

**Location**: `web/src/utils/phoneValidation.ts`

**Function**: `validateMyanmarPhone(phone)`

**Validation Rules**:
- Must start with `09`
- Must be exactly 11 digits
- Numbers only
- Normalizes formats: `+959`, `959`, `9` → `09`

---

## Backend API

### Endpoints

#### 1. Get Payment Token

**Endpoint**: `POST /api/v2/website/payments/token`

**Controller**: `PaymentController@getPaymentToken`

**Request Validation**:
```php
'providerName' => 'required|in:AYA Pay,OK$,Sai Sai Pay,Onepay,MPitesan,MPT Pay,CB Pay,UAB Pay,KBZ Pay,Wave Pay,Visa,Master,JCB'
'methodName' => 'required' // Validated against provider methods
'packageId' => 'required'
'customerName' => 'nullable|string|max:255'
'customerPhone' => 'nullable|string|max:20' // Validated for PIN/PWA/OTP methods
'email' => 'nullable|email|max:255' // Required for credit cards
'billAddress' => 'nullable|string|max:500' // Required for credit cards
'billCity' => 'nullable|string|max:255' // Required for credit cards
```

**Process**:
1. Validates request
2. Gets package details
3. Creates `PointOrder` record
4. Authenticates with Dinger encryption API
5. Encrypts payment data
6. Calls Dinger payment token API
7. Returns payment token response

**Response**:
```json
{
  "status": "success",
  "message": "Payment executed successfully",
  "response": {
    "code": "000",
    "message": "Request Success",
    "time": "20251127 141621",
    "response": {
      "amount": 500,
      "merchOrderId": "JADE-1764229579473",
      "transactionNum": "TRX201708920251627141621",
      "qrCode": "...",      // For QR methods
      "formToken": "...",   // For redirect methods
      "sign": "...",
      "signType": "SHA256"
    }
  }
}
```

#### 2. Get Order Status

**Endpoint**: `GET /api/v2/website/payments/order/{orderId}`

**Controller**: `PaymentController@getPointOrderDetail`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_id": "JADE-1764229579473",
    "payment_status": "SUCCESS",
    "payment_provider": "AYA Pay",
    "status": "approved",
    "point_amount": 10,
    "price_mmk": 500,
    // ... other fields
  }
}
```

#### 3. Payment Callback

**Endpoint**: `POST /api/v2/website/payments/callback`

**Controller**: `PaymentController@dingerCallback`

**Process**:
1. Validates callback signature
2. Updates `PointOrder` status
3. Allocates points if payment successful
4. Creates `PointTransaction` record
5. Sends notification
6. Returns success response

**Callback Payload**:
```json
{
  "merchantOrderId": "JADE-1764229579473",
  "status": "SUCCESS",
  "sign": "...",
  "signType": "SHA256"
}
```

---

## Redirect Logic

### Redirect Determination

**Function**: `requiresRedirect(provider, method)`

**Logic**:
```typescript
// No redirect providers
const noRedirectProviders = ['AYA Pay', 'Onepay', 'Sai Sai Pay', 'UAB Pay'];

// Credit cards always redirect
if (provider === 'Visa' || provider === 'Master' || provider === 'JCB') {
  return true;
}

// Special cases
if (provider === 'KBZ Pay' && method === 'QR') return false;
if (provider === 'CB Pay' && method === 'QR') return true;

// Default: PIN/PWA/OTP methods require redirect
return method === 'PIN' || method === 'PWA' || method === 'OTP';
```

### Redirect URL Building

**Function**: `buildRedirectUrl(provider, method, formToken, transactionNum, merchantOrderId)`

**URL Patterns**:

1. **Credit Cards** (Visa, Master, JCB):
   ```
   https://creditcard-portal.dinger.asia/?merchantOrderId={merchantOrderId}&transactionNum={transactionNum}&formToken={formToken}
   ```

2. **CB Pay QR**:
   ```
   https://portal.dinger.asia/gateway/cbpay?transactionNumber={transactionNum}&formToken={formToken}&merchantOrderId={merchantOrderId}
   ```

3. **MPitesan**:
   ```
   https://portal.dinger.asia/gateway/mpitesan?transactionNumber={transactionNum}&formToken={formToken}&merchantOrderId={merchantOrderId}
   ```

4. **Default** (Wave Pay, OK$, MPT Pay):
   ```
   https://portal.dinger.asia/gateway/redirect?transactionNo={transactionNum}&formToken={formToken}&merchantOrderId={merchantOrderId}
   ```

### Redirect Methods

**New Tab Redirect**:
- **OK$**: Opens payment gateway in new tab
- User completes payment in new tab
- Original tab polls for status

**Same-Window Redirect**:
- **All other redirect providers**: Redirects in same window
- User completes payment
- Returns to application with query parameters

---

## Customer Information Requirements

### Providers Requiring Customer Info

The following providers require manual entry of customer name and phone:

- **Sai Sai Pay** (PIN)
- **Onepay** (PIN)
- **MPitesan** (PIN)
- **AYA Pay** (PIN only, not QR)
- **UAB Pay** (PIN)

### Providers NOT Requiring Customer Info

All other providers either:
- Use authenticated user's information (QR methods)
- Don't require customer info (redirect providers)

### Validation Rules

**Phone Number**:
- Format: `09XXXXXXXXX` (11 digits)
- Must start with `09`
- Numbers only
- Normalizes: `+959`, `959`, `9` → `09`

**Email** (Credit Cards Only):
- Standard email format validation
- Required for Visa, Master, JCB

**Billing Information** (Credit Cards Only):
- Billing Address: Required, max 500 characters
- Billing City: Required, max 255 characters

---

## Payment Status Polling

### Implementation

**Hook**: `usePaymentStatusPolling`

**Location**: `web/src/pages/PointManagement/components/PaymentStatusPolling.tsx`

### Configuration

- **Poll Interval**: 5 seconds
- **Max Duration**: 10 minutes
- **Stop Conditions**:
  - Payment status is `SUCCESS`
  - Payment status is `ERROR`, `CANCELLED`, `TIMEOUT`, `DECLINED`, `SYSTEM_ERROR`
  - Maximum duration reached

### Usage

```typescript
const {
  isLoading: isPolling,
  isTimeout,
} = usePaymentStatusPolling({
  orderId,
  enabled: step === 'payment' && !!orderId,
  onSuccess: (status) => {
    if (status === 'SUCCESS') {
      // Handle success
    }
  },
  onError: (error) => {
    // Handle error
  },
});
```

### Status Flow

1. **Initial**: Polling starts when payment step is reached
2. **Polling**: Checks order status every 5 seconds
3. **Success**: Stops polling, shows success message
4. **Timeout**: Shows timeout message after 10 minutes
5. **Error**: Stops polling, shows error message

---

## Return Handling

### Return URL Parameters

When users return from payment gateway redirects, the application receives query parameters:

**URL Format**: `/point-management?merchantOrderId={orderId}&state={status}`

**Parameters**:
- `merchantOrderId`: Order ID (e.g., `JADE-1764229579473`)
- `state`: Payment status (`SUCCESS`, `TIMEOUT`, `ERROR`, `CANCELLED`, `DECLINED`)

### Handling Logic

**Location**: `web/src/pages/PointManagement/index.tsx`

**Process**:
1. Checks for query parameters on page load
2. Validates `merchantOrderId` format
3. Maps `state` to payment status
4. Shows appropriate alert message
5. Refreshes point data
6. Clears query parameters

**Status Mapping**:
- `SUCCESS` → Success alert
- `TIMEOUT` → Timeout alert
- `ERROR` → Error alert
- `CANCELLED` → Cancelled alert
- `DECLINED` → Declined alert
- Unknown → Unknown status alert

---

## Error Handling

### Frontend Error Handling

#### Payment Token Request Errors

**Error Types**:
- Network errors
- Validation errors (422)
- Server errors (500)
- Invalid response structure

**Handling**:
- Displays error message in modal
- Allows retry
- Logs error details to console

#### Redirect Errors

**Error Types**:
- Popup blocked (new tab)
- Redirect failed
- Missing required fields

**Handling**:
- Shows error message
- Prevents duplicate error alerts
- Tracks new tab status with ref

#### Status Polling Errors

**Error Types**:
- Network errors
- Order not found
- Invalid status

**Handling**:
- Continues polling on retry
- Shows timeout message if max duration reached
- Logs errors to console

### Backend Error Handling

#### Payment Token Errors

**Error Types**:
- Validation failures
- Package not found
- Dinger API errors
- Database errors

**Handling**:
- Returns validation errors (422)
- Returns server errors (500)
- Logs errors to Laravel log
- Rolls back database transactions

#### Callback Errors

**Error Types**:
- Invalid signature
- Order not found
- Duplicate callback
- Database errors

**Handling**:
- Validates signature before processing
- Prevents duplicate processing
- Uses database transactions
- Logs errors to Laravel log

---

## Database Schema

### Point Orders Table

**Table**: `point_orders`

**Columns**:
- `id`: Primary key
- `user_id`: Foreign key to users
- `package_id`: Foreign key to point_packages
- `point_amount`: Points to be allocated
- `price_mmk`: Price in MMK
- `order_id`: Unique order identifier (e.g., `JADE-1764229579473`)
- `payment_status`: Enum (`SUCCESS`, `ERROR`, `CANCELLED`, `TIMEOUT`, `DECLINED`, `SYSTEM_ERROR`)
- `payment_provider`: Provider name
- `dinger_transaction_id`: Dinger transaction ID
- `dinger_provider_name`: Provider name from Dinger
- `dinger_method_name`: Method name from Dinger
- `status`: Order status (`pending`, `approved`, `failed`, `cancelled`)
- `payment_completed_at`: Timestamp
- `payment_failed_at`: Timestamp
- `payment_failure_reason`: Failure reason
- `points_allocated_at`: Timestamp
- `allocated_by`: User ID who allocated points
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Point Transactions Table

**Table**: `point_transactions`

**Columns**:
- `id`: Primary key
- `user_id`: Foreign key to users
- `transaction_type`: Enum (`CREDIT`, `DEBIT`)
- `points_amount`: Points amount
- `balance_before`: Balance before transaction
- `balance_after`: Balance after transaction
- `reference_type`: Enum (`point_order`, `property_renewal`, `property_upload`, etc.)
- `reference_id`: Reference ID (order ID, property ID, etc.)
- `description`: Transaction description
- `created_at`: Timestamp
- `updated_at`: Timestamp

---

## Configuration

### Environment Variables

#### Backend (.env)

```env
# Dinger API Configuration
DINGER_ENCRYPTION_EMAIL=encryption@dinger.asia
DINGER_ENCRYPTION_PASSWORD=your_encryption_password
DINGER_API_KEY=your_api_key
DINGER_PUBLIC_KEY=your_public_key
DINGER_PROJECT_NAME=Jade Property
DINGER_MERCHANT_NAME=Jade Property
DINGER_CALLBACK_KEY=your_callback_key
```

#### Frontend

No environment variables required. All configuration comes from backend API.

### System Configuration

**Payment Integration Status**:
- Controlled via backend point settings API
- Stored in `SystemConfiguration` or returned directly
- Default: `true` (enabled)

**Point Settings API**:
- Endpoint: `GET /api/v1/frontend/point-settings`
- Returns: `payment_integration_status` boolean

---

## API Integration Details

### Dinger Payment Gateway

#### Authentication Flow

1. **Encryption API Authentication**:
   ```
   POST https://encryption.dinger.asia/api/auth
   Body: { email, password }
   Response: { token }
   ```

2. **RSA Encryption**:
   ```
   POST https://encryption.dinger.asia/api/rsa-encrypt
   Headers: { Authorization: Bearer {token} }
   Body: { data, publicKey }
   Response: { encryptedData }
   ```

3. **Payment Token Request**:
   ```
   POST https://api.dinger.asia/api/token
   Headers: { Authorization: Bearer {apiKey} }
   Body: { encryptedPayload }
   Response: { paymentToken }
   ```

4. **Payment Execution**:
   ```
   POST https://api.dinger.asia/api/pay
   Headers: { Authorization: Bearer {apiKey} }
   Body: { paymentToken, ... }
   Response: { qrCode, formToken, transactionNum, ... }
   ```

#### Callback Handling

**Endpoint**: `POST /api/v2/website/payments/callback`

**Signature Validation**:
- Uses SHA256 signature
- Validates against `DINGER_CALLBACK_KEY`
- Prevents unauthorized callbacks

**Callback Payload**:
```json
{
  "merchantOrderId": "JADE-1764229579473",
  "status": "SUCCESS",
  "sign": "signature_hash",
  "signType": "SHA256"
}
```

---

## Testing Checklist

### Frontend Testing

- [ ] Feature flag toggle works correctly
- [ ] Provider selection displays all providers
- [ ] Method selection shows/hides correctly
- [ ] Customer info fields show/hide based on provider
- [ ] Phone validation works correctly
- [ ] QR code displays for QR methods
- [ ] PIN instructions display for PIN methods
- [ ] Redirect works for redirect providers
- [ ] New tab opens for OK$
- [ ] Status polling works correctly
- [ ] Success/error messages display correctly
- [ ] Return handling works with query parameters

### Backend Testing

- [ ] Payment token API validates input correctly
- [ ] Dinger API integration works
- [ ] Point order creation works
- [ ] Callback signature validation works
- [ ] Point allocation works on success
- [ ] Transaction creation works
- [ ] Notification sending works
- [ ] Error handling works correctly
- [ ] Database transactions rollback on error

---

## Troubleshooting

### Common Issues

#### 1. Payment Modal Not Showing

**Cause**: Feature flag is disabled
**Solution**: Check `payment_integration_status` in point settings API

#### 2. QR Code Not Displaying

**Cause**: Missing `qrCode` in API response
**Solution**: Check Dinger API response, verify provider/method combination

#### 3. Redirect Not Working

**Cause**: Missing `formToken` in API response
**Solution**: Check Dinger API response, verify redirect requirements

#### 4. Status Polling Not Stopping

**Cause**: Payment status not updating
**Solution**: Check callback endpoint, verify signature validation

#### 5. Customer Info Fields Not Showing

**Cause**: Provider not in `shouldShowCustomerInfo` list
**Solution**: Add provider to list in `PaymentModal.tsx`

#### 6. Phone Validation Failing

**Cause**: Invalid phone format
**Solution**: Ensure phone is 11 digits starting with `09`

---

## Future Enhancements

### Potential Improvements

1. **Payment Method Auto-Selection**: Auto-select method based on user preferences
2. **Payment History**: Display payment history in user dashboard
3. **Refund Support**: Implement refund functionality
4. **Multiple Currency Support**: Support multiple currencies
5. **Payment Retry**: Automatic retry for failed payments
6. **Analytics**: Payment analytics and reporting
7. **Webhook Support**: Additional webhook endpoints
8. **Mobile App Integration**: Native mobile app support

---

## Support and Maintenance

### Logging

**Frontend**:
- Console logs for debugging
- Error boundaries for error catching

**Backend**:
- Laravel log files
- Error logging in `storage/logs/laravel.log`
- Payment-specific logs with context

### Monitoring

**Key Metrics**:
- Payment success rate
- Average payment time
- Error rates by provider
- Callback processing time

### Maintenance Tasks

1. **Regular Updates**: Keep Dinger API SDK updated
2. **Security**: Review and update encryption keys
3. **Testing**: Regular end-to-end testing
4. **Monitoring**: Monitor payment success rates
5. **Documentation**: Keep documentation updated

---

## Conclusion

This payment integration system provides a comprehensive solution for point purchases through multiple payment providers. The system is designed to be flexible, maintainable, and user-friendly, with proper error handling and status tracking throughout the payment flow.

For questions or issues, please refer to the troubleshooting section or contact the development team.

---

**Last Updated**: November 27, 2025
**Version**: 1.0.0

