import { useState, useEffect } from 'react';
import { MapPin, LocateFixed } from 'lucide-react';
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
  delete (L.Icon.Default.prototype as any)._getIconUrl;
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
}

export function MapLocationPicker({
  latitude,
  longitude,
  onLocationSelect,
  buttonText,
  buttonVariant = 'outline',
  className = '',
}: MapLocationPickerProps) {
  const { t } = useLanguage();
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
  };

  const handleConfirm = () => {
    if (selectedLat !== null && selectedLng !== null) {
      onLocationSelect(selectedLat, selectedLng);
      setIsOpen(false);
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

      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          handleClose();
        } else {
          setIsOpen(true);
        }
      }}>
        <DialogContent 
          size="2xl" 
          className={`max-w-[90vw] h-[90vh] flex flex-col p-0 ${isMobile ? '!left-[5vw] !top-[5vh] !translate-x-0 !translate-y-0' : ''}`}
          style={{
            maxHeight: '90vh'
          }}
          onInteractOutside={(e) => {
            // Prevent closing on mobile when interacting with map
            const target = e.target as HTMLElement;
            if (isMobile && target.closest('.leaflet-container')) {
              e.preventDefault();
            }
          }}
        >
          {/* Header */}
          <div className="px-3 py-2 border-b flex items-center justify-between flex-shrink-0">
            <DialogHeader className="flex-1 py-0">
              <DialogTitle className="text-base leading-tight">Select Property Location</DialogTitle>
            </DialogHeader>
          </div>

          {/* Map Area */}
          <div 
            className="flex-1 relative overflow-hidden" 
            style={{ minHeight: '650px' }}
            onTouchStart={(e) => {
              // Prevent dialog movement on mobile when touching map
              if (isMobile) {
                e.stopPropagation();
              }
            }}
          >
            {typeof window !== 'undefined' && (
              <MapContainer
                center={initialCenter}
                zoom={selectedLat && selectedLng ? 15 : 10}
                style={{ 
                  height: '100%', 
                  width: '100%', 
                  zIndex: 0, 
                  minHeight: '600px',
                  touchAction: 'pan-x pan-y'
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

                {/* "Use Current Location" Button - Top Right */}
                <UseCurrentLocationButton onLocationUpdate={(lat, lng) => {
                  setSelectedLat(lat);
                  setSelectedLng(lng);
                }} />

                {/* "Selected Location" Display Box - Bottom Left */}
                <div className="leaflet-bottom leaflet-left" style={{ zIndex: 1000 }}>
                  <div className="leaflet-control leaflet-bar bg-background/95 backdrop-blur-sm p-3 rounded-md shadow-lg border">
                    <p className="text-sm font-semibold mb-1">Selected Location</p>
                    <p className="text-xs text-muted-foreground">
                      Latitude: {selectedLat !== null ? selectedLat.toFixed(6) : '-'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Longitude: {selectedLng !== null ? selectedLng.toFixed(6) : '-'}
                    </p>
                  </div>
                </div>
              </MapContainer>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t flex-shrink-0">
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={selectedLat === null || selectedLng === null}
                size="sm"
              >
                Confirm Location
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Component to handle map click events
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

// Component for "Use Current Location" button that needs map instance
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

