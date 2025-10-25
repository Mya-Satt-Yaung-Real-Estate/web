/**
 * Component Exports
 * 
 * Essential components for the application.
 */

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

export { Navigation } from './layout/Navigation';
export { Footer } from './layout/Footer';
export { Layout } from './layout/Layout';

// Mobile Layout Components
export { MobileNavigation } from './layout/mobile/MobileNavigation';

// ============================================================================
// FEATURE COMPONENTS
// ============================================================================

// Home Feature Components
export { PropertyCarousel } from './features/home/PropertyCarousel';
export { AdvancedSearchFilter } from './features/home/AdvancedSearchFilter';
export { PropertyListingCard } from './features/home/PropertyListingCard';
export { WantedListingCard } from './features/home/WantedListingCard';
export { AdvertisementCard } from './features/home/AdvertisementCard';
export { AdvertisementCardSimple } from './features/home/AdvertisementCardSimple';
export { EventCard } from './features/home/EventCard';
export { PremiumPostCard } from './features/home/PremiumPostCard';
export { MapView } from './features/home/MapView';

// Mobile Home Components
export { MobilePropertyCarousel } from './features/home/mobile/MobilePropertyCarousel';
export { MobileAdvancedSearchFilter } from './features/home/mobile/MobileAdvancedSearchFilter';

// ============================================================================
// UI COMPONENTS
// ============================================================================

export { Button, buttonVariants } from './ui/button';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './ui/card';
export { Badge } from './ui/badge';
export { Input } from './ui/input';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

// ============================================================================
// COMMON COMPONENTS
// ============================================================================

export { NotificationDropdown } from './common/NotificationDropdown';
export { ImageWithFallback } from './ImageWithFallback';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { SearchFilters } from './features/home/AdvancedSearchFilter';