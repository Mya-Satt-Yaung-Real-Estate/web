/**
 * Places API (New) — PlaceAutocompleteElement (replaces legacy Autocomplete).
 * Requires Places API (New) enabled on the Google Cloud key.
 */

export type PlacePicked = {
  lat: number;
  lng: number;
  name?: string | null;
  address?: string | null;
};

export type PlaceAutocompleteHandle = {
  destroy: () => void;
};

type PlaceSelectEventLike = Event & {
  placePrediction?: {
    toPlace: () => {
      fetchFields: (opts: { fields: string[] }) => Promise<void>;
      location?: { lat: () => number; lng: () => number } | null;
      displayName?: string | null;
      formattedAddress?: string | null;
    };
  };
};

const STYLE_TAG_ID = 'msy-place-autocomplete-light';

/**
 * Force light theme so OS dark mode does not turn the widget black on Jade cream UI.
 */
function ensurePlaceAutocompleteLightStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_TAG_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_TAG_ID;
  style.textContent = `
    .msy-place-search-host {
      color-scheme: light;
      background: #ffffff;
      border: 1px solid hsl(var(--border, 30 10% 82%));
      border-radius: 0.375rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      overflow: visible;
      min-height: 2.5rem;
    }
    .msy-place-search-host gmp-place-autocomplete {
      width: 100%;
      display: block;
      color-scheme: light !important;
      background-color: #ffffff !important;
      color: #1f2937 !important;
      border: none !important;
      border-radius: 0.375rem !important;
      font-family: inherit !important;
      font-size: 0.875rem !important;
      line-height: 1.25rem !important;
      --gmp-mat-color-surface: #ffffff;
      --gmp-mat-color-on-surface: #1f2937;
      --gmp-mat-color-on-surface-variant: #6b7280;
      --gmp-mat-color-outline: #d1d5db;
      --gmp-mat-color-primary: #15803d;
    }
    .msy-place-search-host:focus-within {
      border-color: hsl(var(--ring, 142 50% 35%));
      box-shadow: 0 0 0 2px hsl(var(--ring, 142 50% 35%) / 0.25),
        0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
  `;
  document.head.appendChild(style);
}

function applyLightAppearance(element: HTMLElement): void {
  element.style.setProperty('color-scheme', 'light');
  element.style.setProperty('background-color', '#ffffff');
  element.style.setProperty('color', '#1f2937');
  element.style.setProperty('border', 'none');
  element.style.setProperty('border-radius', '0.375rem');
  element.style.width = '100%';
  element.style.display = 'block';
}

/**
 * Mount Places API (New) autocomplete into a container (clears previous children).
 */
export async function mountPlaceAutocompleteNew(
  container: HTMLElement,
  options: {
    placeholder?: string;
    /** Prefer Myanmar results for Jade. */
    includedRegionCodes?: string[];
    onPlace: (place: PlacePicked) => void;
  }
): Promise<PlaceAutocompleteHandle> {
  ensurePlaceAutocompleteLightStyles();
  container.classList.add('msy-place-search-host');

  const placesLib = (await google.maps.importLibrary('places')) as {
    PlaceAutocompleteElement?: new (opts?: {
      includedRegionCodes?: string[];
      placeholder?: string;
    }) => HTMLElement & {
      placeholder?: string;
      style: CSSStyleDeclaration;
    };
  };

  const PlaceAutocompleteElement =
    placesLib.PlaceAutocompleteElement ?? google.maps.places?.PlaceAutocompleteElement;

  if (!PlaceAutocompleteElement) {
    throw new Error(
      'PlaceAutocompleteElement not available. Enable Places API (New) and ensure Maps JS places library is loaded.'
    );
  }

  const element = new PlaceAutocompleteElement({
    includedRegionCodes: options.includedRegionCodes ?? ['mm'],
  });

  if (options.placeholder) {
    element.placeholder = options.placeholder;
  }

  applyLightAppearance(element);
  container.replaceChildren(element);

  const onSelect = async (raw: Event) => {
    const event = raw as PlaceSelectEventLike;
    const prediction = event.placePrediction;
    if (!prediction) return;

    const place = prediction.toPlace();
    await place.fetchFields({
      fields: ['location', 'displayName', 'formattedAddress'],
    });

    const loc = place.location;
    if (!loc) return;

    options.onPlace({
      lat: loc.lat(),
      lng: loc.lng(),
      name: place.displayName ?? null,
      address: place.formattedAddress ?? null,
    });
  };

  element.addEventListener('gmp-select', onSelect);

  return {
    destroy: () => {
      element.removeEventListener('gmp-select', onSelect);
      if (element.parentElement === container) {
        container.removeChild(element);
      }
    },
  };
}
