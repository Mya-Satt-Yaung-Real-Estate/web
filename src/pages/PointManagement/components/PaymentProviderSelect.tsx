/**
 * Payment Provider Select Component
 * 
 * Component for selecting payment provider (AYA Pay, KBZ Pay, etc.)
 */

import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PaymentProvider } from '@/types/payments';

interface PaymentProviderSelectProps {
  selectedProvider: PaymentProvider | null;
  onSelectProvider: (provider: PaymentProvider) => void;
}

const PAYMENT_PROVIDERS: Array<{
  name: PaymentProvider;
  logo: string;
  description: string;
  brandColor: string;
}> = [
  { name: 'AYA Pay', logo: '/aya_pay.png', description: 'AYA Pay', brandColor: '#D81A22' },
  { name: 'KBZ Pay', logo: '/kbz_pay.png', description: 'KBZ Pay', brandColor: '#155AC7' },
  { name: 'Wave Pay', logo: '/wave_pay.jpeg', description: 'Wave Pay', brandColor: '#FDCB1C' },
  // { name: 'CB Pay', logo: '/cp_pay.png', description: 'CB Pay', brandColor: '#2B76EE' },
  { name: 'UAB Pay', logo: '/uab_pay.jpeg', description: 'UAB Pay', brandColor: '#003D82' },
  { name: 'OK$', logo: '/ok_pay.jpeg', description: 'OK$', brandColor: '#0084FF' },
  { name: 'Sai Sai Pay', logo: '/saisai_pay.jpeg', description: 'Sai Sai Pay', brandColor: '#7B2CBF' },
  { name: 'Onepay', logo: '/one_pay.png', description: 'Onepay', brandColor: '#1E88E5' },
  { name: 'MPitesan', logo: '/mpitesan_pay.png', description: 'MPitesan', brandColor: '#1976D2' },
  { name: 'MPT Pay', logo: '/mpt_pay.png', description: 'MPT Pay', brandColor: '#1976D2' },
];

export function PaymentProviderSelect({
  selectedProvider,
  onSelectProvider,
}: PaymentProviderSelectProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        {t('payments.selectProvider') || 'Select Payment Provider'}
      </label>
      <div className="grid grid-cols-2 pt-1.5 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {PAYMENT_PROVIDERS.map((provider) => {
          const isSelected = selectedProvider === provider.name;

          return (
            <Card
              key={provider.name}
              className={`cursor-pointer transition-all hover:shadow-md max-w-[150px] ${
                isSelected
                  ? 'ring-2 bg-primary/5'
                  : 'hover:bg-muted/50'
              }`}
              style={isSelected ? { 
                borderColor: provider.brandColor,
                '--tw-ring-color': provider.brandColor,
              } as React.CSSProperties & { '--tw-ring-color': string } : {}}
              onClick={() => onSelectProvider(provider.name)}
            >
              <CardContent className="pt-6 pb-4 px-4 flex flex-col items-center gap-2">
                <img
                  src={provider.logo}
                  alt={provider.name}
                  className="h-12 w-12 object-contain"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <span 
                  className="text-sm font-medium text-center"
                  style={{ 
                    color: provider.brandColor
                  }}
                >
                  {provider.name}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

