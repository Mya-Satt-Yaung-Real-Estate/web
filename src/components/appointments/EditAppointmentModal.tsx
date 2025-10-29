import { useEffect, useRef } from 'react';
import { Calendar, User, Phone, Mail, DollarSign, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/forms';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useModal } from '@/contexts/ModalContext';
import { useAppointment, useTimeSlots, usePropertyListingTypes } from '@/hooks/queries/useAppointment';
import { useUpdateAppointment } from '@/hooks/mutations/useAppointmentMutations';
import { useFormValidation } from '@/hooks/useFormValidation';
import { createAppointmentSchema } from '@/lib/validation';
import type { UpdateAppointmentData } from '@/types/appointment';

interface EditAppointmentModalProps {
  appointmentId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditAppointmentModal({ appointmentId, isOpen, onClose, onSuccess }: EditAppointmentModalProps) {
  const { t, language } = useLanguage();
  const { showSuccess, showError } = useModal();
  const formInitializedRef = useRef(false);
  
  // Fetch appointment data
  const { data: appointmentData, isLoading: appointmentLoading } = useAppointment(appointmentId || 0);
  const { data: timeSlotsData, isLoading: timeSlotsLoading } = useTimeSlots();
  const { data: propertyListingTypesData, isLoading: propertyListingTypesLoading } = usePropertyListingTypes();
  
  // Mutation hook
  const updateAppointmentMutation = useUpdateAppointment();
  
  // Form validation
  const { form, errors } = useFormValidation(createAppointmentSchema);
  
  const isLoading = appointmentLoading || timeSlotsLoading || propertyListingTypesLoading;
  const appointment = appointmentData?.data;
  const timeSlots = timeSlotsData?.data || [];
  const propertyListingTypes = propertyListingTypesData?.data || [];
  
  const isAnytime = form.watch('is_anytime');
  
  // Pre-fill form when appointment data is loaded
  useEffect(() => {
    if (appointment && propertyListingTypes.length > 0 && timeSlots.length > 0 && isOpen && !formInitializedRef.current) {
      // Set form values with a small delay to ensure components are rendered
      setTimeout(() => {
        form.setValue('property_listing_type_id', appointment.property_listing_type_id);
        form.setValue('prefer_time_id', appointment.prefer_time_id || undefined);
        form.setValue('is_anytime', appointment.is_anytime);
        form.setValue('date', appointment.date);
        form.setValue('contact_name', appointment.contact_name);
        form.setValue('contact_phone', appointment.contact_phone);
        form.setValue('contact_email', appointment.contact_email);
        form.setValue('advance_amount', appointment.advance_amount ? Number(appointment.advance_amount) : undefined);
        form.setValue('message', appointment.message || '');
        
        formInitializedRef.current = true;
      }, 100);
    }
  }, [appointment, propertyListingTypes, timeSlots, isOpen, form]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      formInitializedRef.current = false;
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
  
  const onSubmit = (data: any) => {
    if (!appointmentId) return;

    // Prepare data for API
    const updateData: UpdateAppointmentData = {
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

    updateAppointmentMutation.mutate(
      { id: appointmentId, data: updateData },
      {
        onSuccess: () => {
          showSuccess(
            t('appointments.updateSuccess') || 'Appointment updated successfully!',
            t('appointments.updateSuccessTitle') || 'Success!'
          );
          onClose();
          if (onSuccess) {
            setTimeout(() => {
              onSuccess();
            }, 1500);
          }
        },
        onError: (error: any) => {
          console.error('Update appointment failed:', error);
          const errorMessage = error?.response?.data?.message || error?.message || t('appointments.updateError') || 'Failed to update appointment';
          showError(errorMessage, t('appointments.updateErrorTitle') || 'Error');
        },
      }
    );
  };

  const getPropertyListingTypeName = (type: { name_en: string; name_mm: string }) => {
    return language === 'mm' ? type.name_mm : type.name_en;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="2xl" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('appointments.edit') || 'Edit Appointment'}</DialogTitle>
        </DialogHeader>

        {isLoading || !appointment ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
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
              <Button type="button" variant="outline" onClick={onClose} disabled={updateAppointmentMutation.isPending}>
                {t('appointments.cancel') || 'Cancel'}
              </Button>
              <Button type="submit" className="gradient-primary" disabled={updateAppointmentMutation.isPending}>
                {updateAppointmentMutation.isPending
                  ? (t('appointments.updating') || 'Updating...')
                  : (t('appointments.update') || 'Update Appointment')}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
