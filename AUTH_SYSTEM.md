# 🔐 Authentication System Documentation

## Overview

This document describes the authentication system implementation for the Jade Property web application. The system uses **HttpOnly Cookies** for secure token storage, providing protection against XSS attacks while maintaining a seamless user experience.

## 🏗️ Architecture

### Authentication Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Login    │───▶│  API Server     │───▶│  HttpOnly       │
│   (Email/Phone) │    │  (JWT Issuance) │    │  Cookie Storage │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  AuthContext    │◀───│  Auto Cookie    │◀───│  Protected      │
│  State Update   │    │  Inclusion      │    │  Routes         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tech Stack

- **Frontend**: React 19 + TypeScript
- **State Management**: React Context API
- **API Client**: Custom fetch-based client with TanStack Query
- **Token Storage**: HttpOnly Cookies (server-managed)
- **Route Protection**: React Router with ProtectedRoute component

## 📁 File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication state management
├── services/
│   └── api/
│       ├── client.ts             # Base API client with cookie support
│       └── auth.ts               # Authentication API endpoints
├── hooks/
│   └── mutations/
│       └── useLogin.ts           # TanStack Query login mutation
├── types/
│   └── auth.ts                   # Authentication type definitions
├── pages/
│   └── SignIn.tsx                # Login page component
└── routes/
    └── ProtectedRoute.tsx        # Route protection component
```

## 🔧 Core Components

### 1. AuthContext (`/src/contexts/AuthContext.tsx`)

**Purpose**: Centralized authentication state management

**Key Features**:
- Automatic authentication check on app load
- User state management
- Guest mode support
- Loading state handling

**API**:
```typescript
interface AuthContextType {
  user: User | null;
  signInAsGuest: () => void;
  signOut: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
}
```

**Usage**:
```typescript
const { user, isAuthenticated, signOut, checkAuth } = useAuth();
```

### 2. API Client (`/src/services/api/client.ts`)

**Purpose**: HTTP client with automatic cookie handling

**Key Features**:
- Automatic cookie inclusion (`credentials: 'include'`)
- Error handling with detailed API responses
- Request/response interceptors
- Timeout management

**Configuration**:
```typescript
// Only include credentials for authentication endpoints
const isAuthEndpoint = endpoint.includes('/auth/');

const response = await fetch(url, {
  ...fetchOptions,
  credentials: isAuthEndpoint ? 'include' : 'same-origin',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...headers,
  },
});
```

### 3. Auth API (`/src/services/api/auth.ts`)

**Purpose**: Authentication-specific API endpoints

**Endpoints**:
- `POST /api/v1/frontend/auth/login` - User login
- `GET /api/v1/frontend/auth/profile` - Get user profile
- `POST /api/v1/frontend/auth/logout` - User logout

**Usage**:
```typescript
// Login
const response = await authApi.login({
  type: 'email',
  email: 'user@example.com',
  password: 'password123'
});

// Get profile (cookies automatically included)
const user = await authApi.getProfile();

// Logout
await authApi.logout();
```

### 4. SignIn Component (`/src/pages/SignIn.tsx`)

**Purpose**: User authentication interface

**Features**:
- Email/Password login
- Phone/Password login (Myanmar format)
- Guest mode access
- Form validation
- Error handling
- Responsive design

**Login Methods**:
```typescript
// Email Login
{
  type: 'email',
  email: 'user@example.com',
  password: 'password123'
}

// Phone Login
{
  type: 'phone',
  phone: '09422758699',
  password: 'password123'
}
```

### 5. ProtectedRoute (`/src/routes/ProtectedRoute.tsx`)

**Purpose**: Route protection for authenticated users

**Usage**:
```typescript
<Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />
```

## 🔒 Security Features

### HttpOnly Cookies

**Benefits**:
- **XSS Protection**: JavaScript cannot access authentication tokens
- **Automatic Handling**: Browser manages cookie inclusion
- **Server Control**: Server sets secure cookie flags

**Server-Side Cookie Configuration** (Recommended):
```javascript
res.cookie('auth_token', token, {
  httpOnly: true,    // Prevents XSS attacks
  secure: true,      // HTTPS only in production
  sameSite: 'strict', // CSRF protection
  maxAge: 3600000    // 1 hour expiration
});
```

### Input Validation

**Phone Number Validation**:
- Myanmar format: `09XXXXXXXXX` (11 digits)
- Auto-prefix: Automatically adds "09" if 9 digits entered
- Numbers only: Strips non-numeric characters

**Email Validation**:
- Standard email format validation
- Required field validation

### Error Handling

**API Error Structure**:
```typescript
{
  success: false,
  message: "Validation failed",
  errors: {
    email: ["Invalid credentials."],
    password: ["Password is required."]
  }
}
```

**Client-Side Error Display**:
- General error messages above forms
- Field-specific validation
- User-friendly error messages

## 🚀 Usage Examples

### Basic Authentication Check

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user?.name}!</div>;
}
```

### Protected Route Implementation

```typescript
import { ProtectedRoute } from '@/routes/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
```

### Login Implementation

```typescript
import { useLogin } from '@/hooks/mutations/useLogin';
import { useAuth } from '@/contexts/AuthContext';

function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  const { checkAuth } = useAuth();

  const handleLogin = async (credentials) => {
    login(credentials, {
      onSuccess: async () => {
        await checkAuth(); // Refresh user state
        navigate('/dashboard');
      },
      onError: (error) => {
        console.error('Login failed:', error);
      }
    });
  };
}
```

## 📊 User Data Structure

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  user_type: string;           // 'individual' | 'company'
  member_level: string;        // 'bronze' | 'silver' | 'gold' | 'platinum'
  is_active: boolean;
  member_since: string;        // ISO date string
  last_login_at: string;       // ISO date string
  profile_image_url: string;
  point_balance: number;
  total_points_allocated: number;
  total_points_consumed: number;
  isGuest?: boolean;           // For guest users
  points?: number;             // Alias for point_balance
}
```

## 🔄 Authentication States

### Loading State
- **Initial Load**: Checking existing authentication
- **Login Process**: Submitting credentials
- **Profile Fetch**: Getting user data after login

### Authenticated State
- **User Data**: Complete user profile loaded
- **Session Active**: Valid authentication cookie
- **Protected Access**: Full application access

### Guest State
- **Limited Access**: Read-only features
- **No Persistence**: Session not saved
- **Upgrade Prompt**: Encourages registration

### Unauthenticated State
- **Public Access**: Only public pages
- **Login Required**: Redirected to sign-in
- **No User Data**: No profile information

## 🛠️ Development Guidelines

### Adding New Protected Routes

1. **Define Route**:
```typescript
// In routes/index.ts
{ path: '/new-feature', component: NewFeature, protected: true }
```

2. **Wrap Component**:
```typescript
// In AppRoutes.tsx
<Route path="/new-feature" element={
  <ProtectedRoute>
    <NewFeature />
  </ProtectedRoute>
} />
```

### Adding Authentication Checks

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user } = useAuth();
  
  // Check authentication
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  // Check user permissions
  if (user?.member_level === 'bronze') {
    return <UpgradePrompt />;
  }
  
  return <PremiumFeature />;
}
```

### Error Handling Best Practices

```typescript
// API Error Handling
try {
  const response = await authApi.login(credentials);
  // Handle success
} catch (error) {
  // Handle API errors
  const errorMessage = error?.response?.data?.message || 'Login failed';
  showError(errorMessage);
}

// Form Validation
const validateForm = (data) => {
  const errors = {};
  
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Invalid email format';
  }
  
  return errors;
};
```

## 🧪 Testing Considerations

### Unit Tests
- AuthContext state management
- API client cookie handling
- Form validation logic
- Error handling scenarios

### Integration Tests
- Login flow end-to-end
- Protected route access
- Session persistence
- Logout functionality

### Security Tests
- XSS prevention verification
- CSRF protection testing
- Cookie security validation
- Input sanitization

## 🚀 Deployment Considerations

### Production Configuration

1. **HTTPS Required**: Secure cookies require HTTPS
2. **Cookie Domain**: Set appropriate domain for cookies
3. **CORS Configuration**: Configure cross-origin requests
4. **Environment Variables**: Secure API endpoints

### Server-Side Requirements

1. **Cookie Management**: Set HttpOnly, Secure, SameSite flags
2. **Token Validation**: Implement JWT validation middleware
3. **Session Cleanup**: Handle logout and token expiration
4. **Rate Limiting**: Prevent brute force attacks

## 📈 Future Enhancements

### Planned Features
- [ ] Refresh token implementation
- [ ] Two-factor authentication
- [ ] Social login integration
- [ ] Password reset flow
- [ ] Account lockout protection
- [ ] Device management
- [ ] Session analytics

### Security Improvements
- [ ] CSRF token implementation
- [ ] Content Security Policy
- [ ] Rate limiting on client
- [ ] Biometric authentication
- [ ] Advanced session management

## 🐛 Troubleshooting

### Common Issues

**Login Not Working**:
- Check API endpoint configuration
- Verify cookie domain settings
- Ensure HTTPS in production

**CORS Errors**:
- **Cause**: `credentials: 'include'` triggers CORS preflight
- **Solution**: Server must respond with proper CORS headers
- **Quick Fix**: Use conditional credentials (implemented)
- **Server Fix**: Configure CORS middleware with `credentials: true`

**Session Not Persisting**:
- Verify cookie expiration settings
- Check browser cookie policies
- Ensure proper logout implementation

**Protected Routes Not Working**:
- Verify ProtectedRoute wrapper
- Check authentication state
- Ensure proper route configuration

### Debug Tools

**Console Logging** (Added to AuthContext):
```typescript
// Check authentication state
console.log('Auth State:', { user, isAuthenticated, isLoading });

// Check API responses
console.log('API Response:', response);

// Check cookie status (Note: HttpOnly cookies won't show here)
console.log('Cookies:', document.cookie);
```

**Visual Debug Component** (Development Only):
- Added `AuthDebug` component that shows in bottom-right corner
- Displays real-time authentication state
- Only visible in development mode
- Shows user details, status, and loading state

**Browser Developer Tools**:
1. **Application Tab** → **Cookies** → Select your API domain
2. **Network Tab** → Look for `/auth/profile` requests
3. **Console Tab** → Check authentication logs

## 📞 Support

For authentication-related issues:
1. Check this documentation
2. Review error logs
3. Test with different browsers
4. Verify server configuration
5. Contact development team

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team
