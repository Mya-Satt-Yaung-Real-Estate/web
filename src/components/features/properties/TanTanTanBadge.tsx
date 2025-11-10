import { Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface TanTanTanBadgeProps {
  className?: string;
}

export function TanTanTanBadge({ className }: TanTanTanBadgeProps) {
  const { t } = useLanguage();
  return (
    <Badge 
      className={`bg-gradient-to-r from-primary to-[#4a9b82] text-white border-0 shadow-lg ${className || ''}`}
    >
      <Target className="h-3 w-3 mr-1 stroke-white stroke-2" />
      {t('search.tanTanTan') || 'Tan Tan Tan'}
    </Badge>
  );
}

