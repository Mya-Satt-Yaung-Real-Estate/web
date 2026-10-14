import { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '@/lib/googleMapsLoader';
import type { PropertyNoteBoundaryGeoJson } from '@/types/propertyNote';

interface PropertyNoteDetailMiniMapProps {
  latitude: number;
  longitude: number;
  boundary?: PropertyNoteBoundaryGeoJson | null;
  language: string;
  className?: string;
}

/** Match create/edit draw style — red edge, soft fill. */
const POLY_STYLE = {
  fillColor: '#EF4444',
  fillOpacity: 0.18,
  strokeColor: '#DC2626',
  strokeOpacity: 1,
  strokeWeight: 2.5,
};

function boundaryToPath(
  boundary: PropertyNoteBoundaryGeoJson
): google.maps.LatLngLiteral[] | null {
  const ring = boundary.coordinates?.[0];
  if (!Array.isArray(ring) || ring.length < 4) return null;
  return ring.map(([lng, lat]) => ({ lat, lng }));
}

/**
 * Read-only mini map for Property Note detail — pin + optional boundary.
 */
export function PropertyNoteDetailMiniMap({
  latitude,
  longitude,
  boundary,
  language,
  className = '',
}: PropertyNoteDetailMiniMapProps) {
  const mm = language === 'mm';
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      if (!mapElRef.current) return;
      try {
        await loadGoogleMaps();
        if (cancelled || !mapElRef.current) return;

        const center = { lat: Number(latitude), lng: Number(longitude) };
        const map = new google.maps.Map(mapElRef.current, {
          center,
          zoom: 16,
          mapTypeId: 'hybrid',
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'cooperative',
          clickableIcons: false,
        });
        mapRef.current = map;

        markerRef.current = new google.maps.Marker({
          map,
          position: center,
        });

        const path = boundary ? boundaryToPath(boundary) : null;
        if (path && path.length >= 3) {
          polygonRef.current = new google.maps.Polygon({
            map,
            paths: path,
            ...POLY_STYLE,
            clickable: false,
          });
          const bounds = new google.maps.LatLngBounds();
          path.forEach((p) => bounds.extend(p));
          map.fitBounds(bounds, 28);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Map failed to load');
        }
      }
    };

    void boot();

    return () => {
      cancelled = true;
      polygonRef.current?.setMap(null);
      polygonRef.current = null;
      markerRef.current?.setMap(null);
      markerRef.current = null;
      mapRef.current = null;
    };
  }, [latitude, longitude, boundary]);

  if (loadError) {
    return (
      <div
        className={`flex h-full min-h-[180px] items-center justify-center rounded-lg border border-border/60 bg-muted/40 px-3 text-center text-xs text-muted-foreground ${className}`}
      >
        {mm ? 'မြေပုံ မရရှိပါ' : 'Map unavailable'}
      </div>
    );
  }

  return (
    <div
      ref={mapElRef}
      className={`h-full min-h-[180px] w-full overflow-hidden rounded-lg border border-border/60 ${className}`}
      aria-label={mm ? 'တည်နေရာ မြေပုံ' : 'Location map'}
    />
  );
}
