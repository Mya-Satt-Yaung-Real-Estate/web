import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PremiumBadgeProps {
  className?: string;
}

export function PremiumBadge({ className }: PremiumBadgeProps) {
  return (
    <Badge 
      className={`bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0 shadow-lg ${className || ''}`}
    >
      <Star className="h-3 w-3 mr-1 fill-white" />
      Premium
    </Badge>
  );
}


