import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Calendar, Clock, MapPin, DollarSign, User, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useAppointments } from '@/hooks/queries/useAppointment';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AppointmentFilters } from '@/types/appointment';

export default function AppointmentList() {
  const seo = seoUtils.getPageSEO('appointments');
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<AppointmentFilters>({
    status: '' as any,
  });

  // API hooks
  const { data: appointmentsData, isLoading, error, refetch } = useAppointments({
    status: filters.status || undefined,
    page: 1,
    per_page: 12,
    sort_by: 'created_at',
    sort_direction: 'desc',
  });

  const getTimeDisplay = (appointment: any) => {
    if (appointment.is_anytime) {
      return t('appointments.anytime') || 'Anytime';
    }
    // Use prefer_time_range from API first
    if (appointment.prefer_time_range) {
      return appointment.prefer_time_range;
    }
    if (appointment.prefer_start_time && appointment.prefer_end_time) {
      const start = new Date(`2000-01-01T${appointment.prefer_start_time}`).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      const end = new Date(`2000-01-01T${appointment.prefer_end_time}`).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      return `${start} - ${end}`;
    }
    return appointment.prefer_time_name || appointment.display_time_range || t('appointments.notSpecified') || 'Not specified';
  };

  const getScheduleTimeDisplay = (appointment: any) => {
    if (appointment.schedule_start_time && appointment.schedule_end_time) {
      const start = new Date(`2000-01-01T${appointment.schedule_start_time}`).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      const end = new Date(`2000-01-01T${appointment.schedule_end_time}`).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      return `${start} - ${end}`;
    }
    return appointment.schedule_time_range || t('appointments.notSpecified') || 'Not specified';
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value === 'all' ? '' : value }));
  };

  const getPropertyTypeName = (propertyType?: { name_en: string; name_mm: string }) => {
    if (!propertyType) return t('appointments.propertyType') || 'Property Type';
    return language === 'mm' ? propertyType.name_mm : propertyType.name_en;
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'completed':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'rescheduled':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`appointments.status.${status}`) || status;
  };

  const appointments = appointmentsData?.data || [];
  
  // Client-side search filtering
  const filteredAppointments = appointments.filter(appointment => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      getPropertyTypeName(appointment.property_listing_type).toLowerCase().includes(query) ||
      appointment.contact_name.toLowerCase().includes(query) ||
      appointment.contact_email.toLowerCase().includes(query) ||
      appointment.contact_phone.includes(query) ||
      appointment.status.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <SEOHead seo={seo} path="/appointments" />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {t('appointments.title') || 'Appointments'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('appointments.subtitle') || 'Manage your property viewing appointments'}
              </p>
            </div>
            <Button 
              className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105"
              onClick={() => navigate('/appointments/create')}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('appointments.createNew') || 'Create New Appointment'}
            </Button>
          </div>

          {/* Filters */}
          <Card className="glass border-border/50 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('appointments.searchPlaceholder') || 'Search appointments...'}
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder={t('appointments.status') || 'Status'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('appointments.allStatus') || 'All Status'}</SelectItem>
                      <SelectItem value="pending">{t('appointments.status.pending') || 'Pending'}</SelectItem>
                      <SelectItem value="confirmed">{t('appointments.status.confirmed') || 'Confirmed'}</SelectItem>
                      <SelectItem value="completed">{t('appointments.status.completed') || 'Completed'}</SelectItem>
                      <SelectItem value="cancelled">{t('appointments.status.cancelled') || 'Cancelled'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="backdrop-blur-sm bg-background/95">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="backdrop-blur-sm bg-background/95">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('appointments.errorLoading') || 'Error Loading Appointments'}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('appointments.errorLoadingDesc') || 'Failed to load appointments. Please try again.'}
                </p>
                <Button onClick={() => refetch()} variant="outline">
                  {t('appointments.tryAgain') || 'Try Again'}
                </Button>
              </CardContent>
            </Card>
          ) : filteredAppointments.length === 0 ? (
            <Card className="backdrop-blur-sm bg-background/95">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">{t('appointments.noAppointments') || 'No Appointments'}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('appointments.noAppointmentsDesc') || 'You haven\'t created any appointments yet.'}
                </p>
                <Button onClick={() => navigate('/appointments/create')} className="gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('appointments.create') || 'Create Appointment'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="backdrop-blur-sm bg-background/95 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">
                            {getPropertyTypeName(appointment.property_listing_type)}
                          </CardTitle>
                          <Badge variant="outline" className={getStatusColor(appointment.status)}>
                            {getStatusLabel(appointment.status)}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {getPropertyTypeName(appointment.property_listing_type)}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-muted-foreground">{t('appointments.appointmentDetails') || 'Appointment Details'}</h4>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>
                            {t('appointments.preferredDate') || 'Preferred Date'}: {new Date(appointment.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>
                            {t('appointments.preferredTime') || 'Preferred Time'}: {getTimeDisplay(appointment)}
                          </span>
                        </div>
                        {appointment.status === 'rescheduled' && appointment.schedule_date && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 text-orange-500" />
                            <span className="text-orange-600 font-medium">
                              {t('appointments.scheduledDate') || 'Scheduled'}: {new Date(appointment.schedule_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {appointment.status === 'rescheduled' && (appointment.schedule_start_time || appointment.schedule_time_range) && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span className="text-orange-600 font-medium">
                              {t('appointments.scheduledTime') || 'Scheduled Time'}: {getScheduleTimeDisplay(appointment)}
                            </span>
                          </div>
                        )}
                        {appointment.advance_amount && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span>
                              {t('appointments.advanceAmount') || 'Advance Amount'}: {appointment.advance_amount} MMK
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-muted-foreground">{t('appointments.contactInfo') || 'Contact Information'}</h4>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4 text-primary" />
                          <span>{appointment.contact_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4 text-primary" />
                          <span>{appointment.contact_phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4 text-primary" />
                          <span>{appointment.contact_email}</span>
                        </div>
                      </div>
                    </div>
                    {appointment.message && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-muted-foreground mb-2">{t('appointments.message') || 'Message'}</h4>
                        <p className="text-muted-foreground">{appointment.message}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}