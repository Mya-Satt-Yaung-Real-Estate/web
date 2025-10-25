/**
 * Event Card Component
 * 
 * Displays event information in a card format.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';

interface EventCardProps {
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

export function EventCard({
  image,
  title,
  description,
  date,
  time,
  location,
  attendees,
  category,
  status,
}: EventCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500';
      case 'ongoing':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all border-border/50 hover:border-primary/50 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <Badge className={`absolute top-4 left-4 ${getStatusColor(status)} text-white border-0`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        <Badge variant="secondary" className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm">
          {category}
        </Badge>
      </div>
      
      <CardHeader>
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <p className="text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-primary" />
            <span>{attendees} attendees</span>
          </div>
        </div>
        
        <Button className="w-full group-hover:bg-primary group-hover:text-white transition-all" variant="outline">
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
