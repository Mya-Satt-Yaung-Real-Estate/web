import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ExpiryBadgeProps {
  label: string;
  className?: string;
}

export function ExpiryBadge({ label, className }: ExpiryBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border-primary/30 bg-primary/5 text-primary font-medium hover:border-primary/50 hover:bg-primary/10',
        className
      )}
    >
      {label}
    </Badge>
  );
}
