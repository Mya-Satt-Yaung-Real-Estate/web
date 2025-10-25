/**
 * Events Section
 * 
 * Lazy-loaded section for events and property map.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/features/home/EventCard';
import { MapView } from '@/components/features/home/MapView';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Event {
  id: string;
  image: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface Location {
  id: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
  type: string;
}

interface EventsSectionProps {
  events: Event[];
  propertyLocations: Location[];
}

export function EventsSection({ events, propertyLocations }: EventsSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="mb-4">{t('events.title')}</h2>
            <p className="text-muted-foreground">
              {t('events.subtitle')}
            </p>
          </div>
          <Link to="/search-all?type=event">
            <Button variant="outline">
              {t('events.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {events.map(event => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>

        {/* Property Listings Map */}
        <div className="mt-12">
          <div className="mb-6">
            <h3 className="mb-2">Featured Property Locations</h3>
            <p className="text-muted-foreground">
              Explore featured properties on the map
            </p>
          </div>
          <MapView locations={propertyLocations} height="400px" />
        </div>
      </div>
    </section>
  );
}
