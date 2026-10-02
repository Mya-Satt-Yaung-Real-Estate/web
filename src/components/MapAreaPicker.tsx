import { useEffect, useRef, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PropertyNoteBoundaryGeoJson } from '@/types/propertyNote';

/**
 * Re-export for form callers.
 */
export type { PropertyNoteBoundaryGeoJson };

export interface MapAreaChange {
  boundary: PropertyNoteBoundaryGeoJson;
  latitude: number;
  longitude: number;
}

interface MapAreaPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  boundary?: PropertyNoteBoundaryGeoJson | null;
  onAreaChange: (value: MapAreaChange) => void;
  className?: string;
  mapHeightClassName?: string;
  /**
   * Create flow requires a drawn area. Edit may start with pin-only legacy notes.
   */
  requireBoundary?: boolean;
}

if (typeof window !== 'undefined') {
  const defaultProto = L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown };
  delete defaultProto._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

/**
 * Convert Leaflet latLngs ring → closed GeoJSON [lng, lat] ring.
 */
function ringToGeoJson(latLngs: L.LatLng[]): [number, number][] {
  const ring: [number, number][] = latLngs.map((p) => [p.lng, p.lat]);
  if (ring.length === 0) return ring;
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([first[0], first[1]]);
  }
  return ring;
}

/**
 * Simple average centroid (skip closing duplicate).
 */
function centroidFromRing(ring: [number, number][]): { lat: number; lng: number } | null {
  if (ring.length < 4) return null;
  const count = ring.length - 1;
  let sumLat = 0;
  let sumLng = 0;
  for (let i = 0; i < count; i++) {
    sumLng += ring[i][0];
    sumLat += ring[i][1];
  }
  return {
    lat: Number((sumLat / count).toFixed(8)),
    lng: Number((sumLng / count).toFixed(8)),
  };
}

function geoJsonToLeafletPositions(boundary: PropertyNoteBoundaryGeoJson): [number, number][] {
  const ring = boundary.coordinates[0] || [];
  return ring.map(([lng, lat]) => [lat, lng]);
}

/**
 * Property Note create/edit — draw one polygon area on Leaflet.
 * leaflet-draw is used because custom polygon UX is hard to build safely by hand.
 */
export function MapAreaPicker({
  latitude,
  longitude,
  boundary,
  onAreaChange,
  className = '',
  mapHeightClassName = 'h-[55vh] min-h-[400px]',
  requireBoundary = true,
}: MapAreaPickerProps) {
  const { language } = useLanguage();
  const mm = language === 'mm';
  const [isExpanded, setIsExpanded] = useState(false);
  const [draftBoundary, setDraftBoundary] = useState<PropertyNoteBoundaryGeoJson | null>(
    boundary ?? null
  );
  const [draftLat, setDraftLat] = useState<number | null>(latitude ?? null);
  const [draftLng, setDraftLng] = useState<number | null>(longitude ?? null);

  useEffect(() => {
    setDraftBoundary(boundary ?? null);
  }, [boundary]);

  useEffect(() => {
    setDraftLat(latitude ?? null);
    setDraftLng(longitude ?? null);
  }, [latitude, longitude]);

  const emitArea = (next: PropertyNoteBoundaryGeoJson) => {
    const ring = next.coordinates[0];
    const center = centroidFromRing(ring);
    if (!center) return;
    setDraftBoundary(next);
    setDraftLat(center.lat);
    setDraftLng(center.lng);
    onAreaChange({
      boundary: next,
      latitude: center.lat,
      longitude: center.lng,
    });
  };

  const defaultCenter: [number, number] = [16.8661, 96.1951];
  const mapCenter: [number, number] =
    draftLat != null && draftLng != null ? [draftLat, draftLng] : defaultCenter;

  const hint = requireBoundary
    ? mm
      ? 'Polygon tool နှိပ်ပြီး area ဆွဲပါ (အနည်းဆုံး ၃ ချက်)'
      : 'Use the polygon tool to draw the desired area (min 3 points)'
    : mm
      ? 'Area ဆွဲနိုင်သည် (မဆွဲရင် pin တည်နေရာသာ သိမ်းမည်)'
      : 'Optional: draw an area, or keep the pin only';

  const mapBody = (mapKey: string) => (
    <MapContainer
      key={mapKey}
      center={mapCenter}
      zoom={draftLat != null ? 15 : 12}
      style={{ height: '100%', width: '100%', zIndex: 0, touchAction: 'pan-x pan-y' }}
      scrollWheelZoom
      zoomControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapInvalidateSize />
      <DrawAreaControl
        existingBoundary={draftBoundary}
        onDrawn={emitArea}
        onCleared={() => {
          setDraftBoundary(null);
        }}
      />
      {draftLat != null && draftLng != null ? <Marker position={[draftLat, draftLng]} /> : null}
      <div className="leaflet-bottom leaflet-left" style={{ zIndex: 1000 }}>
        <div className="leaflet-control leaflet-bar bg-background/95 backdrop-blur-sm p-3 rounded-md shadow-lg border max-w-[220px]">
          <p className="text-sm font-semibold mb-1">{mm ? 'Area' : 'Area'}</p>
          <p className="text-xs text-muted-foreground">
            {draftBoundary
              ? mm
                ? 'Area သတ်မှတ်ပြီး'
                : 'Area set'
              : mm
                ? 'Area မရှိသေး'
                : 'No area yet'}
          </p>
          {draftLat != null && draftLng != null ? (
            <p className="text-xs text-muted-foreground mt-1">
              Pin: {draftLat.toFixed(5)}, {draftLng.toFixed(5)}
            </p>
          ) : null}
        </div>
      </div>
    </MapContainer>
  );

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{hint}</p>
        <Button type="button" variant="outline" size="sm" onClick={() => setIsExpanded(true)} className="shrink-0">
          <Maximize2 className="h-4 w-4 mr-1.5" />
          {mm ? 'ချဲ့ရန်' : 'Expand'}
        </Button>
      </div>

      {!isExpanded ? (
        <div className={`relative w-full overflow-hidden rounded-lg border ${mapHeightClassName}`}>
          {typeof window !== 'undefined' ? mapBody('inline-area-map') : null}
        </div>
      ) : (
        <div
          className={`w-full rounded-lg border bg-muted/40 flex items-center justify-center text-sm text-muted-foreground ${mapHeightClassName}`}
        >
          {mm ? 'ချဲ့ထားသော မြေပုံ ဖွင့်ထားသည်…' : 'Expanded map is open…'}
        </div>
      )}

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent size="2xl" className="max-w-[98vw] w-[98vw] h-[96vh] !flex !flex-col !gap-0 !p-0">
          <div className="px-3 py-2 pr-12 border-b flex-shrink-0">
            <DialogHeader className="space-y-0 text-left">
              <DialogTitle className="text-sm font-medium">
                {mm ? 'Desired area ဆွဲရန်' : 'Draw desired area'}
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="relative min-h-0 flex-1 overflow-hidden">
            {isExpanded ? mapBody('expanded-area-map') : null}
          </div>
          <div className="px-3 py-2 border-t flex-shrink-0">
            <DialogFooter>
              <Button type="button" size="sm" onClick={() => setIsExpanded(false)}>
                {mm ? 'ပြီးပါပြီ' : 'Done'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MapInvalidateSize() {
  const map = useMap();
  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(timer);
  }, [map]);
  return null;
}

/**
 * Imperative leaflet-draw control (avoids react-leaflet-draw peer friction).
 */
function DrawAreaControl({
  existingBoundary,
  onDrawn,
  onCleared,
}: {
  existingBoundary: PropertyNoteBoundaryGeoJson | null;
  onDrawn: (boundary: PropertyNoteBoundaryGeoJson) => void;
  onCleared: () => void;
}) {
  const map = useMap();
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);
  const onDrawnRef = useRef(onDrawn);
  const onClearedRef = useRef(onCleared);

  useEffect(() => {
    onDrawnRef.current = onDrawn;
    onClearedRef.current = onCleared;
  }, [onDrawn, onCleared]);

  useEffect(() => {
    const featureGroup = new L.FeatureGroup();
    featureGroupRef.current = featureGroup;
    map.addLayer(featureGroup);

    if (existingBoundary) {
      const positions = geoJsonToLeafletPositions(existingBoundary);
      const polygon = L.polygon(positions, {
        color: '#3B8880',
        fillColor: '#3B8880',
        fillOpacity: 0.25,
      });
      featureGroup.addLayer(polygon);
      map.fitBounds(polygon.getBounds(), { padding: [24, 24] });
    }

    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            color: '#3B8880',
            fillColor: '#3B8880',
            fillOpacity: 0.25,
          },
        },
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
      },
      edit: {
        featureGroup,
        remove: true,
      },
    });
    map.addControl(drawControl);

    const onCreated = (event: L.LeafletEvent) => {
      const created = event as L.DrawEvents.Created;
      featureGroup.clearLayers();
      featureGroup.addLayer(created.layer);

      if (created.layerType !== 'polygon') return;
      const polygon = created.layer as L.Polygon;
      const latLngs = polygon.getLatLngs()[0] as L.LatLng[];
      const ring = ringToGeoJson(latLngs);
      if (ring.length < 4) return;
      onDrawnRef.current({
        type: 'Polygon',
        coordinates: [ring],
      });
    };

    const onEdited = (event: L.LeafletEvent) => {
      const edited = event as L.DrawEvents.Edited;
      edited.layers.eachLayer((layer) => {
        if (!(layer instanceof L.Polygon)) return;
        const latLngs = layer.getLatLngs()[0] as L.LatLng[];
        const ring = ringToGeoJson(latLngs);
        if (ring.length < 4) return;
        onDrawnRef.current({
          type: 'Polygon',
          coordinates: [ring],
        });
      });
    };

    const onDeleted = () => {
      featureGroup.clearLayers();
      onClearedRef.current();
    };

    map.on(L.Draw.Event.CREATED, onCreated);
    map.on(L.Draw.Event.EDITED, onEdited);
    map.on(L.Draw.Event.DELETED, onDeleted);

    return () => {
      map.off(L.Draw.Event.CREATED, onCreated);
      map.off(L.Draw.Event.EDITED, onEdited);
      map.off(L.Draw.Event.DELETED, onDeleted);
      map.removeControl(drawControl);
      map.removeLayer(featureGroup);
      featureGroupRef.current = null;
    };
    // Mount once per map instance; existingBoundary is seeded on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
}
