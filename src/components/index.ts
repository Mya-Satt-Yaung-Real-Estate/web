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
// Feature components
// ============================================================================

// Home Feature Components
export { PropertyCarousel } from '../pages/home/components/carousel';
export { AdvancedSearchFilter } from '../pages/home/components/search';
export { PropertyListingCard } from '../pages/home/components/cards';
export { WantedListingCard } from '../pages/home/components/cards';
export { AdvertisementCard } from '../pages/home/components/cards';
export { AdvertisementCardSimple } from '../pages/home/components/cards';
export { EventCard } from '../pages/home/components/cards';
export { PremiumPostCard } from '../pages/home/components/cards';
export { MapView } from '../pages/home/components/shared';

// Mobile Home Components
export { MobilePropertyCarousel } from '../pages/home/components/carousel';
export { MobileAdvancedSearchFilter } from '../pages/home/components/search';

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
export { LazyImage } from './LazyImage';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { SearchFilters } from '../pages/home/components/search';