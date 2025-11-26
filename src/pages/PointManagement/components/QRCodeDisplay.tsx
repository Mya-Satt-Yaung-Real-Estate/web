/**
 * QR Code Display Component
 * 
 * Component for displaying QR code for payment
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface QRCodeDisplayProps {
  qrCode: string;
  amount: number;
  orderId: string;
  transactionNum: string;
  providerName: string;
}

export function QRCodeDisplay({
  qrCode,
  amount,
  orderId,
  transactionNum,
  providerName,
}: QRCodeDisplayProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Generate QR code image URL from the QR code string
  // Note: This is a placeholder. You may want to use a QR code library like 'qrcode.react'
  // For now, we'll create a data URL or use an external QR code service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCode)}`;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          {t('payments.scanQRCode') || 'Scan QR Code to Pay'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('payments.scanWithProvider', { provider: providerName }) ||
            `Open your ${providerName} app and scan this QR code`}
        </p>
      </div>

      <Card>
        <CardContent className="p-6 flex flex-col items-center gap-4">
          {/* QR Code Image */}
          <div className="bg-white p-4 rounded-lg border-2 border-primary/20">
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-64 h-64"
              onError={(e) => {
                // Fallback: Show QR code string if image fails
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<div class="text-xs break-all p-4">${qrCode}</div>`;
                }
              }}
            />
          </div>

          {/* Order Details */}
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">
                {t('payments.amount') || 'Amount'}
              </span>
              <span className="font-semibold text-primary">
                {amount.toLocaleString()} MMK
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">
                {t('payments.orderId') || 'Order ID'}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{orderId}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCopyOrderId}
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">
                {t('payments.transactionNum') || 'Transaction Number'}
              </span>
              <span className="font-mono text-sm">{transactionNum}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="w-full p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>{t('payments.instructions') || 'Instructions:'}</strong>
            </p>
            <ol className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1 list-decimal list-inside">
              <li>
                {t('payments.instruction1') || 'Open your payment app'}
              </li>
              <li>
                {t('payments.instruction2') || 'Scan the QR code above'}
              </li>
              <li>
                {t('payments.instruction3') || 'Confirm the payment amount'}
              </li>
              <li>
                {t('payments.instruction4') || 'Complete the payment'}
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

