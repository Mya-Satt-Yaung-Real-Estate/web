import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FeatureBadgeProps {
  label: string;
  className?: string;
}

export function FeatureBadge({ label, className }: FeatureBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border-amber-400 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 font-medium hover:border-amber-500 hover:from-amber-200 hover:to-yellow-200 hover:text-amber-900',
        className
      )}
    >
      {label}
    </Badge>
  );
}
