import { useState, useEffect } from 'react';
import { MapPin, LocateFixed, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

// Import Leaflet and React-Leaflet (will only be used client-side)
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';

// Fix for default marker icon in React-Leaflet
if (typeof window !== 'undefined') {
  const defaultProto = L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown };
  delete defaultProto._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface MapLocationPickerProps {
  latitude?: number | string;
  longitude?: number | string;
  onLocationSelect: (lat: number, lng: number) => void;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  className?: string;
  /**
   * button = open map in dialog (default, existing forms).
   * inline = tall map embedded on the page (Property Notes).
   */
  variant?: 'button' | 'inline';
  /** Inline map height class (default ~55vh). */
  mapHeightClassName?: string;
}

export function MapLocationPicker({
  latitude,
  longitude,
  onLocationSelect,
  buttonText,
  buttonVariant = 'outline',
  className = '',
  variant = 'button',
  mapHeightClassName = 'h-[55vh] min-h-[360px]',
}: MapLocationPickerProps) {
  const { t, language } = useLanguage();
  const mm = language === 'mm';
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLng, setSelectedLng] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      // Cleanup: restore body scroll on unmount
      document.body.style.overflow = '';
    };
  }, []);

  // Cleanup body scroll when dialog closes
  useEffect(() => {
    if (!isOpen && isMobile) {
      document.body.style.overflow = '';
    }
  }, [isOpen, isMobile]);

  // Determine if location is already selected
  const currentLat = selectedLat !== null ? selectedLat : (typeof latitude === 'string' ? parseFloat(latitude) : latitude);
  const currentLng = selectedLng !== null ? selectedLng : (typeof longitude === 'string' ? parseFloat(longitude) : longitude);
  const hasLocation = (currentLat !== null && currentLat !== undefined && !isNaN(currentLat)) &&
                      (currentLng !== null && currentLng !== undefined && !isNaN(currentLng));
// Dynamic button text based on whether location is selected
  const displayText = buttonText || (hasLocation
    ? `${t('createProperty.mapLocationReview')} (${t('createProperty.mapLocationCurrent')}: ${currentLat?.toFixed(6)}, ${currentLng?.toFixed(6)})`
    : t('createProperty.mapLocationChoose'));
// Initialize with existing coordinates if available
  useEffect(() => {
    if (latitude && longitude) {
      const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
      const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
      if (!isNaN(lat) && !isNaN(lng)) {
        setSelectedLat(lat);
        setSelectedLng(lng);
      }
    }
  }, [latitude, longitude]);

  // Default center: Yangon, Myanmar (approximately)
  const defaultCenter: [number, number] = [16.8661, 96.1951];
  const initialCenter: [number, number] =
    selectedLat && selectedLng ? [selectedLat, selectedLng] : defaultCenter;

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
    /**
     * Inline: apply immediately on the embedded map.
     * Expanded dialog: wait for Confirm.
     */
    if (variant === 'inline' && !isOpen) {
      onLocationSelect(lat, lng);
    }
  };

  const handleConfirm = () => {
    if (selectedLat !== null && selectedLng !== null) {
      onLocationSelect(selectedLat, selectedLng);
      handleClose();
    }
  };

  const handleOpen = () => {
    // Reset to current values when opening
    if (latitude && longitude) {
      const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
      const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
      if (!isNaN(lat) && !isNaN(lng)) {
        setSelectedLat(lat);
        setSelectedLng(lng);
      }
    }
    setIsOpen(true);
    // Prevent body scroll on mobile when map opens
    if (window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Restore body scroll on mobile
    if (window.innerWidth < 640) {
      document.body.style.overflow = '';
    }
  };

  const locationInfoBox = (
    <div className="leaflet-bottom leaflet-left" style={{ zIndex: 1000 }}>
      <div className="leaflet-control leaflet-bar bg-background/95 backdrop-blur-sm p-3 rounded-md shadow-lg border">
        <p className="text-sm font-semibold mb-1">
          {mm ? 'ရွေးထားသော တည်နေရာ' : 'Selected Location'}
        </p>
        <p className="text-xs text-muted-foreground">
          Latitude: {selectedLat !== null ? selectedLat.toFixed(6) : '-'}
        </p>
        <p className="text-xs text-muted-foreground">
          Longitude: {selectedLng !== null ? selectedLng.toFixed(6) : '-'}
        </p>
      </div>
    </div>
  );

  const expandedDialog = (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        } else {
          setIsOpen(true);
        }
      }}
    >
      <DialogContent
        size="2xl"
        className={`max-w-[98vw] w-[98vw] h-[96vh] flex flex-col !p-0 ${isMobile ? '!left-[1vw] !top-[2vh] !translate-x-0 !translate-y-0' : ''}`}
        style={{ maxHeight: '96vh' }}
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement;
          if (isMobile && target.closest('.leaflet-container')) {
            e.preventDefault();
          }
        }}
      >
        <div className="px-3 py-2 border-b flex items-center justify-between flex-shrink-0">
          <DialogHeader className="flex-1 py-0">
            <DialogTitle className="text-sm font-medium leading-tight">
              {mm ? 'တည်နေရာ ရွေးရန် (ကြီးမားသော မြေပုံ)' : 'Select location (expanded map)'}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div
          className="flex-1 relative overflow-hidden"
          style={{ minHeight: '70vh' }}
          onTouchStart={(e) => {
            if (isMobile) {
              e.stopPropagation();
            }
          }}
        >
          {typeof window !== 'undefined' && isOpen && (
            <MapContainer
              key="expanded-map"
              center={initialCenter}
              zoom={selectedLat && selectedLng ? 15 : 12}
              style={{
                height: '100%',
                width: '100%',
                zIndex: 0,
                minHeight: '70vh',
                touchAction: 'pan-x pan-y',
              }}
              scrollWheelZoom={true}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapInvalidateSize />
              <MapClickHandler onMapClick={handleMapClick} />
              {selectedLat !== null && selectedLng !== null && (
                <Marker position={[selectedLat, selectedLng]} />
              )}
              <UseCurrentLocationButton
                onLocationUpdate={(lat, lng) => {
                  setSelectedLat(lat);
                  setSelectedLng(lng);
                }}
              />
              {locationInfoBox}
            </MapContainer>
          )}
        </div>

        <div className="px-3 py-2 border-t flex-shrink-0">
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose} size="sm">
              {mm ? 'ပယ်ဖျက်' : 'Cancel'}
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={selectedLat === null || selectedLng === null}
              size="sm"
            >
              {mm ? 'တည်နေရာ အတည်ပြု' : 'Confirm location'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (variant === 'inline') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {mm
              ? 'မြေပုံပေါ်တွင် နှိပ်ပြီး တည်နေရာ ရွေးပါ'
              : 'Click on the map to choose the exact location'}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpen}
            className="shrink-0"
          >
            <Maximize2 className="h-4 w-4 mr-1.5" />
            {mm ? 'ချဲ့ရန်' : 'Expand'}
          </Button>
        </div>

        {/**
         * Hide inline map while expanded so Leaflet is not mounted twice.
         */}
        {!isOpen && (
          <div className={`relative w-full overflow-hidden rounded-lg border ${mapHeightClassName}`}>
            {typeof window !== 'undefined' && (
              <MapContainer
                key="inline-map"
                center={initialCenter}
                zoom={selectedLat && selectedLng ? 15 : 12}
                style={{
                  height: '100%',
                  width: '100%',
                  zIndex: 0,
                  touchAction: 'pan-x pan-y',
                }}
                scrollWheelZoom={true}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onMapClick={handleMapClick} />
                {selectedLat !== null && selectedLng !== null && (
                  <Marker position={[selectedLat, selectedLng]} />
                )}
                <UseCurrentLocationButton
                  onLocationUpdate={(lat, lng) => {
                    setSelectedLat(lat);
                    setSelectedLng(lng);
                    onLocationSelect(lat, lng);
                  }}
                />
                {locationInfoBox}
              </MapContainer>
            )}
          </div>
        )}

        {isOpen && (
          <div
            className={`w-full rounded-lg border bg-muted/40 flex items-center justify-center text-sm text-muted-foreground ${mapHeightClassName}`}
          >
            {mm ? 'ချဲ့ထားသော မြေပုံ ဖွင့်ထားသည်…' : 'Expanded map is open…'}
          </div>
        )}

        {expandedDialog}
      </div>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant={buttonVariant}
        onClick={handleOpen}
        className={`${className} text-left w-full sm:w-auto flex items-start sm:items-center`}
      >
        <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
        <span className="flex-1 inline-block break-words sm:inline sm:break-normal text-xs sm:text-sm leading-relaxed sm:leading-normal whitespace-normal text-left">
          {displayText}
        </span>
      </Button>
      {expandedDialog}
    </>
  );
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
}

/**
 * Dialog open often leaves Leaflet at wrong size until resize — force recalculate.
 */
function MapInvalidateSize() {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [map]);

  return null;
}

function UseCurrentLocationButton({
  onLocationUpdate,
}: {
  onLocationUpdate: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  const handleClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          onLocationUpdate(lat, lng);
          map.setView([lat, lng], 15);
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('Could not retrieve current location. Please enable location services or select manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="leaflet-top leaflet-right" style={{ zIndex: 1000 }}>
      <div className="leaflet-control leaflet-bar p-1 sm:p-2" style={{ border: 'none', background: 'transparent' }}>
        <Button
          type="button"
          onClick={handleClick}
          className="flex items-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm whitespace-nowrap"
          size="sm"
        >
          <LocateFixed className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="hidden sm:inline">Use Current Location</span>
          <span className="sm:hidden">Current</span>
        </Button>
      </div>
    </div>
  );
}
