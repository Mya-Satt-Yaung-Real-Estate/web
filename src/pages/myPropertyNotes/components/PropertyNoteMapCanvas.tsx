import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, Phone, MapPin, ExternalLink, Hash, Banknote } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import jadeLogo from '@/assets/jade.png';
import type { PropertyNoteMapPin } from '@/types/propertyNote';

/**
 * Leaflet default icon paths break under Vite bundling — restore CDN icons.
 */
if (typeof window !== 'undefined') {
  const defaultProto = L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown };
  delete defaultProto._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });

  /*
  Default .leaflet-div-icon gray border clips our colored ring — clear it once.
   */
  if (!document.getElementById('msy-pn-map-pin-css')) {
    const style = document.createElement('style');
    style.id = 'msy-pn-map-pin-css';
    style.textContent =
      '.msy-pn-map-pin.leaflet-div-icon{background:transparent!important;border:none!important;}';
    document.head.appendChild(style);
  }
}

/** Below this zoom: smaller circles. At/above: larger circles. */
const PIN_ZOOM_THRESHOLD = 14;

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

/** Legend colors: Notes=blue, Property=red, Selected=green (ring). */
const NOTE_PIN_COLOR = '#2563eb';
const PROPERTY_PIN_COLOR = '#dc2626';
const SELECTED_PIN_COLOR = '#16a34a';

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Circular logo/avatar pin (no teardrop).
 * Property = red ring, Note = blue ring, Selected = green ring.
 * Broken remote URLs fall back to DEFAULT_AVATAR via onerror.
 */
function makeCircleLogoIcon(
  imageUrl: string,
  ringColor: string,
  size: number,
  selected: boolean
): L.DivIcon {
  const borderColor = selected ? SELECTED_PIN_COLOR : ringColor;
  const borderWidth = selected ? 4 : 3;
  const shadow = selected
    ? '0 0 0 2px rgba(22,163,74,.35), 0 2px 6px rgba(0,0,0,.35)'
    : '0 1px 4px rgba(0,0,0,.35)';
  const safeUrl = escapeAttr(imageUrl);
  const safeFallback = escapeAttr(DEFAULT_AVATAR);

  return L.divIcon({
    className: 'msy-pn-map-pin',
    html: `<span style="display:block;box-sizing:border-box;width:${size}px;height:${size}px;border-radius:9999px;overflow:hidden;border:${borderWidth}px solid ${borderColor};box-shadow:${shadow};background:#fff"><img src="${safeUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block" onerror="this.onerror=null;this.src='${safeFallback}'" /></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function FitBounds({ pins }: { pins: PropertyNoteMapPin[] }) {
  const map = useMap();

  useEffect(() => {
    const points = pins
      .filter((p) => p.latitude != null && p.longitude != null)
      .map((p) => [p.latitude as number, p.longitude as number] as [number, number]);

    if (points.length === 0) return;

    const bounds = L.latLngBounds(points);
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
    }
  }, [map, pins]);

  return null;
}

/**
 * Push current zoom to parent so markers can switch icon size.
 */
function ZoomWatcher({ onZoom }: { onZoom: (zoom: number) => void }) {
  const map = useMapEvents({
    zoomend: () => onZoom(map.getZoom()),
  });

  useEffect(() => {
    onZoom(map.getZoom());
  }, [map, onZoom]);

  return null;
}

interface PropertyNoteMapCanvasProps {
  pins: PropertyNoteMapPin[];
  language: string;
  onViewDetails: (pin: PropertyNoteMapPin) => void;
  /**
   * Last clicked pin — green ring.
   */
  activePin?: PropertyNoteMapPin | null;
  /**
   * Marker click only (popup). Does not open the sidebar.
   */
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

export function PropertyNoteMapCanvas({
  pins,
  language,
  onViewDetails,
  activePin = null,
  onPinClick,
}: PropertyNoteMapCanvasProps) {
  const defaultCenter: [number, number] = useMemo(() => [16.8661, 96.1951], []);
  const mm = language === 'mm';
  const [zoom, setZoom] = useState(12);
  const pinSize = zoom >= PIN_ZOOM_THRESHOLD ? 36 : 28;
  const activeKey = activePin ? pinKey(activePin) : null;

  /**
   * Cache DivIcons by image+color+size+selected so Leaflet does not thrash.
   */
  const iconCache = useMemo(() => new Map<string, L.DivIcon>(), [pinSize]);

  const getIcon = (imageUrl: string, color: string, selected: boolean): L.DivIcon => {
    const key = `${imageUrl}|${color}|${pinSize}|${selected ? 1 : 0}`;
    const cached = iconCache.get(key);
    if (cached) return cached;
    const icon = makeCircleLogoIcon(imageUrl, color, pinSize, selected);
    iconCache.set(key, icon);
    return icon;
  };

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom
      className="rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ZoomWatcher onZoom={setZoom} />

      {pins.map((pin) => {
        if (pin.latitude == null || pin.longitude == null) return null;

        const listingName = pin.listing_type
          ? String(mm ? pin.listing_type.name_mm : pin.listing_type.name_en)
          : null;
        const placeName = pin.township
          ? String(mm ? pin.township.name_mm : pin.township.name_en)
          : pin.region
            ? String(mm ? pin.region.name_mm : pin.region.name_en)
            : null;
        const priceRaw = pin.price_display;
        const priceLabel =
          typeof priceRaw === 'string' && priceRaw.trim() && priceRaw.trim() !== '.'
            ? priceRaw.trim()
            : null;

        const isActive = activeKey === pinKey(pin);
        const pinColor =
          pin.pin_type === 'note' ? NOTE_PIN_COLOR : PROPERTY_PIN_COLOR;
        const icon = getIcon(resolvePinImage(pin), pinColor, isActive);

        return (
          <Marker
            key={pinKey(pin)}
            position={[Number(pin.latitude), Number(pin.longitude)]}
            icon={icon}
            eventHandlers={{
              click: () => onPinClick?.(pin),
            }}
          >
            <Popup>
              <div className="min-w-[220px] max-w-[280px] p-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                    {pin.title != null ? String(pin.title) : ''}
                  </h3>
                  <Badge
                    className={`shrink-0 text-[10px] !text-white ${
                      pin.pin_type === 'note'
                        ? '!bg-blue-600 hover:!bg-blue-600'
                        : '!bg-red-600 hover:!bg-red-600'
                    }`}
                  >
                    {pin.pin_type === 'note'
                      ? mm
                        ? 'မှတ်စု'
                        : 'Note'
                      : mm
                        ? 'အိမ်'
                        : 'Property'}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {pin.code && (
                    <div className="flex items-start gap-1.5">
                      <Hash className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gray-600" />
                      <span>{pin.code}</span>
                    </div>
                  )}

                  {listingName && (
                    <div className="flex items-start gap-1.5">
                      <Tag className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-700" />
                      <span>{listingName}</span>
                    </div>
                  )}

                  {placeName && (
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-blue-700" />
                      <span>{placeName}</span>
                    </div>
                  )}

                  {priceLabel && (
                    <div className="flex items-start gap-1.5">
                      <Banknote className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-700" />
                      <span className="font-medium text-gray-900">{priceLabel}</span>
                    </div>
                  )}

                  {pin.phone_numbers?.length > 0 && (
                    <div className="flex items-start gap-1.5">
                      <Phone className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-700" />
                      <span>{String(pin.phone_numbers[0])}</span>
                    </div>
                  )}
                </div>

                {pin.pin_type === 'property' && pin.slug ? (
                  <>
                    {/**
                     * Leaflet sets `.leaflet-container a { color }` — force primary-foreground so this matches the sheet CTA.
                     */}
                    <Button
                      size="sm"
                      className="w-full !text-primary-foreground hover:!text-primary-foreground"
                      asChild
                    >
                      <Link
                        to={`/properties/${pin.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="!text-primary-foreground hover:!text-primary-foreground"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {mm ? 'Property အသေးစိတ် ကြည့်ရန်' : 'View property details'}
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => onViewDetails(pin)}
                    >
                      {mm ? 'အကျဉ်းချုပ်' : 'Quick info'}
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => onViewDetails(pin)}
                  >
                    {mm ? 'အသေးစိတ် ကြည့်ရန်' : 'View details'}
                  </Button>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}

      <FitBounds pins={pins} />
    </MapContainer>
  );
}
