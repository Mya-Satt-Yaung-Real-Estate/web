/**
 * Payment Provider Select Component
 * 
 * Component for selecting payment provider (AYA Pay, KBZ Pay, etc.)
 */

import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building2, Smartphone, Wallet } from 'lucide-react';
import type { PaymentProvider } from '@/types/payments';

interface PaymentProviderSelectProps {
  selectedProvider: PaymentProvider | null;
  onSelectProvider: (provider: PaymentProvider) => void;
}

const PAYMENT_PROVIDERS: Array<{
  name: PaymentProvider;
  icon: typeof Building2;
  description: string;
  brandColor: string;
}> = [
  { name: 'AYA Pay', icon: Smartphone, description: 'AYA Pay', brandColor: '#D81A22' }, // AYA Pay Primary Red
  { name: 'KBZ Pay', icon: Smartphone, description: 'KBZ Pay', brandColor: '#155AC7' }, // KBZ Pay Primary Blue
  { name: 'Wave Pay', icon: Smartphone, description: 'Wave Pay', brandColor: '#FDCB1C' }, // Wave Pay Primary Yellow
  { name: 'CB Pay', icon: Smartphone, description: 'CB Pay', brandColor: '#2B76EE' }, // CP Pay / Rainbow Logo Background Blue
  { name: 'OK$', icon: Smartphone, description: 'OK$', brandColor: '#0084FF' }, // OK Dollar Blue
  { name: 'Sai Sai Pay', icon: Smartphone, description: 'Sai Sai Pay', brandColor: '#7B2CBF' }, // Purple
  { name: 'Onepay', icon: Smartphone, description: 'Onepay', brandColor: '#1E88E5' }, // Onepay Blue
  { name: 'MPitesan', icon: Smartphone, description: 'MPitesan', brandColor: '#1976D2' }, // MPT Blue
  { name: 'MPT Pay', icon: Smartphone, description: 'MPT Pay', brandColor: '#1976D2' }, // MPT Blue
  { name: 'UAB Pay', icon: Smartphone, description: 'UAB Pay', brandColor: '#003D82' }, // UAB Bank Dark Blue
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {PAYMENT_PROVIDERS.map((provider) => {
          const Icon = provider.icon;
          const isSelected = selectedProvider === provider.name;

          return (
            <Card
              key={provider.name}
              className={`cursor-pointer transition-all hover:shadow-md ${
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
                <Icon
                  className={`h-6 w-6 ${
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  }`}
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

