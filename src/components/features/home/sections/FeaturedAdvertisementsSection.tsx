/**
 * Featured Advertisements Section
 * 
 * Lazy-loaded section for featured advertisements with carousel.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AdvertisementCardSimple } from '@/components/features/home/AdvertisementCardSimple';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
// import Autoplay from 'embla-carousel-autoplay@8.6.0';

interface Advertisement {
  id: string;
  image: string;
  title: string;
  description: string;
  promoted: boolean;
}

interface FeaturedAdvertisementsSectionProps {
  advertisements: Advertisement[];
}

export function FeaturedAdvertisementsSection({ advertisements }: FeaturedAdvertisementsSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="mb-4">{t('ads.title')}</h2>
            <p className="text-muted-foreground">
              {t('ads.subtitle')}
            </p>
          </div>
          <Link to="/search-all?type=advertisement">
            <Button variant="outline">
              {t('ads.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {advertisements.map(ad => (
              <CarouselItem key={ad.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <AdvertisementCardSimple 
                  id={ad.id}
                  image={ad.image}
                  title={ad.title}
                  description={ad.description}
                  promoted={ad.promoted}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 bg-background/90 backdrop-blur-sm border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all" />
          <CarouselNext className="hidden md:flex -right-4 bg-background/90 backdrop-blur-sm border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all" />
        </Carousel>
      </div>
    </section>
  );
}
