import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface DirectOwnerBadgeProps {
  className?: string;
}

export function DirectOwnerBadge({ className }: DirectOwnerBadgeProps) {
  const { t } = useLanguage();

  return (
    <Badge
      className={`bg-gradient-to-r from-sky-500 to-blue-600 text-xs text-white border-0 shadow-lg ${className || ''}`}
    >
      <User className="h-3 w-3 mr-1 stroke-white stroke-2" />
      {t('search.directOwner') || 'Direct Owner Post'}
    </Badge>
  );
}
