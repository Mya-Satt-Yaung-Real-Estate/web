/**
 * Payment Method Select Component
 * 
 * Component for selecting payment method (QR, PIN, PWA) based on provider
 */

import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { QrCode, Hash, Smartphone } from 'lucide-react';
import type { PaymentMethod, PaymentProvider } from '@/types/payments';

interface PaymentMethodSelectProps {
  provider: PaymentProvider | null;
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
}

const PROVIDER_METHODS: Record<PaymentProvider, PaymentMethod[]> = {
  'AYA Pay': ['QR', 'PIN'],
  'KBZ Pay': ['QR'],
  'Wave Pay': ['PIN'],
  'OK$': ['PIN'],
  'Sai Sai Pay': ['PIN'],
  'Onepay': ['PIN'],
  'MPitesan': ['PIN'],
  'MPT Pay': ['PIN'],
  'CB Pay': ['QR'],
  'UAB Pay': ['PIN'],
};

const METHOD_CONFIG: Record<PaymentMethod, { icon: typeof QrCode; label: string }> = {
  QR: { icon: QrCode, label: 'QR Code' },
  PIN: { icon: Hash, label: 'PIN' },
  PWA: { icon: Smartphone, label: 'PWA' },
};

export function PaymentMethodSelect({
  provider,
  selectedMethod,
  onSelectMethod,
}: PaymentMethodSelectProps) {
  const { t } = useLanguage();

  if (!provider) {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium">
          {t('payments.selectMethod') || 'Select Payment Method'}
        </label>
        <p className="text-sm text-muted-foreground">
          {t('payments.selectProviderFirst') || 'Please select a payment provider first'}
        </p>
      </div>
    );
  }

  const availableMethods = PROVIDER_METHODS[provider] || [];

  if (availableMethods.length === 0) {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium">
          {t('payments.selectMethod') || 'Select Payment Method'}
        </label>
        <p className="text-sm text-muted-foreground">
          {t('payments.noMethodsAvailable') || 'No payment methods available for this provider'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        {t('payments.selectMethod') || 'Select Payment Method'}
      </label>
      <div className="grid pt-1.5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {availableMethods.map((method) => {
          const config = METHOD_CONFIG[method];
          const Icon = config.icon;
          const isSelected = selectedMethod === method;

          return (
            <Card
              key={method}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => onSelectMethod(method)}
            >
              <CardContent className="pt-6 pb-4 px-4 flex flex-col items-center gap-2">
                <Icon
                  className={`h-6 w-6 ${
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <span
                  className={`text-sm font-medium text-center ${
                    isSelected ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {config.label}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

