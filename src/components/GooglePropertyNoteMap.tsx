import { useEffect, useRef, useState } from 'react';
import { Check, Maximize2, Minimize2, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { loadGoogleMaps } from '@/lib/googleMapsLoader';
import {
  mountPlaceAutocompleteNew,
  type PlaceAutocompleteHandle,
} from '@/lib/placeAutocompleteNew';
import type { PropertyNoteBoundaryGeoJson } from '@/types/propertyNote';

export type { PropertyNoteBoundaryGeoJson };

export interface MapAreaChange {
  boundary: PropertyNoteBoundaryGeoJson;
  latitude: number;
  longitude: number;
}

interface GooglePropertyNoteMapProps {
  latitude?: number | null;
  longitude?: number | null;
  boundary?: PropertyNoteBoundaryGeoJson | null;
  onAreaChange: (value: MapAreaChange) => void;
  className?: string;
  mapHeightClassName?: string;
  /**
   * Create flow needs an area. If user has not drawn yet, pin still gets a
   * small default square so validation passes.
   */
  requireBoundary?: boolean;
}

const DEFAULT_CENTER = { lat: 16.8661, lng: 96.1951 };

/** High-contrast on satellite; soft fill, sharp edge. */
const POLY_STYLE = {
  fillColor: '#06B6D4',
  fillOpacity: 0.22,
  strokeColor: '#FACC15',
  strokeOpacity: 1,
  strokeWeight: 3.5,
};

/** Shared map toolbar — fixed height so Draw / Finish / Cancel / Maximize / Map type match. */
const MAP_TOOL_BTN =
  '!h-10 min-h-10 max-h-10 box-border shrink-0 rounded-md border border-input bg-white py-0 ' +
  'text-sm font-medium leading-none text-foreground shadow-md transition-colors ' +
  'hover:bg-primary/10 hover:text-primary ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
  'disabled:pointer-events-none disabled:opacity-50 dark:bg-background';
const MAP_TOOL_ICON_BTN = `${MAP_TOOL_BTN} !w-10 p-0`;
const MAP_TOOL_SELECT = `${MAP_TOOL_BTN} cursor-pointer px-2.5 outline-none`;

/**
 * Close-on-first-point only within this many meters.
 * Old ~28m threshold auto-finished small lots at 3 corners.
 */
const CLOSE_THRESHOLD_METERS = 4;

/**
 * ~90m-ish square fallback until user draws a real polygon.
 */
function buildDefaultBoundary(lat: number, lng: number): PropertyNoteBoundaryGeoJson {
  const d = 0.0008;
  const ring: [number, number][] = [
    [lng - d, lat - d],
    [lng + d, lat - d],
    [lng + d, lat + d],
    [lng - d, lat + d],
    [lng - d, lat - d],
  ];
  return { type: 'Polygon', coordinates: [ring] };
}

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

function pathToGeoJsonRing(path: google.maps.MVCArray<google.maps.LatLng>): [number, number][] {
  const ring: [number, number][] = path.getArray().map((ll) => [ll.lng(), ll.lat()]);
  if (ring.length === 0) return ring;
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([first[0], first[1]]);
  }
  return ring;
}

function geoJsonToLatLngPath(boundary: PropertyNoteBoundaryGeoJson): google.maps.LatLngLiteral[] {
  const ring = boundary.coordinates[0] || [];
  const open =
    ring.length > 1 &&
    ring[0][0] === ring[ring.length - 1][0] &&
    ring[0][1] === ring[ring.length - 1][1]
      ? ring.slice(0, -1)
      : ring;
  return open.map(([lng, lat]) => ({ lat, lng }));
}

function distanceMeters(a: google.maps.LatLngLiteral, b: google.maps.LatLngLiteral): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const r = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** True only when click is almost exactly on the first corner (not the whole lot). */
function isCloseToFirstVertex(
  click: google.maps.LatLngLiteral,
  first: google.maps.LatLngLiteral
): boolean {
  return distanceMeters(click, first) <= CLOSE_THRESHOLD_METERS;
}

/**
 * Property Note create/edit — Google Map:
 * Phase A: Satellite / search / pin
 * Phase B: custom click-to-draw polygon (DrawingManager removed in Maps 3.55+)
 */
export function GooglePropertyNoteMap({
  latitude,
  longitude,
  boundary,
  onAreaChange,
  className = '',
  mapHeightClassName = 'h-[55vh] min-h-[400px]',
  requireBoundary = true,
}: GooglePropertyNoteMapProps) {
  const { language } = useLanguage();
  const mm = language === 'mm';
  const [loadError, setLoadError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [hasUserPolygon, setHasUserPolygon] = useState(() =>
    Boolean(boundary?.coordinates?.[0]?.length)
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [draftVertexCount, setDraftVertexCount] = useState(0);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  /**
   * roadmap = Map; hybrid = Satellite with place labels (same look as Google Hybrid).
   * Toolbar still shows “Satellite” — users expect labels on aerial view.
   */
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [pinLabel, setPinLabel] = useState<string>(() =>
    latitude != null && longitude != null
      ? `Pin: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
      : ''
  );

  const draftBoundaryRef = useRef<PropertyNoteBoundaryGeoJson | null>(boundary ?? null);
  const draftLatRef = useRef<number | null>(latitude ?? null);
  const draftLngRef = useRef<number | null>(longitude ?? null);
  const userPolygonRef = useRef(Boolean(boundary?.coordinates?.[0]?.length));
  const isDrawingRef = useRef(false);
  const draftVerticesRef = useRef<google.maps.LatLngLiteral[]>([]);

  /** Outer chrome (search + draw + map) — fullscreen this so Draw stays available. */
  const mapChromeRef = useRef<HTMLDivElement | null>(null);
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const searchHostRef = useRef<HTMLDivElement | null>(null);

  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const draftLineRef = useRef<google.maps.Polyline | null>(null);
  const placeSearchRef = useRef<PlaceAutocompleteHandle | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const pathListenersRef = useRef<google.maps.MapsEventListener[]>([]);

  useEffect(() => {
    draftBoundaryRef.current = boundary ?? null;
  }, [boundary]);

  useEffect(() => {
    draftLatRef.current = latitude ?? null;
    draftLngRef.current = longitude ?? null;
    if (latitude != null && longitude != null) {
      setPinLabel(`Pin: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
    }
    if (markerRef.current && latitude != null && longitude != null) {
      markerRef.current.setPosition({ lat: latitude, lng: longitude });
    }
    if (mapInstanceRef.current && latitude != null && longitude != null && !userPolygonRef.current) {
      mapInstanceRef.current.panTo({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  const track = (listener: google.maps.MapsEventListener | undefined | null) => {
    if (listener) listenersRef.current.push(listener);
  };

  const clearPathListeners = () => {
    pathListenersRef.current.forEach((listener) => {
      try {
        listener?.remove?.();
      } catch {
        // ignore
      }
    });
    pathListenersRef.current = [];
  };

  const clearDraftLine = () => {
    draftVerticesRef.current = [];
    setDraftVertexCount(0);
    try {
      draftLineRef.current?.setMap(null);
    } catch {
      // ignore
    }
    draftLineRef.current = null;
  };

  const emitArea = (next: PropertyNoteBoundaryGeoJson, fromUserDraw: boolean) => {
    const ring = next.coordinates[0];
    const center = centroidFromRing(ring);
    if (!center) return;

    draftBoundaryRef.current = next;
    draftLatRef.current = center.lat;
    draftLngRef.current = center.lng;
    if (fromUserDraw) {
      userPolygonRef.current = true;
      setHasUserPolygon(true);
    }
    setPinLabel(`Pin: ${center.lat.toFixed(5)}, ${center.lng.toFixed(5)}`);

    if (markerRef.current) {
      markerRef.current.setMap(mapInstanceRef.current);
      markerRef.current.setPosition(center);
    }

    onAreaChange({
      boundary: next,
      latitude: center.lat,
      longitude: center.lng,
    });
  };

  const emitPin = (lat: number, lng: number) => {
    const roundedLat = Number(lat.toFixed(8));
    const roundedLng = Number(lng.toFixed(8));
    draftLatRef.current = roundedLat;
    draftLngRef.current = roundedLng;
    setPinLabel(`Pin: ${roundedLat.toFixed(5)}, ${roundedLng.toFixed(5)}`);

    let nextBoundary = draftBoundaryRef.current;
    if (!userPolygonRef.current) {
      nextBoundary = buildDefaultBoundary(roundedLat, roundedLng);
      draftBoundaryRef.current = nextBoundary;
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
        polygonRef.current = null;
        clearPathListeners();
      }
    }

    onAreaChange({
      boundary: nextBoundary ?? buildDefaultBoundary(roundedLat, roundedLng),
      latitude: roundedLat,
      longitude: roundedLng,
    });
  };

  const attachPathEditListeners = (polygon: google.maps.Polygon) => {
    clearPathListeners();
    const path = polygon.getPath();
    const onPathChange = () => {
      const ring = pathToGeoJsonRing(path);
      if (ring.length < 4) return;
      emitArea({ type: 'Polygon', coordinates: [ring] }, true);
    };
    pathListenersRef.current.push(
      path.addListener('set_at', onPathChange),
      path.addListener('insert_at', onPathChange),
      path.addListener('remove_at', onPathChange)
    );
  };

  const showPolygon = (
    map: google.maps.Map,
    boundary: PropertyNoteBoundaryGeoJson,
    fit: boolean
  ) => {
    clearPathListeners();
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }

    const paths = geoJsonToLatLngPath(boundary);
    if (paths.length < 3) return;

    const polygon = new google.maps.Polygon({
      map,
      paths,
      editable: true,
      ...POLY_STYLE,
    });
    polygonRef.current = polygon;
    userPolygonRef.current = true;
    setHasUserPolygon(true);
    attachPathEditListeners(polygon);

    if (fit) {
      const bounds = new google.maps.LatLngBounds();
      paths.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds, 48);
    }
  };

  const finishDraftPolygon = () => {
    const map = mapInstanceRef.current;
    const vertices = draftVerticesRef.current;
    if (!map || vertices.length < 3) return;

    const ring: [number, number][] = vertices.map((v) => [v.lng, v.lat]);
    const first = ring[0];
    ring.push([first[0], first[1]]);

    clearDraftLine();
    isDrawingRef.current = false;
    setIsDrawing(false);

    const next: PropertyNoteBoundaryGeoJson = { type: 'Polygon', coordinates: [ring] };
    showPolygon(map, next, false);
    emitArea(next, true);
  };

  const cancelDrawing = () => {
    clearDraftLine();
    isDrawingRef.current = false;
    setIsDrawing(false);
  };

  const startDrawing = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    clearPathListeners();
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
    userPolygonRef.current = false;
    setHasUserPolygon(false);
    draftBoundaryRef.current = null;
    clearDraftLine();

    draftLineRef.current = new google.maps.Polyline({
      map,
      path: [],
      strokeColor: POLY_STYLE.strokeColor,
      strokeOpacity: POLY_STYLE.strokeOpacity,
      strokeWeight: POLY_STYLE.strokeWeight,
      clickable: false,
    });

    isDrawingRef.current = true;
    setIsDrawing(true);
  };

  const clearUserPolygon = () => {
    cancelDrawing();
    clearPathListeners();
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
    userPolygonRef.current = false;
    setHasUserPolygon(false);
    draftBoundaryRef.current = null;

    const lat = draftLatRef.current;
    const lng = draftLngRef.current;
    if (lat != null && lng != null && requireBoundary) {
      const fallback = buildDefaultBoundary(lat, lng);
      draftBoundaryRef.current = fallback;
      onAreaChange({
        boundary: fallback,
        latitude: lat,
        longitude: lng,
      });
    }
  };

  const clearMapListeners = () => {
    listenersRef.current.forEach((listener) => {
      try {
        listener?.remove?.();
      } catch {
        // Ignore cleanup errors (common after Maps auth failure).
      }
    });
    listenersRef.current = [];
    clearPathListeners();
    clearDraftLine();
    isDrawingRef.current = false;

    try {
      placeSearchRef.current?.destroy();
    } catch {
      // ignore
    }
    placeSearchRef.current = null;

    try {
      polygonRef.current?.setMap(null);
    } catch {
      // ignore
    }
    polygonRef.current = null;

    try {
      markerRef.current?.setMap(null);
    } catch {
      // ignore
    }
    markerRef.current = null;
    mapInstanceRef.current = null;
  };

  const mountMap = (mapEl: HTMLDivElement) => {
    clearMapListeners();

    const center =
      draftLatRef.current != null && draftLngRef.current != null
        ? { lat: draftLatRef.current, lng: draftLngRef.current }
        : DEFAULT_CENTER;

    const map = new google.maps.Map(mapEl, {
      center,
      zoom: draftLatRef.current != null ? 16 : 12,
      mapTypeId: 'roadmap',
      streetViewControl: false,
      disableDoubleClickZoom: true,
      /**
       * Google's built-in fullscreen only covers the map div — Draw/search vanish.
       * We fullscreen mapChromeRef instead (see toggleMapFullscreen).
       * Map type switch lives in our top-right toolbar (Draw → Maximize → Map/Satellite).
       */
      fullscreenControl: false,
      mapTypeControl: false,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM,
      },
    });
    mapInstanceRef.current = map;

    const marker = new google.maps.Marker({
      map,
      position: center,
      draggable: true,
      title: mm ? 'တည်နေရာ' : 'Location pin',
    });
    markerRef.current = marker;

    if (draftLatRef.current == null || draftLngRef.current == null) {
      marker.setMap(null);
    }

    if (draftBoundaryRef.current?.coordinates?.[0]?.length) {
      showPolygon(map, draftBoundaryRef.current, true);
    }

    track(
      map.addListener('click', (...args: unknown[]) => {
        const e = args[0] as google.maps.MapMouseEvent;
        if (!e.latLng) return;
        const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };

        if (isDrawingRef.current) {
          const verts = draftVerticesRef.current;
          // Close only when clicking ~on the first corner (4m), never mid-lot.
          if (verts.length >= 3 && isCloseToFirstVertex(point, verts[0])) {
            finishDraftPolygon();
            return;
          }
          verts.push(point);
          setDraftVertexCount(verts.length);
          draftLineRef.current?.setPath(verts);
          return;
        }

        marker.setMap(map);
        marker.setPosition(point);
        emitPin(point.lat, point.lng);
      })
    );

    track(
      map.addListener('dblclick', (...args: unknown[]) => {
        if (!isDrawingRef.current) return;
        const e = args[0] as google.maps.MapMouseEvent & { stop?: () => void };
        e.stop?.();
        if (draftVerticesRef.current.length >= 3) {
          finishDraftPolygon();
        }
      })
    );

    track(
      marker.addListener('dragend', () => {
        if (isDrawingRef.current) return;
        const pos = marker.getPosition();
        if (!pos) return;
        emitPin(pos.lat(), pos.lng());
      })
    );

    setReady(true);
  };

  const mountPlaceSearch = async () => {
    placeSearchRef.current?.destroy();
    placeSearchRef.current = null;
    const host = searchHostRef.current;
    if (!host) return;

    placeSearchRef.current = await mountPlaceAutocompleteNew(host, {
      placeholder: mm ? 'နေရာ / ဧရိယာ ရှာရန်…' : 'Search place / area…',
      includedRegionCodes: ['mm'],
      onPlace: ({ lat, lng }) => {
        if (isDrawingRef.current) return;
        const map = mapInstanceRef.current;
        const marker = markerRef.current;
        if (!map || !marker) return;
        map.panTo({ lat, lng });
        map.setZoom(17);
        marker.setMap(map);
        marker.setPosition({ lat, lng });
        emitPin(lat, lng);
      },
    });
  };

  useEffect(() => {
    let cancelled = false;
    const w = window as Window & { gm_authFailure?: () => void };
    const prevAuthFailure = w.gm_authFailure;

    w.gm_authFailure = () => {
      prevAuthFailure?.();
      if (cancelled) return;
      clearMapListeners();
      setReady(false);
      setLoadError(
        mm
          ? `Google Maps key ကို ဒီ URL အတွက် ခွင့်မပြုပါ (${window.location.origin}). Cloud Console မှာ http://localhost:5173/* ထည့်ပါ။`
          : `Google Maps key blocked for ${window.location.origin}. In Cloud Console → Credentials → your key → Application restrictions, add http://localhost:5173/* (or set None), then Save.`
      );
    };

    const boot = async () => {
      setLoadError(null);
      setReady(false);
      try {
        await loadGoogleMaps();
        if (cancelled) return;
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });
        if (cancelled) return;
        const el = mapElRef.current;
        if (!el) {
          setLoadError(mm ? 'မြေပုံ container မတွေ့ပါ' : 'Map container not ready');
          return;
        }
        mountMap(el);
        try {
          await mountPlaceSearch();
        } catch (searchErr) {
          console.warn('Places autocomplete (New) failed', searchErr);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Google Maps failed to load';
        setLoadError(message);
        setReady(false);
      }
    };

    void boot();

    return () => {
      cancelled = true;
      w.gm_authFailure = prevAuthFailure;
      placeSearchRef.current?.destroy();
      placeSearchRef.current = null;
      clearMapListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      const chrome = mapChromeRef.current;
      const active = Boolean(chrome && document.fullscreenElement === chrome);
      setIsMapFullscreen(active);
      // Let Google Maps reflow after chrome size change.
      window.setTimeout(() => {
        try {
          const map = mapInstanceRef.current;
          if (!map) return;
          google.maps.event.trigger(map as unknown as object, 'resize');
          const lat = draftLatRef.current;
          const lng = draftLngRef.current;
          if (lat != null && lng != null) {
            map.setCenter({ lat, lng });
          }
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
      setLoadError(
        mm
          ? 'Fullscreen မရပါ — browser permission စစ်ပါ။'
          : 'Fullscreen blocked — check browser permission.'
      );
    }
  };

  const hint = requireBoundary
    ? mm
      ? 'Draw → ထောင့်တွေ ဆက်နှိပ် (၃+ အကန့်အသတ်မရှိ) → Finish (သို့ ပထမအမှတ်ကို တိတိကျကျ နှိပ် / double-click)။'
      : 'Draw → click as many corners as you need (3+) → Finish (or click exactly on the first point / double-click).'
    : mm
      ? 'Area ဆွဲနိုင်သည် (မဆွဲရင် pin တည်နေရာသာ)။'
      : 'Optional: draw an area, or keep the pin only.';

  const statusLine = pinLabel || (mm ? 'Pin မရှိသေး' : 'No pin yet');
  const areaLine = isDrawing
    ? mm
      ? `ဆွဲနေသည် · ${draftVertexCount} အမှတ်`
      : `Drawing · ${draftVertexCount} points`
    : hasUserPolygon
      ? mm
        ? 'Area သတ်မှတ်ပြီး'
        : 'Area set'
      : mm
        ? 'Area မရှိသေး'
        : 'No area yet';

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-xs text-muted-foreground">{hint}</p>

      {loadError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {loadError}
        </div>
      ) : null}

      <div
        ref={mapChromeRef}
        className={`relative w-full overflow-hidden rounded-lg border bg-background ${
          isMapFullscreen ? 'h-screen min-h-screen rounded-none border-0' : mapHeightClassName
        }`}
      >
        {!ready && !loadError ? (
          <div className="absolute inset-0 z-[1] flex items-center justify-center bg-muted/40 text-sm text-muted-foreground">
            {mm ? 'မြေပုံ တင်နေသည်…' : 'Loading map…'}
          </div>
        ) : null}

        <div className="relative h-full w-full">
          {/*
            Top chrome above Google controls (z-index).
            Draw and Maximize are separate buttons with explicit gap — never one overlapping pill.
          */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] p-3">
            <div className="pointer-events-auto flex w-full items-center justify-between gap-3">
              <div
                ref={searchHostRef}
                className="msy-place-search-host w-[min(100%,18rem)] shrink"
                aria-label={mm ? 'နေရာ ရှာရန်' : 'Search place'}
              />

              {/* Order: 1 Draw · 2 Maximize · 3 Map/Satellite — same height + hover */}
              <div className="flex h-10 shrink-0 items-center gap-2">
                {isDrawing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={draftVertexCount < 3}
                      onClick={finishDraftPolygon}
                      className={`${MAP_TOOL_BTN} px-3`}
                    >
                      <Check className="mr-1.5 h-4 w-4" />
                      Finish
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={cancelDrawing}
                      className={`${MAP_TOOL_BTN} px-3`}
                    >
                      <X className="mr-1.5 h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={startDrawing}
                    className={`${MAP_TOOL_BTN} px-3`}
                  >
                    <Pencil className="mr-1.5 h-4 w-4" />
                    Draw
                  </Button>
                )}
                {hasUserPolygon && !isDrawing ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearUserPolygon}
                    className={MAP_TOOL_ICON_BTN}
                    title={mm ? 'Area ဖျက်' : 'Clear area'}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                ) : null}
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
                    mapInstanceRef.current?.setMapTypeId(next);
                  }}
                  className={MAP_TOOL_SELECT}
                >
                  <option value="roadmap">Map</option>
                  <option value="hybrid">Satellite</option>
                </select>
              </div>
            </div>

            {isDrawing ? (
              <p className="pointer-events-none mt-2 inline-block rounded-md border border-border/80 bg-white/95 px-2.5 py-1 text-xs text-muted-foreground shadow-sm dark:bg-background/95">
                {mm
                  ? `အမှတ် ${draftVertexCount} · ဆက်နှိပ်နိုင် · Finish / ပထမအမှတ် / double-click`
                  : `${draftVertexCount} points · keep clicking · Finish / first point / double-click`}
              </p>
            ) : null}
          </div>

          <div ref={mapElRef} className="h-full w-full" />

          <div className="absolute bottom-3 left-3 z-10 max-w-[240px] rounded-lg border border-border/80 bg-white/95 px-3 py-2 text-xs shadow-md backdrop-blur-sm dark:bg-background/95">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-foreground">{mm ? 'Area' : 'Area'}</p>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                  hasUserPolygon
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                    : isDrawing
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {hasUserPolygon ? (mm ? 'OK' : 'Set') : isDrawing ? (mm ? 'ဆွဲ' : 'Draw') : (mm ? '—' : '—')}
              </span>
            </div>
            <p className="mt-1 text-muted-foreground">{areaLine}</p>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{statusLine}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
