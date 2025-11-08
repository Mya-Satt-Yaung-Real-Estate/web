/**
 * Laravel Echo Configuration
 * 
 * Configures Laravel Echo with Pusher for real-time broadcasting
 */

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { CONFIG } from '@/lib/config';

// Extend Window interface for Pusher
declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any>;
  }
}

// Make Pusher available globally (required by Laravel Echo)
window.Pusher = Pusher;

/**
 * Initialize Laravel Echo instance
 */
export const initializeEcho = (authToken: string | null): Echo<any> | null => {
  // Don't initialize if no token or missing Pusher config
  if (!authToken || !import.meta.env.VITE_PUSHER_APP_KEY) {
    return null;
  }

  const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'ap1',
    forceTLS: true,
    authEndpoint: `${CONFIG.api.baseUrl}/api/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
    },
    enabledTransports: ['ws', 'wss'],
  });

  // Add connection logging
  echo.connector.pusher.connection.bind('connected', () => {
    console.log('✅ Pusher connected');
  });

  echo.connector.pusher.connection.bind('error', (err: any) => {
    console.error('❌ Pusher connection error:', err);
  });

  return echo;
};

/**
 * Clean up Echo instance
 */
export const disconnectEcho = (echo: Echo<any> | null): void => {
  if (echo) {
    try {
      echo.disconnect();
    } catch (error) {
      console.error('Error disconnecting Echo:', error);
    }
  }
};

