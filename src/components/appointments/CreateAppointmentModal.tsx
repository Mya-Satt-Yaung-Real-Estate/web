import { useEffect } from 'react';
import { Calendar, User, Phone, Mail, DollarSign, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/forms';
import { useLanguage } from '@/contexts/LanguageContext';
import { useModal } from '@/contexts/ModalContext';
import { useCreateAppointment } from '@/hooks/mutations/useAppointmentMutations';
import { useTimeSlots, usePropertyListingTypes } from '@/hooks/queries/useAppointment';
import { useFormValidation } from '@/hooks/useFormValidation';
import { createAppointmentSchema } from '@/lib/validation';
import type { CreateAppointmentData } from '@/types/appointment';

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateAppointmentModal({ isOpen, onClose, onSuccess }: CreateAppointmentModalProps) {
  const { t, language } = useLanguage();
  const { showSuccess, showError } = useModal();
  
  // Fetch API data
  const { data: timeSlotsData, isLoading: timeSlotsLoading } = useTimeSlots();
  const { data: propertyListingTypesData, isLoading: propertyListingTypesLoading } = usePropertyListingTypes();
  
  // Mutation hook
  const createAppointmentMutation = useCreateAppointment();
  
  // Form validation
  const { form, errors } = useFormValidation(createAppointmentSchema);
  
  const isLoading = timeSlotsLoading || propertyListingTypesLoading;
  
  const timeSlots = timeSlotsData?.data || [];
  const propertyListingTypes = propertyListingTypesData?.data || [];
  
  const isAnytime = form.watch('is_anytime');
  
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        property_listing_type_id: undefined,
        prefer_time_id: undefined,
        is_anytime: false,
        date: '',
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        advance_amount: undefined,
        message: '',
      });
    }
  }, [isOpen, form]);
  
  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  
  const onSubmit = (data: any) => {
    // Prepare data for API
    const createData: CreateAppointmentData = {
      property_listing_type_id: data.property_listing_type_id,
      prefer_time_id: data.is_anytime ? undefined : data.prefer_time_id,
      is_anytime: data.is_anytime,
      date: data.date,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      contact_email: data.contact_email,
      advance_amount: data.advance_amount ? Number(data.advance_amount) : undefined,
      message: data.message || undefined,
    };

    createAppointmentMutation.mutate(createData, {
      onSuccess: () => {
        showSuccess(
          t('appointments.createSuccess') || 'Appointment created successfully!',
          t('appointments.createSuccessTitle') || 'Success!'
        );
        onClose();
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      },
      onError: (error: any) => {
        console.error('Create appointment failed:', error);
        const errorMessage = error?.response?.data?.message || error?.message || t('appointments.createError') || 'Failed to create appointment';
        showError(errorMessage, t('appointments.createErrorTitle') || 'Error');
      },
    });
  };

  const getPropertyListingTypeName = (type: { name_en: string; name_mm: string }) => {
    return language === 'mm' ? type.name_mm : type.name_en;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="2xl" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('appointments.createNew') || 'Create New Appointment'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Listing Type */}
          <FormField
            name="property_listing_type_id"
            label={t('appointments.propertyType') || 'Property Type'}
            error={errors.property_listing_type_id}
            required
          >
            <Select
              value={form.watch('property_listing_type_id')?.toString() || ''}
              onValueChange={(value) => {
                form.setValue('property_listing_type_id', Number(value));
                form.trigger('property_listing_type_id');
              }}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('appointments.propertyType') || 'Select property type'} />
              </SelectTrigger>
              <SelectContent>
                {propertyListingTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {getPropertyListingTypeName(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Date */}
          <FormField
            name="date"
            label={t('appointments.preferredDate') || 'Preferred Date'}
            error={errors.date}
            required
          >
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                min={today}
                {...form.register('date', {
                  onBlur: () => form.trigger('date')
                })}
                className="pl-10"
              />
            </div>
          </FormField>

          {/* Anytime Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_anytime"
              checked={isAnytime}
              onCheckedChange={(checked) => {
                form.setValue('is_anytime', !!checked);
                if (checked) {
                  form.setValue('prefer_time_id', undefined);
                  form.clearErrors('prefer_time_id');
                } else {
                  form.trigger('prefer_time_id');
                }
              }}
            />
            <Label
              htmlFor="is_anytime"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {t('appointments.anytime') || 'Anytime'}
            </Label>
          </div>

          {/* Preferred Time Slot */}
          {!isAnytime && (
            <FormField
              name="prefer_time_id"
              label={t('appointments.preferredTime') || 'Preferred Time'}
              error={errors.prefer_time_id}
              required
            >
              <Select
                value={form.watch('prefer_time_id')?.toString() || ''}
                onValueChange={(value) => {
                  form.setValue('prefer_time_id', Number(value));
                  form.trigger('prefer_time_id');
                }}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('appointments.preferredTime') || 'Select time slot'} />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.id} value={slot.id.toString()}>
                      {slot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('appointments.contactInfo') || 'Contact Information'}</h3>
            
            {/* Contact Name and Advance Amount Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="contact_name"
                label={t('appointments.contactName') || 'Contact Name'}
                error={errors.contact_name}
                required
              >
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...form.register('contact_name', {
                      onBlur: () => form.trigger('contact_name')
                    })}
                    placeholder={t('appointments.contactName') || 'Enter your name'}
                    className="pl-10"
                  />
                </div>
              </FormField>

              <FormField
                name="advance_amount"
                label={t('appointments.advanceAmount') || 'Advance Amount (Optional)'}
                error={errors.advance_amount}
              >
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    {...form.register('advance_amount', {
                      onBlur: () => form.trigger('advance_amount')
                    })}
                    placeholder={t('appointments.advanceAmount') || 'Enter amount (optional)'}
                    className="pl-10"
                  />
                </div>
              </FormField>
            </div>

            {/* Email and Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="contact_email"
                label={t('appointments.emailAddress') || 'Email Address'}
                error={errors.contact_email}
                required
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    {...form.register('contact_email', {
                      onBlur: () => form.trigger('contact_email')
                    })}
                    placeholder={t('appointments.emailAddress') || 'Enter your email'}
                    className="pl-10"
                  />
                </div>
              </FormField>

              <FormField
                name="contact_phone"
                label={t('appointments.phoneNumber') || 'Phone Number'}
                error={errors.contact_phone}
                required
              >
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...form.register('contact_phone', {
                      onBlur: () => form.trigger('contact_phone')
                    })}
                    placeholder={t('appointments.phoneNumber') || 'Enter your phone number'}
                    className="pl-10"
                  />
                </div>
              </FormField>
            </div>
          </div>

          {/* Message */}
          <FormField
            name="message"
            label={t('appointments.message') || 'Message (Optional)'}
            error={errors.message}
          >
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                {...form.register('message')}
                placeholder={t('appointments.message') || 'Enter your message (optional)'}
                className="pl-10 min-h-[100px]"
              />
            </div>
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={createAppointmentMutation.isPending}>
              {t('appointments.cancel') || 'Cancel'}
            </Button>
            <Button type="submit" className="gradient-primary" disabled={createAppointmentMutation.isPending}>
              {createAppointmentMutation.isPending
                ? (t('appointments.creating') || 'Creating...')
                : (t('appointments.create') || 'Create Appointment')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
