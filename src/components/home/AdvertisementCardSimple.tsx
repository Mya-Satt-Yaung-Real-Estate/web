import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Star } from 'lucide-react';
import { ImageWithFallback } from '../ImageWithFallback';
import { useNavigate } from 'react-router-dom';

interface AdvertisementCardSimpleProps {
  id: string;
  image: string;
  title: string;
  description: string;
  promoted?: boolean;
}

export function AdvertisementCardSimple({
  id,
  image,
  title,
  description,
  promoted,
}: AdvertisementCardSimpleProps) {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-border/50 backdrop-blur-sm cursor-pointer hover:-translate-y-1"
      onClick={() => navigate(`/advertisement/${id}`)}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Promoted Badge */}
        {promoted && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0 shadow-lg">
              <Star className="h-3 w-3 mr-1 fill-white" />
              Promoted
            </Badge>
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h4 className="text-white mb-2 line-clamp-1 group-hover:text-amber-300 transition-colors">
            {title}
          </h4>
          <p className="text-white/90 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}
