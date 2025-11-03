/**
 * Loan Request Create Page
 * 
 * Allows users to submit loan requests for property financing.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormValidation } from '@/hooks/useFormValidation';
import { createLoanRequestSchema } from '@/lib/validation/loanRequest';
import { useCreateLoanRequest } from '@/hooks/mutations/useLoanRequestMutations';
import { usePropertyTypes } from '@/hooks/queries/usePropertyTypes';
import { useModal } from '@/contexts/ModalContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/forms';
import { 
  Banknote, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Briefcase,
  CheckCircle2,
  Calculator
} from 'lucide-react';
import type { CreateLoanRequestData } from '@/types/loanRequest';

const LOAN_PURPOSES = [
  'Home Purchase',
  'Home Construction',
  'Home Renovation',
  'Land Purchase',
  'Business Property'
];

export default function CreateLoanRequest() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const seo = seoUtils.getPageSEO('loanRequest');
  const { showError } = useModal();
  const [submitted, setSubmitted] = useState(false);

  // Fetch property types
  const { data: propertyTypesData, isLoading: propertyTypesLoading } = usePropertyTypes();
  const propertyTypes = propertyTypesData?.data || [];

  // Form validation
  const { form, errors } = useFormValidation(createLoanRequestSchema);

  // Mutation
  const createLoanRequestMutation = useCreateLoanRequest();

  // Initialize form defaults
  useEffect(() => {
    form.setValue('agree_terms', false);
    form.setValue('consent_personal_data', false);
    form.setValue('authorize_credit_check', false);
  }, [form]);

  // Scroll to top when success page is shown
  useEffect(() => {
    if (submitted) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [submitted]);

  const isLoading = propertyTypesLoading;
  const isSubmitting = createLoanRequestMutation.isPending;

  const onSubmit = async (data: any) => {
    try {
      // Ensure loan_purpose is a valid string value and matches one of the allowed values
      const trimmedLoanPurpose = data.loan_purpose ? data.loan_purpose.trim() : '';
      if (!trimmedLoanPurpose || trimmedLoanPurpose === '') {
        form.setError('loan_purpose', {
          type: 'manual',
          message: t('validation.loanPurpose.required') || 'Loan purpose is required'
        });
        return;
      }

      // Validate that loan_purpose is one of the allowed values
      if (!LOAN_PURPOSES.includes(trimmedLoanPurpose)) {
        form.setError('loan_purpose', {
          type: 'manual',
          message: t('validation.loanPurpose.required') || 'Loan purpose is required'
        });
        return;
      }

      // Prepare payload - all fields except property_type_id and additional_notes are required
      const payload: CreateLoanRequestData = {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        nrc_number: data.nrc_number,
        date_of_birth: data.date_of_birth,
        current_address: data.current_address,
        occupation: data.occupation,
        employer: data.employer,
        monthly_income: Number(data.monthly_income),
        work_experience: Number(data.work_experience),
        requested_amount: Number(data.requested_amount),
        loan_purpose: trimmedLoanPurpose as 'Home Purchase' | 'Home Construction' | 'Home Renovation' | 'Land Purchase' | 'Business Property',
        property_type_id: data.property_type_id !== undefined && data.property_type_id !== null && data.property_type_id !== '' && data.property_type_id !== 'all' ? Number(data.property_type_id) : undefined,
        property_value: Number(data.property_value),
        down_payment: Number(data.down_payment),
        property_location: data.property_location,
        additional_notes: data.additional_notes || undefined,
        agree_terms: data.agree_terms,
        consent_personal_data: data.consent_personal_data,
        authorize_credit_check: data.authorize_credit_check,
      };

      await createLoanRequestMutation.mutateAsync(payload);
      
      // Show success page instead of modal
      setSubmitted(true);
    } catch (error: any) {
      console.error('Create loan request failed:', error);
      const errorMessage = error?.response?.data?.message || error?.message || t('loanRequest.errorMessage') || 'Failed to submit loan request';
      showError(errorMessage, t('loanRequest.errorTitle') || 'Error');
    }
  };

  // Success screen
  if (submitted) {
    return (
      <>
        <SEOHead seo={seo} path="/loan-request" />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto flex items-center min-h-[calc(100vh-12rem)]">
            <Card className="border-2 border-primary/20 shadow-xl w-full">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-[#4a9b82] text-white mb-6 shadow-lg shadow-primary/25">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold mb-4">{t('loanRequest.submittedTitle') || 'Loan Request Submitted!'}</h2>
                <p className="text-muted-foreground mb-8">
                  {t('loanRequest.submittedMessage') || 'Thank you for your loan request. Our financing team will review your application and contact you within 1 week to discuss the next steps.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => navigate('/yarpyat-taxes-calculator')} variant="outline" className="gap-2">
                    <Calculator className="h-4 w-4" />
                    {t('loanRequest.useCalculator') || 'Use Loan Calculator'}
                  </Button>
                  <Button onClick={() => navigate('/')} className="gap-2">
                    {t('loanRequest.returnHome') || 'Return to Home'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead seo={seo} path="/loan-request" />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-lg">
                <Banknote className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent text-center">
              {t('services.loanRequest') || 'Property Loan Request'}
            </h1>
            <p className="text-muted-foreground mt-2 text-center">
              {t('services.loanRequestDesc') || 'Apply for property financing with competitive rates'}
            </p>
          </div>

          {/* Loan Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border-primary/20">
              <CardContent className="!pt-6 px-6 pb-6 text-center">
                <div className="text-primary mb-2 text-2xl font-bold">Up to 80%</div>
                <p className="text-sm text-muted-foreground">{t('loanRequest.ltvRatio') || 'Loan-to-Value Ratio'}</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="!pt-6 px-6 pb-6 text-center">
                <div className="text-primary mb-2 text-2xl font-bold">5.5% - 8%</div>
                <p className="text-sm text-muted-foreground">{t('loanRequest.interestRate') || 'Interest Rate Range'}</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="!pt-6 px-6 pb-6 text-center">
                <div className="text-primary mb-2 text-2xl font-bold">Up to 20 Years</div>
                <p className="text-sm text-muted-foreground">{t('loanRequest.tenure') || 'Loan Tenure'}</p>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Personal Information */}
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  {t('loanRequest.personalInformation') || 'Personal Information'}
                </CardTitle>
                <CardDescription>{t('loanRequest.personalDescription') || 'Please provide your personal details'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField name="full_name" label={t('loanRequest.fullName') || 'Full Name'} error={errors.full_name} required>
                  <Input
                    {...form.register('full_name')}
                    placeholder={t('loanRequest.fullNamePlaceholder') || 'Enter your full name'}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="email" label={t('loanRequest.email') || 'Email'} error={errors.email} required>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...form.register('email')}
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10"
                      />
                    </div>
                  </FormField>
                  <FormField name="phone" label={t('loanRequest.phone') || 'Phone Number'} error={errors.phone} required>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...form.register('phone')}
                        type="tel"
                        placeholder="e.g., +959445566778"
                        className="pl-10"
                      />
                    </div>
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="nrc_number" label={t('loanRequest.nrcNumber') || 'NRC Number'} error={errors.nrc_number} required>
                    <Input
                      {...form.register('nrc_number')}
                      placeholder="e.g., 12/YAMANA(N)123456"
                    />
                  </FormField>

                  <FormField name="date_of_birth" label={t('loanRequest.dateOfBirth') || 'Date of Birth'} error={errors.date_of_birth} required>
                    <Input
                      {...form.register('date_of_birth')}
                      type="date"
                    />
                  </FormField>
                </div>

                <FormField name="current_address" label={t('loanRequest.currentAddress') || 'Current Address'} error={errors.current_address} required>
                  <Input
                    {...form.register('current_address')}
                    placeholder="e.g., No.45, Pyay Road, Yangon"
                  />
                </FormField>
              </CardContent>
            </Card>

            {/* Employment Information */}
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="h-5 w-5 text-primary" />
                  {t('loanRequest.employmentInformation') || 'Employment Information'}
                </CardTitle>
                <CardDescription>{t('loanRequest.employmentDescription') || 'Please provide your employment details'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField name="occupation" label={t('loanRequest.occupation') || 'Occupation'} error={errors.occupation} required>
                  <Input
                    {...form.register('occupation')}
                    placeholder="e.g., Business Owner, Engineer"
                  />
                </FormField>

                <FormField name="employer" label={t('loanRequest.employer') || 'Employer/Company Name'} error={errors.employer} required>
                  <Input
                    {...form.register('employer')}
                    placeholder="Company name"
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="monthly_income" label={t('loanRequest.monthlyIncome') || 'Monthly Income (MMK)'} error={errors.monthly_income} required>
                    <Input
                      {...form.register('monthly_income')}
                      type="number"
                      placeholder="e.g., 2000000"
                      onChange={(e) => form.setValue('monthly_income', e.target.value ? Number(e.target.value) : 0, { shouldValidate: true })}
                    />
                  </FormField>
                  <FormField name="work_experience" label={t('loanRequest.workExperience') || 'Work Experience (Years)'} error={errors.work_experience} required>
                    <Input
                      {...form.register('work_experience')}
                      type="number"
                      placeholder="e.g., 7"
                      onChange={(e) => form.setValue('work_experience', e.target.value ? Number(e.target.value) : 0, { shouldValidate: true })}
                    />
                  </FormField>
                </div>
              </CardContent>
            </Card>

            {/* Loan Information */}
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Banknote className="h-5 w-5 text-primary" />
                  {t('loanRequest.loanInformation') || 'Loan Information'}
                </CardTitle>
                <CardDescription>{t('loanRequest.loanDescription') || 'Specify your loan requirements'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="requested_amount" label={t('loanRequest.requestedAmount') || 'Requested Loan Amount (MMK)'} error={errors.requested_amount} required>
                    <Input
                      {...form.register('requested_amount')}
                      type="number"
                      placeholder="e.g., 30000000"
                      onChange={(e) => form.setValue('requested_amount', e.target.value ? Number(e.target.value) : 0, { shouldValidate: true })}
                    />
                  </FormField>

                  <FormField name="loan_purpose" label={t('loanRequest.loanPurpose') || 'Loan Purpose'} error={errors.loan_purpose} required>
                    <Select
                      value={form.watch('loan_purpose') || ''}
                      onValueChange={(value) => {
                        // Ensure the value is one of the valid loan purposes
                        if (LOAN_PURPOSES.includes(value)) {
                          form.setValue('loan_purpose', value as any, { shouldValidate: true });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('loanRequest.selectLoanPurpose') || 'Select loan purpose'} />
                      </SelectTrigger>
                      <SelectContent>
                        {LOAN_PURPOSES.map((purpose) => (
                          <SelectItem key={purpose} value={purpose}>
                            {purpose}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>
              </CardContent>
            </Card>

            {/* Property Information */}
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-primary" />
                  {t('loanRequest.propertyInformation') || 'Property Information'}
                </CardTitle>
                <CardDescription>{t('loanRequest.propertyDescription') || 'Provide property details for the loan'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField name="property_type_id" label={t('loanRequest.propertyType') || 'Property Type'} error={errors.property_type_id}>
                  <Select
                    value={form.watch('property_type_id')?.toString() || 'all'}
                    onValueChange={(value) => form.setValue('property_type_id', value === 'all' ? undefined : Number(value), { shouldValidate: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('loanRequest.selectPropertyType') || 'Select property type (optional)'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('loanRequest.allTypes') || 'All Types'}</SelectItem>
                      {propertyTypes.map((type: any) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {language === 'mm' ? type.name_mm : type.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="property_value" label={t('loanRequest.propertyValue') || 'Property Value (MMK)'} error={errors.property_value} required>
                    <Input
                      {...form.register('property_value')}
                      type="number"
                      placeholder="e.g., 500000000"
                      onChange={(e) => form.setValue('property_value', e.target.value ? Number(e.target.value) : 0, { shouldValidate: true })}
                    />
                  </FormField>

                  <FormField name="down_payment" label={t('loanRequest.downPayment') || 'Down Payment (MMK)'} error={errors.down_payment} required>
                    <Input
                      {...form.register('down_payment')}
                      type="number"
                      placeholder="e.g., 10000000"
                      onChange={(e) => form.setValue('down_payment', e.target.value ? Number(e.target.value) : 0, { shouldValidate: true })}
                    />
                  </FormField>
                </div>

                <FormField name="property_location" label={t('loanRequest.propertyLocation') || 'Property Location Address'} error={errors.property_location} required>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...form.register('property_location')}
                      placeholder="e.g., No.123, Main Road, Hlaing Township, Yangon"
                      className="pl-10"
                    />
                  </div>
                </FormField>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  {t('loanRequest.additionalInformation') || 'Additional Information'}
                </CardTitle>
                <CardDescription>{t('loanRequest.additionalDescription') || 'Any other details you\'d like to share'}</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField name="additional_notes" label={t('loanRequest.additionalNotes') || 'Additional Notes'} error={errors.additional_notes}>
                  <Textarea
                    {...form.register('additional_notes')}
                    placeholder={t('loanRequest.additionalNotesPlaceholder') || 'Please provide any additional information that might help us process your loan request...'}
                    rows={4}
                  />
                </FormField>
              </CardContent>
            </Card>

            {/* Consent and Terms */}
            <Card className="mb-8 shadow-lg border-amber-200/50 bg-amber-50/50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="text-lg">{t('loanRequest.consentAndTerms') || 'Consent and Terms'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agree_terms"
                    checked={form.watch('agree_terms')}
                    onCheckedChange={(checked) => form.setValue('agree_terms', checked as boolean)}
                  />
                  <Label htmlFor="agree_terms" className="cursor-pointer leading-tight">
                    {t('loanRequest.agreeTerms') || 'I agree to the terms and conditions'}
                    <span className="text-destructive">*</span>
                  </Label>
                </div>
                {errors.agree_terms && (
                  <p className="text-sm text-destructive ml-7">{errors.agree_terms.message}</p>
                )}

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent_personal_data"
                    checked={form.watch('consent_personal_data')}
                    onCheckedChange={(checked) => form.setValue('consent_personal_data', checked as boolean)}
                  />
                  <Label htmlFor="consent_personal_data" className="cursor-pointer leading-tight">
                    {t('loanRequest.consentPersonalData') || 'I consent to the processing of my personal data'}
                    <span className="text-destructive">*</span>
                  </Label>
                </div>
                {errors.consent_personal_data && (
                  <p className="text-sm text-destructive ml-7">{errors.consent_personal_data.message}</p>
                )}

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="authorize_credit_check"
                    checked={form.watch('authorize_credit_check')}
                    onCheckedChange={(checked) => form.setValue('authorize_credit_check', checked as boolean)}
                  />
                  <Label htmlFor="authorize_credit_check" className="cursor-pointer leading-tight">
                    {t('loanRequest.authorizeCreditCheck') || 'I authorize credit check'}
                    <span className="text-destructive">*</span>
                  </Label>
                </div>
                {errors.authorize_credit_check && (
                  <p className="text-sm text-destructive ml-7">{errors.authorize_credit_check.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end mb-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/yarpyat-taxes-calculator')}
                className="gap-2"
              >
                <Calculator className="h-4 w-4" />
                {t('loanRequest.calculateLoan') || 'Calculate Loan'}
              </Button>
              <Button
                type="submit"
                className="gradient-primary gap-2"
                size="lg"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('loanRequest.submitting') || 'Submitting...'}
                  </>
                ) : (
                  <>
                    <Banknote className="h-4 w-4" />
                    {t('loanRequest.submitRequest') || 'Submit Loan Request'}
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Disclaimer */}
          <Card className="border-amber-200/50 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="pt-8 px-6 pb-6">
              <p className="text-sm text-muted-foreground text-center">
                <strong>{t('loanRequest.importantNotice') || 'Important Notice'}:</strong> {t('loanRequest.disclaimer') || 'This is a loan request form and does not constitute a loan approval. All applications are subject to bank/financial institution approval and their terms and conditions. Interest rates and loan terms are indicative and may vary based on credit evaluation, property valuation, and lender policies.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

