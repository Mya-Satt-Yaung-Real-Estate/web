/**
 * Load Google Maps JavaScript API once (Maps + Places).
 * Key comes from VITE_GOOGLE_MAPS_API_KEY.
 *
 * Note: Drawing library / DrawingManager was removed in Maps JS API 3.55+.
 * Phase B uses custom polygon click-to-draw instead.
 */

type GoogleMapsWindow = Window & {
  google?: typeof google;
  __msyGoogleMapsPromise?: Promise<typeof google>;
  gm_authFailure?: () => void;
  __msyGoogleMapsCallback?: () => void;
};

function getApiKey(): string {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  if (!key?.trim()) {
    throw new Error('Missing VITE_GOOGLE_MAPS_API_KEY in web/.env');
  }
  return key.trim();
}

/**
 * Resolves when window.google.maps is ready.
 */
export function loadGoogleMaps(): Promise<typeof google> {
  const w = window as GoogleMapsWindow;

  if (w.google?.maps) {
    return Promise.resolve(w.google);
  }

  if (w.__msyGoogleMapsPromise) {
    return w.__msyGoogleMapsPromise;
  }

  const apiKey = getApiKey();
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  w.__msyGoogleMapsPromise = new Promise<typeof google>((resolve, reject) => {
    const fail = (message: string) => {
      w.__msyGoogleMapsPromise = undefined;
      reject(new Error(message));
    };

    /**
     * Google calls this when the key/billing/referrer check fails.
     */
    w.gm_authFailure = () => {
      fail(
        `Google Maps auth failed for ${origin}. ` +
          'Add this origin to API key HTTP referrers ' +
          '(e.g. http://localhost:5173/*), enable Maps JavaScript API + Places API, ' +
          'and confirm billing is linked on the Google Cloud project.'
      );
    };

    w.__msyGoogleMapsCallback = () => {
      const g = (window as GoogleMapsWindow).google;
      if (!g?.maps) {
        fail('Google Maps callback ran but google.maps is missing');
        return;
      }
      resolve(g);
    };

    const script = document.createElement('script');
    script.id = 'msy-google-maps-js';
    script.async = true;
    script.defer = true;
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}` +
      '&libraries=places&v=weekly&callback=__msyGoogleMapsCallback';

    script.onerror = () => {
      fail('Failed to load Google Maps script (network or blocked).');
    };

    document.head.appendChild(script);
  });

  return w.__msyGoogleMapsPromise;
}
