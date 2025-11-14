/**
 * Quick Actions Card Component
 * 
 * Displays quick action buttons for property-related features.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Calculator, FileText } from 'lucide-react';

interface QuickActionsCardProps {
  onNavigate: (path: string) => void;
  t: (key: string) => string | undefined;
}

export function QuickActionsCard({
  onNavigate,
  t,
}: QuickActionsCardProps) {
  return (
    <Card>
      <CardContent className="p-6 pt-7">
        <h4 className="mb-4">{t('propertyDetail.quickActions') || 'Quick Actions'}</h4>
        
        <div className="space-y-3">
          {/* Appointment Request */}
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 h-auto py-3"
            onClick={() => onNavigate('/appointments')}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm">{t('propertyDetail.appointmentRequest') || 'Appointment Request'}</p>
              <p className="text-xs text-muted-foreground">{t('propertyDetail.scheduleViewing') || 'Schedule a viewing'}</p>
            </div>
          </Button>

          {/* Loan Calculator */}
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 h-auto py-3"
            onClick={() => onNavigate('/loan-calculator')}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm">{t('propertyDetail.loanCalculator') || 'Loan Calculator'}</p>
              <p className="text-xs text-muted-foreground">{t('propertyDetail.calculatePayment') || 'Calculate payment'}</p>
            </div>
          </Button>

          {/* Yar Pyat Tax Calculator */}
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 h-auto py-3"
            onClick={() => onNavigate('/yarpyat-taxes-calculator')}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm">{t('propertyDetail.yarPyatTax') || 'Yar Pyat Tax Calculator'}</p>
              <p className="text-xs text-muted-foreground">{t('propertyDetail.calculateTax') || 'Calculate tax'}</p>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

