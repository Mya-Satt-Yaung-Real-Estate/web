import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { IndividualFields } from './IndividualFields';
import { CompanyFields } from './CompanyFields';

interface RegisterFormProps {
  phone: string;
  onSuccess: () => void;
}

export function RegisterForm({ phone, onSuccess }: RegisterFormProps) {
  const { t } = useLanguage();
  const [userType, setUserType] = useState<'individual' | 'company'>('individual');

  return (
    <Tabs value={userType} onValueChange={(value) => setUserType(value as 'individual' | 'company')} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="individual" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          {t('signup.register.individual') || 'Individual'}
        </TabsTrigger>
        <TabsTrigger value="company" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          {t('signup.register.company') || 'Company'}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="individual">
        <IndividualFields phone={phone} onSuccess={onSuccess} />
      </TabsContent>

      <TabsContent value="company">
        <CompanyFields phone={phone} onSuccess={onSuccess} />
      </TabsContent>
    </Tabs>
  );
}


