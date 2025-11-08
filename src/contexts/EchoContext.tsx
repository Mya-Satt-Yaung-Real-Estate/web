/**
 * Echo Context
 * 
 * Provides Laravel Echo instance for real-time broadcasting
 */

import React, { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import Echo from 'laravel-echo';
import { useAuthStore } from '@/stores/authStore';
import { initializeEcho, disconnectEcho } from '@/config/echo';

interface EchoContextType {
  echo: Echo<any> | null;
}

const EchoContext = createContext<EchoContextType>({ echo: null });

export const useEcho = () => {
  const context = useContext(EchoContext);
  if (!context) {
    throw new Error('useEcho must be used within EchoProvider');
  }
  return context;
};

interface EchoProviderProps {
  children: ReactNode;
}

export function EchoProvider({ children }: EchoProviderProps) {
  const { token, isAuthenticated } = useAuthStore();
  const echoRef = useRef<Echo<any> | null>(null);
  const [echo, setEcho] = React.useState<Echo<any> | null>(null);

  useEffect(() => {
    // Initialize Echo when user is authenticated
    if (isAuthenticated && token) {
      // Disconnect existing Echo if token changed
      if (echoRef.current) {
        disconnectEcho(echoRef.current);
        echoRef.current = null;
      }
      
      const newEcho = initializeEcho(token);
      echoRef.current = newEcho;
      setEcho(newEcho);
    } else {
      // Disconnect when user logs out
      if (echoRef.current) {
        disconnectEcho(echoRef.current);
        echoRef.current = null;
        setEcho(null);
      }
    }

    // Cleanup on unmount
    return () => {
      if (echoRef.current) {
        disconnectEcho(echoRef.current);
        echoRef.current = null;
        setEcho(null);
      }
    };
  }, [isAuthenticated, token]);

  return (
    <EchoContext.Provider value={{ echo }}>
      {children}
    </EchoContext.Provider>
  );
}

