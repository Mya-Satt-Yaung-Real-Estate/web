import { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import jadeLogo from '@/assets/jade.png';
import { loadGoogleMaps } from '@/lib/googleMapsLoader';
import {
  mountPlaceAutocompleteNew,
  type PlaceAutocompleteHandle,
} from '@/lib/placeAutocompleteNew';
import type { PropertyNoteBoundaryGeoJson, PropertyNoteMapPin } from '@/types/propertyNote';

/** Below this zoom: smaller pins / hide boundaries. At/above: larger + show area. */
const PIN_ZOOM_THRESHOLD = 14;
const DEFAULT_CENTER = { lat: 16.8661, lng: 96.1951 };

/** Legend colors: Notes=blue, Property=red, Selected=jade primary (ring). */
const NOTE_PIN_COLOR = '#2563eb';
const PROPERTY_PIN_COLOR = '#dc2626';
const SELECTED_PIN_COLOR = '#36846E';

/** Same height + hover as create/edit map toolbar. */
const MAP_TOOL_BTN =
  '!h-10 min-h-10 max-h-10 box-border shrink-0 rounded-md border border-input bg-white py-0 ' +
  'text-sm font-medium leading-none text-foreground shadow-md transition-colors ' +
  'hover:bg-primary/10 hover:text-primary ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-background';
const MAP_TOOL_ICON_BTN = `${MAP_TOOL_BTN} !w-10 p-0`;
const MAP_TOOL_SELECT = `${MAP_TOOL_BTN} cursor-pointer px-2.5 outline-none`;

/**
 * Always-available fallback (no network) — avoids browser broken-image icon.
 */
const DEFAULT_AVATAR =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
      '<rect width="64" height="64" fill="#e5e7eb"/>' +
      '<circle cx="32" cy="24" r="12" fill="#9ca3af"/>' +
      '<path d="M8 58c0-13.3 10.7-24 24-24s24 10.7 24 24" fill="#9ca3af"/>' +
      '</svg>'
  );

interface PropertyNoteMapCanvasProps {
  pins: PropertyNoteMapPin[];
  language: string;
  onViewDetails: (pin: PropertyNoteMapPin) => void;
  /** Last clicked pin — green ring. */
  activePin?: PropertyNoteMapPin | null;
  /** Marker click only (info window). Does not open the sidebar. */
  onPinClick?: (pin: PropertyNoteMapPin) => void;
}

function pinKey(pin: PropertyNoteMapPin): string {
  return `${String(pin.pin_type)}-${String(pin.id)}`;
}

function resolvePinImage(pin: PropertyNoteMapPin): string {
  if (pin.pin_type === 'property') {
    return jadeLogo;
  }
  return pin.owner?.avatar_url?.trim() || DEFAULT_AVATAR;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function boundaryToPath(boundary: PropertyNoteBoundaryGeoJson): google.maps.LatLngLiteral[] | null {
  const ring = boundary.coordinates?.[0];
  if (!Array.isArray(ring) || ring.length < 4) return null;
  const open =
    ring.length > 1 &&
    ring[0][0] === ring[ring.length - 1][0] &&
    ring[0][1] === ring[ring.length - 1][1]
      ? ring.slice(0, -1)
      : ring;
  if (open.length < 3) return null;
  return open.map(([lng, lat]) => ({ lat, lng }));
}

type HtmlPinHandle = {
  setMap: (map: google.maps.Map | null) => void;
  update: (opts: {
    position: google.maps.LatLngLiteral;
    imageUrl: string;
    ringColor: string;
    size: number;
    selected: boolean;
  }) => void;
};

/**
 * Circular logo/avatar pin (Leaflet DivIcon equivalent) via OverlayView.
 */
function createHtmlPin(
  map: google.maps.Map,
  position: google.maps.LatLngLiteral,
  opts: {
    imageUrl: string;
    ringColor: string;
    size: number;
    selected: boolean;
    title: string;
    onClick: () => void;
  }
): HtmlPinHandle {
  const Overlay = google.maps.OverlayView;
  let pos = position;
  let imageUrl = opts.imageUrl;
  let ringColor = opts.ringColor;
  let size = opts.size;
  let selected = opts.selected;
  let div: HTMLDivElement | null = null;

  class PinOverlay extends Overlay {
    onAdd() {
      div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.cursor = 'pointer';
      div.style.transform = 'translate(-50%, -50%)';
      div.title = opts.title;
      div.addEventListener('click', (e) => {
        e.stopPropagation();
        opts.onClick();
      });
      renderPin();
      this.getPanes()?.overlayMouseTarget.appendChild(div);
    }

    draw() {
      if (!div) return;
      const projection = this.getProjection();
      const point = projection.fromLatLngToDivPixel(pos);
      if (!point) return;
      div.style.left = `${point.x}px`;
      div.style.top = `${point.y}px`;
    }

    onRemove() {
      div?.remove();
      div = null;
    }
  }

  const renderPin = () => {
    if (!div) return;
    const borderColor = selected ? SELECTED_PIN_COLOR : ringColor;
    const borderWidth = selected ? 4 : 3;
    const shadow = selected
      ? '0 0 0 2px rgba(22,163,74,.35), 0 2px 6px rgba(0,0,0,.35)'
      : '0 1px 4px rgba(0,0,0,.35)';
    const safeUrl = escapeHtml(imageUrl);
    const safeFallback = escapeHtml(DEFAULT_AVATAR);
    div.innerHTML = `<span style="display:block;box-sizing:border-box;width:${size}px;height:${size}px;border-radius:9999px;overflow:hidden;border:${borderWidth}px solid ${borderColor};box-shadow:${shadow};background:#fff"><img src="${safeUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block" onerror="this.onerror=null;this.src='${safeFallback}'" /></span>`;
  };

  const overlay = new PinOverlay();
  overlay.setMap(map);

  return {
    setMap: (next) => overlay.setMap(next),
    update: (next) => {
      pos = next.position;
      imageUrl = next.imageUrl;
      ringColor = next.ringColor;
      size = next.size;
      selected = next.selected;
      renderPin();
      overlay.draw();
    },
  };
}

function buildInfoHtml(pin: PropertyNoteMapPin, mm: boolean): string {
        const listingName = pin.listing_type
          ? String(mm ? pin.listing_type.name_mm : pin.listing_type.name_en)
          : null;
        const placeName = pin.township
          ? String(mm ? pin.township.name_mm : pin.township.name_en)
          : pin.region
            ? String(mm ? pin.region.name_mm : pin.region.name_en)
            : null;
        const popupTitle =
          pin.pin_type === 'note' &&
          mm &&
          pin.listing_type?.name_en &&
          pin.listing_type?.name_mm &&
          pin.title.includes(pin.listing_type.name_en)
            ? pin.title.replace(pin.listing_type.name_en, pin.listing_type.name_mm)
            : pin.title;
        const priceRaw = pin.price_display;
        const priceLabel =
          typeof priceRaw === 'string' && priceRaw.trim() && priceRaw.trim() !== '.'
            ? priceRaw.trim()
            : null;
  const badge =
                      pin.pin_type === 'note'
                      ? mm
                        ? 'မှတ်စု'
                        : 'Note'
                      : mm
                        ? 'အိမ်'
        : 'Property';
  const badgeBg = pin.pin_type === 'note' ? '#2563eb' : '#dc2626';
  const detailsLabel =
    pin.pin_type === 'property'
      ? mm
        ? 'အကျဉ်းချုပ်'
        : 'Quick info'
      : mm
        ? 'အသေးစိတ် ကြည့်ရန်'
        : 'View details';

  const rows: string[] = [];
  if (pin.code) rows.push(`<div style="margin-top:4px;font-size:12px;color:#64748b"># ${escapeHtml(String(pin.code))}</div>`);
  if (listingName) rows.push(`<div style="margin-top:4px;font-size:12px;color:#64748b">${escapeHtml(listingName)}</div>`);
  if (placeName) rows.push(`<div style="margin-top:4px;font-size:12px;color:#64748b">${escapeHtml(placeName)}</div>`);
  if (priceLabel) rows.push(`<div style="margin-top:4px;font-size:12px;font-weight:600;color:#111">${escapeHtml(priceLabel)}</div>`);
  if (pin.phone_numbers?.length) {
    rows.push(`<div style="margin-top:4px;font-size:12px;color:#64748b">${escapeHtml(String(pin.phone_numbers[0]))}</div>`);
  }

  const propertyLink =
    pin.pin_type === 'property' && pin.slug
      ? `<a href="/properties/${escapeHtml(pin.slug)}" target="_blank" rel="noopener noreferrer" style="display:block;margin-top:8px;text-align:center;padding:6px 10px;border-radius:6px;background:#0f766e;color:#fff;text-decoration:none;font-size:12px;font-weight:500">${mm ? 'Property အသေးစိတ်' : 'View property details'}</a>`
      : '';

  return `<div style="min-width:220px;max-width:280px;padding:4px 2px" data-pn-info="${escapeHtml(pinKey(pin))}">
    <div style="display:flex;gap:8px;align-items:flex-start;justify-content:space-between">
      <div style="font-weight:600;font-size:13px;line-height:1.3">${escapeHtml(String(popupTitle ?? ''))}</div>
      <span style="flex-shrink:0;font-size:10px;color:#fff;background:${badgeBg};border-radius:9999px;padding:2px 8px">${escapeHtml(badge)}</span>
                </div>
    ${rows.join('')}
    ${propertyLink}
    <button type="button" data-pn-details="1" style="display:block;width:100%;margin-top:8px;padding:6px 10px;border-radius:6px;border:1px solid #e2e8f0;background:#fff;font-size:12px;cursor:pointer">${escapeHtml(detailsLabel)}</button>
  </div>`;
}

/**
 * Property notes browse map — Google Maps (satellite/hybrid) + circular pins + note boundaries.
 */
export function PropertyNoteMapCanvas({
  pins,
  language,
  onViewDetails,
  activePin = null,
  onPinClick,
}: PropertyNoteMapCanvasProps) {
  const mm = language === 'mm';
  /** Fullscreen this chrome so search stays available (same idea as create/edit map). */
  const mapChromeRef = useRef<HTMLDivElement | null>(null);
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const searchHostRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const placeSearchRef = useRef<PlaceAutocompleteHandle | null>(null);
  const pinsLayerRef = useRef<Map<string, HtmlPinHandle>>(new Map());
  const polygonsRef = useRef<Map<string, google.maps.Polygon>>(new Map());
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const fittedKeyRef = useRef<string>('');
  const pinsRef = useRef(pins);
  const activePinRef = useRef(activePin);
  const onPinClickRef = useRef(onPinClick);
  const onViewDetailsRef = useRef(onViewDetails);
  const mmRef = useRef(mm);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(12);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  /**
   * roadmap = Map; hybrid = Satellite with place labels (Google Hybrid under the hood).
   */
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'hybrid'>('roadmap');

  pinsRef.current = pins;
  activePinRef.current = activePin;
  onPinClickRef.current = onPinClick;
  onViewDetailsRef.current = onViewDetails;
  mmRef.current = mm;

  const clearLayers = () => {
    pinsLayerRef.current.forEach((pin) => pin.setMap(null));
    pinsLayerRef.current.clear();
    polygonsRef.current.forEach((poly) => poly.setMap(null));
    polygonsRef.current.clear();
    infoRef.current?.close();
  };

  const syncPinsAndPolygons = (map: google.maps.Map, currentZoom: number) => {
    const list = pinsRef.current;
    const activeKey = activePinRef.current ? pinKey(activePinRef.current) : null;
    const pinSize = currentZoom >= PIN_ZOOM_THRESHOLD ? 36 : 28;
    const showBoundaries = currentZoom >= PIN_ZOOM_THRESHOLD;
    const nextKeys = new Set<string>();

    list.forEach((pin) => {
      if (pin.latitude == null || pin.longitude == null) return;
      const key = pinKey(pin);
      nextKeys.add(key);
      const isActive = activeKey === key;
      const ringColor = pin.pin_type === 'note' ? NOTE_PIN_COLOR : PROPERTY_PIN_COLOR;
      const position = { lat: Number(pin.latitude), lng: Number(pin.longitude) };
      const existing = pinsLayerRef.current.get(key);

      const openInfo = () => {
        onPinClickRef.current?.(pin);
        const info = infoRef.current;
        if (!info) return;
        info.setContent(buildInfoHtml(pin, mmRef.current));
        info.setPosition(position);
        info.open(map);
        google.maps.event.addListenerOnce(info, 'domready', () => {
          const btn = document.querySelector(
            `[data-pn-info="${CSS.escape(key)}"] [data-pn-details="1"]`
          );
          btn?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onViewDetailsRef.current(pin);
            info.close();
          });
        });
      };

      if (existing) {
        existing.update({
          position,
          imageUrl: resolvePinImage(pin),
          ringColor,
          size: pinSize,
          selected: isActive,
        });
      } else {
        const handle = createHtmlPin(map, position, {
          imageUrl: resolvePinImage(pin),
          ringColor,
          size: pinSize,
          selected: isActive,
          title: String(pin.title ?? ''),
          onClick: openInfo,
        });
        pinsLayerRef.current.set(key, handle);
      }

      if (pin.pin_type === 'note' && pin.boundary && showBoundaries) {
        const path = boundaryToPath(pin.boundary);
        if (path) {
          const color = isActive ? SELECTED_PIN_COLOR : NOTE_PIN_COLOR;
          const poly = polygonsRef.current.get(key);
          if (poly) {
            poly.setOptions({
              paths: path,
              strokeColor: color,
              fillColor: color,
              strokeWeight: isActive ? 3 : 2,
              fillOpacity: isActive ? 0.28 : 0.18,
              map,
            });
          } else {
            const created = new google.maps.Polygon({
              map,
              paths: path,
              strokeColor: color,
              fillColor: color,
              strokeWeight: isActive ? 3 : 2,
              fillOpacity: isActive ? 0.28 : 0.18,
              clickable: true,
              zIndex: 1,
            });
            created.addListener('click', () => openInfo());
            polygonsRef.current.set(key, created);
          }
        }
      } else {
        const poly = polygonsRef.current.get(key);
        if (poly) {
          poly.setMap(null);
          polygonsRef.current.delete(key);
        }
      }
    });

    pinsLayerRef.current.forEach((handle, key) => {
      if (!nextKeys.has(key)) {
        handle.setMap(null);
        pinsLayerRef.current.delete(key);
      }
    });
    polygonsRef.current.forEach((poly, key) => {
      if (!nextKeys.has(key)) {
        poly.setMap(null);
        polygonsRef.current.delete(key);
      }
    });
  };

  const fitToPins = (map: google.maps.Map, list: PropertyNoteMapPin[]) => {
    const bounds = new google.maps.LatLngBounds();
    let count = 0;
    list.forEach((pin) => {
      if (pin.latitude == null || pin.longitude == null) return;
      bounds.extend({ lat: Number(pin.latitude), lng: Number(pin.longitude) });
      count += 1;
    });
    if (count === 0) return;
    if (count === 1) {
      const only = list.find((p) => p.latitude != null && p.longitude != null);
      if (!only) return;
      map.setCenter({ lat: Number(only.latitude), lng: Number(only.longitude) });
      map.setZoom(15);
      return;
    }
    map.fitBounds(bounds, 48);
  };

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      setLoadError(null);
      setReady(false);
      try {
        await loadGoogleMaps();
        if (cancelled || !mapElRef.current) return;

        const map = new google.maps.Map(mapElRef.current, {
          center: DEFAULT_CENTER,
          zoom: 12,
          mapTypeId: 'roadmap',
          streetViewControl: false,
          fullscreenControl: false,
          disableDoubleClickZoom: true,
          mapTypeControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
          },
        });
        mapRef.current = map;
        infoRef.current = new google.maps.InfoWindow({ maxWidth: 300 });

        if (searchHostRef.current) {
          try {
            placeSearchRef.current?.destroy();
            placeSearchRef.current = await mountPlaceAutocompleteNew(searchHostRef.current, {
              placeholder: mmRef.current ? 'နေရာ / ဧရိယာ ရှာရန်…' : 'Search place / area…',
              includedRegionCodes: ['mm'],
              onPlace: ({ lat, lng }) => {
                const current = mapRef.current;
                if (!current) return;
                current.panTo({ lat, lng });
                current.setZoom(Math.max(current.getZoom() ?? 12, 15));
              },
            });
          } catch (searchErr) {
            console.warn('Places autocomplete (New) failed', searchErr);
          }
        }

        const onZoom = () => {
          const z = map.getZoom() ?? 12;
          setZoom(z);
          syncPinsAndPolygons(map, z);
        };
        listenersRef.current.push(map.addListener('zoom_changed', onZoom));
        listenersRef.current.push(
          map.addListener('click', () => {
            infoRef.current?.close();
          })
        );

        const z = map.getZoom() ?? 12;
        setZoom(z);
        syncPinsAndPolygons(map, z);
        fitToPins(map, pinsRef.current);
        fittedKeyRef.current = pinsRef.current.map(pinKey).sort().join('|');
        setReady(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Google Maps failed to load';
        setLoadError(message);
      }
    };

    void boot();

    return () => {
      cancelled = true;
      listenersRef.current.forEach((l) => {
        try {
          l.remove();
        } catch {
          // ignore
        }
      });
      listenersRef.current = [];
      placeSearchRef.current?.destroy();
      placeSearchRef.current = null;
      clearLayers();
      infoRef.current?.close();
      infoRef.current = null;
      mapRef.current = null;
    };
    // Mount once per canvas instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    syncPinsAndPolygons(map, zoom);

    const key = pins.map(pinKey).sort().join('|');
    if (key && key !== fittedKeyRef.current) {
      fittedKeyRef.current = key;
      fitToPins(map, pins);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins, activePin, ready, zoom]);

  useEffect(() => {
    const onFsChange = () => {
      const chrome = mapChromeRef.current;
      const active = Boolean(chrome && document.fullscreenElement === chrome);
      setIsMapFullscreen(active);
      window.setTimeout(() => {
        try {
          const map = mapRef.current;
          if (!map) return;
          google.maps.event.trigger(map as unknown as object, 'resize');
        } catch {
          // ignore
        }
      }, 80);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleMapFullscreen = async () => {
    const chrome = mapChromeRef.current;
    if (!chrome) return;
    try {
      if (document.fullscreenElement === chrome) {
        await document.exitFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
        await chrome.requestFullscreen();
      } else {
        await chrome.requestFullscreen();
      }
    } catch {
      setLoadError(mm ? 'Fullscreen မရပါ' : 'Fullscreen blocked');
    }
  };

  return (
    <div
      ref={mapChromeRef}
      className={`relative w-full overflow-hidden rounded-lg border bg-background ${
        isMapFullscreen ? 'h-screen min-h-screen rounded-none border-0' : 'h-full min-h-[360px]'
      }`}
    >
      {loadError ? (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-red-50 p-4 text-sm text-red-700">
          {loadError}
                    </div>
      ) : null}
      {!ready && !loadError ? (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-muted/40 text-sm text-muted-foreground">
          {mm ? 'မြေပုံ တင်နေသည်…' : 'Loading map…'}
                    </div>
      ) : null}

      {/* Same chrome as create/edit maximize — search + maximize, no Draw */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] p-3">
        <div className="pointer-events-auto flex w-full items-center justify-between gap-3">
          <div
            ref={searchHostRef}
            className="msy-place-search-host w-[min(100%,18rem)] shrink"
            aria-label={mm ? 'နေရာ ရှာရန်' : 'Search place'}
          />
          {/* No Draw on list — order: Maximize · Map/Satellite */}
          <div className="flex h-10 shrink-0 items-center gap-2">
                    <Button
              type="button"
              variant="outline"
                      size="sm"
              onClick={() => void toggleMapFullscreen()}
              className={MAP_TOOL_ICON_BTN}
              title={isMapFullscreen ? (mm ? 'ပိတ်ရန်' : 'Exit') : mm ? 'ချဲ့ရန်' : 'Maximize'}
            >
              {isMapFullscreen ? (
                <Minimize2 className="h-5 w-5" strokeWidth={2.5} />
              ) : (
                <Maximize2 className="h-5 w-5" strokeWidth={2.5} />
              )}
                    </Button>
            <select
              aria-label={mm ? 'မြေပုံ အမျိုးအစား' : 'Map type'}
              value={mapTypeId}
              onChange={(e) => {
                const next = e.target.value as 'roadmap' | 'hybrid';
                setMapTypeId(next);
                mapRef.current?.setMapTypeId(next);
              }}
              className={MAP_TOOL_SELECT}
            >
              <option value="roadmap">Map</option>
              <option value="hybrid">Satellite</option>
            </select>
          </div>
        </div>
              </div>

      <div ref={mapElRef} className="h-full w-full min-h-[360px]" />
    </div>
  );
}
