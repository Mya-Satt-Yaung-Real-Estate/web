import { CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface InstallmentBadgeProps {
  className?: string;
}

export function InstallmentBadge({ className }: InstallmentBadgeProps) {
  const { t } = useLanguage();
  return (
    <Badge 
      className={`bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg ${className || ''}`}
    >
      <CreditCard className="h-3 w-3 mr-1 stroke-white stroke-2" />
      {t('listings.installment') || 'Installment'}
    </Badge>
  );
}

