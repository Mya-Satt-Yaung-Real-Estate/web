import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, Phone, MapPin, ExternalLink } from 'lucide-react';
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

const NOTE_ICON = L.divIcon({
  className: '',
  html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#d97706;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const PROPERTY_ICON = L.divIcon({
  className: '',
  html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#2563eb;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

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

interface PropertyNoteMapCanvasProps {
  pins: PropertyNoteMapPin[];
  language: string;
  onViewDetails: (pin: PropertyNoteMapPin) => void;
}

export function PropertyNoteMapCanvas({
  pins,
  language,
  onViewDetails,
}: PropertyNoteMapCanvasProps) {
  const defaultCenter: [number, number] = useMemo(() => [16.8661, 96.1951], []);
  const mm = language === 'mm';

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

      {pins.map((pin) => {
        if (pin.latitude == null || pin.longitude == null) return null;

        const listingName = pin.listing_type
          ? mm
            ? pin.listing_type.name_mm
            : pin.listing_type.name_en
          : null;
        const placeName = pin.township
          ? mm
            ? pin.township.name_mm
            : pin.township.name_en
          : null;

        return (
          <Marker
            key={`${pin.pin_type}-${pin.id}`}
            position={[pin.latitude, pin.longitude]}
            icon={pin.pin_type === 'note' ? NOTE_ICON : PROPERTY_ICON}
          >
            <Popup>
              <div className="min-w-[220px] max-w-[280px] p-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2">{pin.title}</h3>
                  <Badge
                    className={`shrink-0 text-[10px] text-white ${
                      pin.pin_type === 'note'
                        ? 'bg-amber-600 hover:bg-amber-600'
                        : 'bg-blue-600 hover:bg-blue-600'
                    }`}
                  >
                    {pin.pin_type === 'note' ? (mm ? 'မှတ်စု' : 'Note') : mm ? 'အိမ်' : 'Property'}
                  </Badge>
                </div>

                {pin.code && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Tag className="h-3 w-3" />
                    <span>{pin.code}</span>
                  </div>
                )}

                {(listingName || placeName) && (
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {listingName && <span>{listingName}</span>}
                    {placeName && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {placeName}
                      </span>
                    )}
                  </div>
                )}

                {pin.price_display && (
                  <p className="text-xs font-medium text-gray-900">{pin.price_display}</p>
                )}

                {pin.phone_numbers?.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{pin.phone_numbers[0]}</span>
                  </div>
                )}

                {pin.pin_type === 'property' && pin.slug ? (
                  <>
                    <Button size="sm" className="w-full" asChild>
                      <Link to={`/properties/${pin.slug}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        {mm ? 'Property အသေးစိတ်' : 'View property details'}
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
