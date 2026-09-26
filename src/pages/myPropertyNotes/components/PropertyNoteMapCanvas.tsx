import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, Phone, MapPin, ExternalLink, Hash, Banknote } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
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
}

/** Below this zoom: dense dots. At/above: location pins. */
const PIN_ZOOM_THRESHOLD = 14;

function makeDotIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

/**
 * Teardrop map pin (SVG) — tip sits on the lat/lng.
 */
function makePinIcon(color: string): L.DivIcon {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40" aria-hidden="true">
      <path fill="${color}" stroke="#fff" stroke-width="2"
        d="M14 1.5C7.1 1.5 1.5 7.1 1.5 14c0 9.4 10.4 22.2 11.8 23.8a1 1 0 0 0 1.4 0C15.1 36.2 26.5 23.4 26.5 14 26.5 7.1 20.9 1.5 14 1.5z"/>
      <circle cx="14" cy="14" r="5" fill="#fff"/>
    </svg>
  `.trim();

  return L.divIcon({
    className: '',
    html: svg,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -36],
  });
}

const NOTE_DOT = makeDotIcon('#dc2626');
const PROPERTY_DOT = makeDotIcon('#2563eb');
const SELECTED_DOT = makeDotIcon('#16a34a');
const NOTE_PIN = makePinIcon('#dc2626');
const PROPERTY_PIN = makePinIcon('#2563eb');
const SELECTED_PIN = makePinIcon('#16a34a');

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
 * Push current zoom to parent so markers can switch icon style.
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
   * Last clicked pin — shown green (Selected).
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
  const usePins = zoom >= PIN_ZOOM_THRESHOLD;
  const activeKey = activePin ? pinKey(activePin) : null;

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
        const icon = isActive
          ? usePins
            ? SELECTED_PIN
            : SELECTED_DOT
          : pin.pin_type === 'note'
            ? usePins
              ? NOTE_PIN
              : NOTE_DOT
            : usePins
              ? PROPERTY_PIN
              : PROPERTY_DOT;

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
                        ? '!bg-red-600 hover:!bg-red-600'
                        : '!bg-blue-600 hover:!bg-blue-600'
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
