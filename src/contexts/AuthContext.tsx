import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  isGuest: boolean;
  points: number;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, _password: string) => Promise<void>;
  signInWithPhone: (phone: string, _otp: string) => Promise<void>;
  signUp: (name: string, email: string, _password: string) => Promise<void>;
  signUpWithPhone: (name: string, phone: string) => Promise<void>;
  signInAsGuest: () => void;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, _password: string) => {
    // Mock authentication - in real app this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      id: '1',
      name: email.split('@')[0],
      email,
      isGuest: false,
      points: 1250,
    });
  };

  const signInWithPhone = async (phone: string, _otp: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      id: '2',
      name: 'User',
      phone,
      isGuest: false,
      points: 980,
    });
  };

  const signUp = async (name: string, email: string, _password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      id: '3',
      name,
      email,
      isGuest: false,
      points: 500,
    });
  };

  const signUpWithPhone = async (name: string, phone: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      id: '4',
      name,
      phone,
      isGuest: false,
      points: 500,
    });
  };

  const signInAsGuest = () => {
    setUser({
      id: 'guest',
      name: 'Guest',
      isGuest: true,
      points: 0,
    });
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signInWithPhone,
        signUp,
        signUpWithPhone,
        signInAsGuest,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}