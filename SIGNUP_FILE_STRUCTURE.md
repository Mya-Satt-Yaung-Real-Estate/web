# 📁 Signup System File Structure Proposal

## Overview
This document outlines the proposed file structure for the signup system, following the existing patterns from home and public properties features.

## 🎯 Pages Structure

```
src/pages/
├── signup/
│   ├── index.tsx                    # Main signup entry point (routes to OTP request)
│   ├── OtpRequest.tsx               # Step 1: OTP Request Page (phone/email input)
│   ├── OtpVerify.tsx                # Step 2: OTP Verification Page
│   ├── Register.tsx                 # Step 3: Registration Form Page
│   └── components/                  # Signup-specific components
│       ├── OtpRequestForm.tsx       # OTP request form component
│       ├── OtpVerifyForm.tsx        # OTP verification form component
│       ├── RegisterForm.tsx         # Registration form component
│       ├── UserTypeSelector.tsx     # Individual/Company selector
│       ├── PhoneInput.tsx            # Phone number input with validation
│       ├── EmailInput.tsx            # Email input with validation
│       ├── OtpInput.tsx              # OTP code input (6 digits)
│       ├── PasswordInput.tsx         # Password input with strength indicator
│       ├── CompanyFields.tsx         # Company-specific form fields
│       ├── IndividualFields.tsx     # Individual-specific form fields
│       └── index.ts                  # Component exports
```

## 🔧 Services Layer

```
src/services/
├── api/
│   ├── auth.ts                      # Extend existing auth.ts
│   │   └── Add:
│   │       ├── requestOtp()
│   │       ├── verifyOtp()
│   │       ├── registerIndividual()
│   │       └── registerCompany()
│   └── index.ts                     # Export new functions
├── queries/
│   └── auth.ts                      # Extend existing auth.ts
│       └── Add query keys for OTP operations
```

## 🪝 Hooks Layer

```
src/hooks/
├── mutations/
│   ├── useOtpRequest.ts             # Mutation hook for OTP request
│   ├── useOtpVerify.ts              # Mutation hook for OTP verification
│   ├── useRegister.ts               # Mutation hook for registration
│   └── index.ts                     # Export new hooks
```

## 📝 Types Layer

```
src/types/
├── auth.ts                          # Extend existing auth.ts
│   └── Add:
│       ├── OtpRequestRequest
│       ├── OtpRequestResponse
│       ├── OtpVerifyRequest
│       ├── OtpVerifyResponse
│       ├── RegisterIndividualRequest
│       ├── RegisterCompanyRequest
│       ├── RegisterResponse
│       └── SignupFlowState
```

## 🛣️ Routes

```
src/routes/
└── public.tsx                       # Add new routes:
    ├── /signup                      # → OtpRequest page
    ├── /signup/verify-otp           # → OtpVerify page
    └── /signup/register             # → Register page
```

## 🎨 Component Structure Details

### 1. **OtpRequest.tsx** (Step 1)
- User selects: Phone or Email
- User enters phone/email
- Validates phone format (09XXXXXXXXX) or email format
- Calls OTP request API
- On success: Navigate to `/signup/verify-otp` with phone/email in state

### 2. **OtpVerify.tsx** (Step 2)
- Receives phone/email from previous step (via location.state or URL params)
- Displays 6-digit OTP input
- Resend OTP functionality
- Calls OTP verify API
- On success: Navigate to `/signup/register` with verified phone/email

### 3. **Register.tsx** (Step 3)
- Receives verified phone/email from previous step
- User selects: Individual or Company
- Shows appropriate form fields:
  - **Individual**: name, password, password_confirmation
  - **Company**: name, password, password_confirmation, company_name, company_type_id, address, region_id, township_id, description
- Calls appropriate registration API
- On success: Auto-login and redirect to home

## 📦 Component Breakdown

### **OtpRequestForm.tsx**
- Tabs for Phone/Email selection (similar to SignIn)
- Phone input with auto-formatting (09XXXXXXXXX)
- Email input with validation
- Submit button with loading state

### **OtpVerifyForm.tsx**
- 6-digit OTP input (can use separate inputs or single input)
- Resend OTP button (with countdown timer)
- Verify button with loading state
- Error handling display

### **RegisterForm.tsx**
- User type selector (Individual/Company tabs)
- Conditional rendering based on user type
- Form validation
- Submit button with loading state

### **UserTypeSelector.tsx**
- Tabs component for Individual/Company selection
- Similar to SignIn email/phone tabs

### **PhoneInput.tsx**
- Phone number input with Myanmar format
- Auto-formatting (09XXXXXXXXX)
- Validation
- Error display

### **EmailInput.tsx**
- Email input with validation
- Error display

### **OtpInput.tsx**
- 6 separate input fields OR single input with formatting
- Auto-focus next field
- Paste support for full OTP

### **PasswordInput.tsx**
- Password input with show/hide toggle
- Password strength indicator (optional)
- Validation rules display

### **CompanyFields.tsx**
- Company name input
- Company type select dropdown
- Address textarea
- Region/Township select dropdowns
- Description textarea

### **IndividualFields.tsx**
- Name input
- Password inputs (password + confirmation)

## 🔄 Flow Diagram

```
User Flow:
1. /signup (OtpRequest)
   ↓
2. /signup/verify-otp (OtpVerify)
   ↓
3. /signup/register (Register)
   ↓
4. Auto-login → Redirect to /
```

## 📋 API Integration Points

### **OTP Request**
- Endpoint: `POST /api/v1/frontend/otp/request`
- Body: `{ type: 'phone' | 'email', phone?: string, email?: string, action_type: 'register' }`
- Response: `{ success: boolean, message: string, data?: { otp_code: string } }`

### **OTP Verify**
- Endpoint: `POST /api/v1/frontend/otp/verify`
- Body: `{ type: 'phone' | 'email', phone?: string, email?: string, otp_code: string, action_type: 'register' }`
- Response: `{ success: boolean, message: string }`

### **Register Individual**
- Endpoint: `POST /api/v1/frontend/auth/register/individual`
- Body: `{ name: string, email: string, phone?: string, password: string, password_confirmation: string, user_type: 'individual', is_active: boolean }`
- Response: `{ success: boolean, message: string, data: { user: ExtendedUser, token: string, token_type: string, trial_points?: {...} } }`

### **Register Company**
- Endpoint: `POST /api/v1/frontend/auth/register/company`
- Body: `{ name: string, email: string, phone?: string, password: string, password_confirmation: string, user_type: 'company', company_name: string, company_type_id: number, address?: string, region_id?: number, township_id?: number, description?: string, is_active: boolean }`
- Response: `{ success: boolean, message: string, data: { user: ExtendedUser, token: string, token_type: string, trial_points?: {...} } }`

## 🎨 UI/UX Considerations

1. **Consistent Design**: Follow SignIn page design patterns
   - Same card layout
   - Same gradient background
   - Same logo placement
   - Same button styles

2. **Progress Indicator**: Show step progress (1/3, 2/3, 3/3)

3. **Navigation**: 
   - Back button on verify and register pages
   - Link to SignIn page on each step

4. **Error Handling**:
   - Display API errors clearly
   - Field-level validation errors
   - General error messages

5. **Loading States**:
   - Button loading spinners
   - Disable forms during submission

6. **Success States**:
   - Success messages
   - Auto-redirect after successful operations

## 🌐 Internationalization

Add to `LanguageContext.tsx`:
- `signup.title`
- `signup.subtitle`
- `signup.otpRequest.title`
- `signup.otpRequest.phone`
- `signup.otpRequest.email`
- `signup.otpRequest.sendOtp`
- `signup.otpVerify.title`
- `signup.otpVerify.enterOtp`
- `signup.otpVerify.resendOtp`
- `signup.otpVerify.verify`
- `signup.register.title`
- `signup.register.individual`
- `signup.register.company`
- `signup.register.name`
- `signup.register.password`
- `signup.register.confirmPassword`
- `signup.register.companyName`
- `signup.register.companyType`
- `signup.register.address`
- `signup.register.description`
- `signup.register.submit`
- `signup.register.success`

## ✅ Implementation Checklist

- [ ] Create page components (OtpRequest, OtpVerify, Register)
- [ ] Create form components
- [ ] Extend auth API service
- [ ] Create mutation hooks
- [ ] Extend auth types
- [ ] Add routes to public.tsx
- [ ] Add translations to LanguageContext
- [ ] Implement phone validation
- [ ] Implement email validation
- [ ] Implement OTP input component
- [ ] Implement password strength (optional)
- [ ] Add error handling
- [ ] Add loading states
- [ ] Add success states
- [ ] Add progress indicator
- [ ] Test complete flow
- [ ] Test error scenarios
- [ ] Test validation

## 📝 Notes

- Follow the same patterns as SignIn page for consistency
- Use TanStack Query mutations for API calls
- Use React Router for navigation between steps
- Store phone/email in location.state or URL params between steps
- Auto-login after successful registration (using token from response)
- Handle OTP expiration and resend functionality
- Validate all inputs before API calls
- Show clear error messages from API responses

