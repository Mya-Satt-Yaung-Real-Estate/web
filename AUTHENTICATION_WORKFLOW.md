# 🔐 Authentication Workflow Documentation (Refactored Zustand Implementation)

## Overview
This document explains the complete authentication workflow in the Jade Property web application using a clean Zustand implementation for state management, from login to profile dropdown display.

## 🏗️ Architecture Overview

### **Clean Architecture:**
- ✅ **Zustand Store** - Single source of truth for auth state
- ✅ **No Context Wrapper** - Direct Zustand usage
- ✅ **Built-in Persistence** - Automatic token storage
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Performance** - No unnecessary re-renders

## 📋 Step-by-Step Authentication Flow

### **Step 1: User Initiates Login**
```
User Action: Clicks "Sign In" button or navigates to /signin
Location: SignIn.tsx component
State: isAuthenticated = false, user = null
UI: Shows "Sign In" button in header
```

### **Step 2: User Submits Login Form**
```
User Action: Enters email/phone + password, clicks "Sign In"
Location: SignIn.tsx → handleEmailSignIn() or handlePhoneSignIn()
Process: 
  1. Validates form data
  2. Creates LoginRequest object
  3. Calls login mutation
```

### **Step 3: Login API Call**
```
API Call: POST /api/v1/frontend/auth/login
Payload: { type: "email", email: "user@example.com", password: "password123" }
Location: authApi.login() → apiClient.post()
Process:
  1. Sends credentials to Laravel backend
  2. Backend validates credentials
  3. Backend creates Sanctum token
  4. Returns Bearer token in response
```

### **Step 4: Login Success Handler**
```
Location: SignIn.tsx → login() onSuccess callback
Process:
  1. Login API call succeeds
  2. Bearer token received in response
  3. Token stored in Zustand store (with persistence)
  4. Calls checkAuth() to refresh user state
  5. Shows success message
  6. Navigates to home page
```

### **Step 5: Auth State Refresh**
```
Location: Zustand Store → checkAuth()
Process:
  1. Checks Zustand store for token
  2. If token exists, calls authApi.getProfile()
  3. Browser automatically includes Bearer token in Authorization header
  4. Backend validates token from header
  5. Returns user profile data
  6. Updates Zustand store with user data
```

### **Step 6: Profile API Call**
```
API Call: GET /api/v1/frontend/profile
Headers: Authorization: Bearer <token> (automatically included)
Location: authApi.getProfile() → apiClient.get()
Response: {
  "success": true,
  "data": {
    "user_id": 10,
    "name": "ဂူဂျွန်ဖြိုး",
    "email": "kk@gmail.com",
    "phone": "09971238422",
    "current_point": 32,
    // ... other user data
  }
}
```

### **Step 7: User State Update**
```
Location: Zustand Store → checkAuth() success handler
Process:
  1. Receives user data from API
  2. Adds backward compatibility fields:
     - id: userData.user_id
     - is_active: userData.verify_account
     - points: userData.current_point
  3. Updates Zustand store state
  4. isAuthenticated becomes true (!!user && user.user_id !== 0)
  5. All subscribed components re-render automatically
```

### **Step 8: Navigation Component Re-render**
```
Location: Navigation.tsx
Trigger: Zustand store state change (user, isAuthenticated)
Process:
  1. useAuthStore() hook returns updated state from Zustand
  2. isAuthenticated = true
  3. user = { user_id: 10, name: "ဂူဂျွန်ဖြိုး", ... }
  4. Component re-renders with new state
  5. No unnecessary re-renders (Zustand optimization)
  6. No Context Provider needed (Direct Zustand usage)
```

### **Step 9: UI State Change**
```
Before Login:
- Header shows "Sign In" button
- No profile dropdown
- No notification dropdown

After Login:
- Header shows user profile dropdown
- Profile dropdown shows:
  - User avatar (gradient circle)
  - User name: "ဂူဂျွန်ဖြိုး"
  - Email: "kk@gmail.com"
  - Phone: "09971238422"
  - Points: 32
  - Menu items (Profile, Favorites, Settings, etc.)
  - Sign Out button
- Notification dropdown appears
```

## 🔄 State Flow Diagram

```
Initial State:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User State    │    │ AuthContext     │    │   Navigation    │
│                 │    │                 │    │                 │
│ user: null      │───▶│ isAuthenticated │───▶│ Shows "Sign In" │
│ isAuthenticated │    │ = false         │    │ button          │
│ = false         │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘

After Login Success:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User State    │    │ AuthContext     │    │   Navigation    │
│                 │    │                 │    │                 │
│ user: {         │───▶│ isAuthenticated │───▶│ Shows Profile   │
│   user_id: 10,  │    │ = true          │    │ Dropdown        │
│   name: "ဂူဂျွန်ဖြိုး",│    │                 │                 │
│   points: 32    │    │                 │    │                 │
│ }               │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technical Implementation Details

### **API Client Configuration**
```typescript
// client.ts
const token = useAuthStore.getState().token;
headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` }),
  ...options.headers,
}

// This ensures:
// - Bearer token is included in Authorization header for authenticated requests
// - Token retrieved from Zustand store (with persistence)
// - No credentials needed (no cookies)
```

### **Zustand Store Handling**
```typescript
// Token is stored in Zustand store with persistence
setToken(response.data.token);

// Token is automatically included in Authorization header
headers: {
  'Authorization': `Bearer ${token}`
}

// Token is removed on logout
signOut(); // Clears both token and user data

// User data can be updated easily
updateUser({ name: 'New Name', points: 100 });
```

### **Backward Compatibility**
```typescript
// Maps API response to expected frontend structure
const userWithCompatibility = {
  ...userData,                    // Original API data
  id: userData.user_id,           // Map user_id → id
  is_active: userData.verify_account, // Map verify_account → is_active
  points: userData.current_point, // Map current_point → points
  point_balance: userData.current_point, // Alias for compatibility
};
```

## 🐛 Common Issues & Solutions

### **Issue 1: Profile Dropdown Not Appearing**
**Symptoms:** Login succeeds but header still shows "Sign In" button
**Causes:**
- Wrong API endpoint (404 error)
- API response structure mismatch
- Cookie not being sent
- State not updating properly

**Solution:** Check console for errors, verify API endpoint and response structure

### **Issue 2: Token Not Being Sent**
**Symptoms:** Profile API returns 401/403
**Causes:**
- Token not stored in localStorage
- Token expired or invalid
- Authorization header not being set

**Solution:** Check localStorage for token, verify token validity, check network headers

### **Issue 3: State Not Updating**
**Symptoms:** API succeeds but UI doesn't change
**Causes:**
- React state not triggering re-render
- Component not subscribing to auth context
- State update logic error

**Solution:** Check AuthContext provider, verify useAuth() usage

## 📊 Debugging Checklist

### **Step 1: Check Login API**
```bash
# Verify login endpoint works
curl -X POST http://localhost:8000/api/v1/frontend/auth/login \
  -H "Content-Type: application/json" \
  -d '{"type":"email","email":"test@example.com","password":"password"}'
```

### **Step 2: Check Profile API**
```bash
# Verify profile endpoint works (with Bearer token)
curl -X GET http://localhost:8000/api/v1/frontend/profile \
  -H "Authorization: Bearer your_token_here"
```

### **Step 3: Check Browser Console**
```javascript
// Look for these logs:
"SignIn: Login successful, calling checkAuth..."
"AuthContext: Checking authentication..."
"AuthContext: User data received: {...}"
"Navigation: isAuthenticated: true, user: {...}"
```

### **Step 4: Check Network Tab**
- Login request: POST /api/v1/frontend/auth/login
- Profile request: GET /api/v1/frontend/profile
- Verify Authorization header contains Bearer token

## 🎯 Expected Final State

After successful login, the application should be in this state:

```typescript
// AuthContext state
{
  user: {
    user_id: 10,
    name: "ဂူဂျွန်ဖြိုး",
    email: "kk@gmail.com",
    phone: "09971238422",
    current_point: 32,
    // ... other fields
  },
  isAuthenticated: true,
  isLoading: false
}

// Navigation UI
- Profile dropdown visible
- User avatar with gradient background
- User information displayed
- Points shown (32)
- Menu items available
- Sign Out button functional
```

## 🔄 Logout Flow

### **Step 1: User Clicks Sign Out**
```
User Action: Clicks "Sign Out" in profile dropdown
Location: Navigation.tsx → handleSignOut()
```

### **Step 2: Logout API Call**
```
API Call: POST /api/v1/frontend/auth/logout
Headers: Authorization: Bearer <token>
Location: authApi.logout()
Process: Backend invalidates token
```

### **Step 3: State Reset**
```
Location: AuthContext.tsx → signOut()
Process:
  1. Calls logout API
  2. Removes token from localStorage
  3. Sets user = null
  4. isAuthenticated becomes false
```

### **Step 4: UI Reset**
```
Location: Navigation.tsx
Process:
  1. Component re-renders
  2. Shows "Sign In" button
  3. Hides profile dropdown
  4. Hides notification dropdown
```

This workflow ensures a seamless authentication experience with proper state management and UI updates.
