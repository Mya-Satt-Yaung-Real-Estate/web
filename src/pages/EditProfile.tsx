import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, User, Building, MapPin, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import { useProfile } from '@/hooks/queries/useAuth';
import { authKeys } from '@/services/queries/auth';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { useCompanyTypes } from '@/hooks/queries/useCompanyTypes';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import { useUpdateProfile } from '@/hooks/mutations/useUpdateProfile';
import { companyProfileSchema, individualProfileSchema } from '@/lib/validation/profile';
import type { CompanyProfileFormData, IndividualProfileFormData } from '@/lib/validation/profile';

export function EditProfile() {
  const { isAuthenticated } = useAuthStore();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const seo = seoUtils.getPageSEO('editProfile');
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const hasTriggeredRefetchRef = useRef(false);
  const hasRefetchedLookupsRef = useRef(false);
  
  // Invalidate only profile (it will refetch naturally)
  // For company types, regions, and townships - we'll refetch them explicitly once
  // This prevents multiple calls from different components using the same hooks
  if (!hasTriggeredRefetchRef.current) {
    queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    hasTriggeredRefetchRef.current = true;
  }
  
  // Fetch fresh profile data (will refetch because we invalidated above)
  const { data: profileData, isLoading: isLoadingProfile, error: profileError } = useProfile();
  // Extract user data from API response structure
  // The API returns { success, message, data: { user_data } }
  // authApi.getProfile() returns response.data which is the wrapper
  // So we need to extract the actual user data from profileData.data
  const user = profileData && typeof profileData === 'object' && 'data' in profileData 
    ? (profileData as any).data 
    : profileData;

  // Lookups - get refetch functions for explicit refetch
  const { data: regionsResp, isLoading: isLoadingRegions, refetch: refetchRegions } = useRegions();
  const { data: townshipsResp, isLoading: isLoadingTownships, refetch: refetchTownships } = useTownships();
  const { data: companyTypesResp, isLoading: isLoadingCompanyTypes, refetch: refetchCompanyTypes } = useCompanyTypes();
  const regions = regionsResp?.data || [];
  const townships = townshipsResp?.data || [];
  const companyTypes = companyTypesResp?.data?.data || [];

  // Determine user type from loaded profile data
  const isCompany = user?.user_type === 'company';
  const schema = isCompany ? companyProfileSchema : individualProfileSchema;

  const form = useForm<CompanyProfileFormData | IndividualProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const [mediaId, setMediaId] = useState<number | null>(null);
  const [coverMediaId, setCoverMediaId] = useState<number | null>(null);
  const [coverChanged, setCoverChanged] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [isCoverMediaLoading, setIsCoverMediaLoading] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const watchedRegionId = form.watch('region_id' as any);
  // Get township_id from form to ensure it's available even if region isn't watched yet
  const watchedTownshipId = form.watch('township_id' as any);
  const availableTownships = watchedRegionId ? townships.filter((ts: any) => Number(ts.region_id) === Number(watchedRegionId)) : [];
  
  // If we have a township_id but no region_id yet, include that township in availableTownships
  // This ensures the township can be selected even if region hasn't been set yet
  const townshipToInclude = watchedTownshipId && !watchedRegionId 
    ? townships.find((ts: any) => Number(ts.id) === Number(watchedTownshipId))
    : null;
  const finalAvailableTownships = townshipToInclude && !availableTownships.find((t: any) => Number(t.id) === Number(townshipToInclude.id))
    ? [...availableTownships, townshipToInclude]
    : availableTownships;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  // Explicitly refetch company types, regions, and townships ONCE
  // This ensures each API is called exactly once, preventing multiple calls
  useEffect(() => {
    if (!hasRefetchedLookupsRef.current && refetchRegions && refetchTownships && refetchCompanyTypes) {
      hasRefetchedLookupsRef.current = true;
      refetchCompanyTypes();
      refetchRegions();
      refetchTownships();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Initialize form with user data when profile and lookup data are loaded
  useEffect(() => {
    // Wait for all data to be loaded: user profile, regions, townships, company types
    const isProfileReady = user && !isLoadingProfile;
    const isRegionsReady = !isLoadingRegions && regions.length > 0;
    const isTownshipsReady = !isLoadingTownships && townships.length > 0;
    const isCompanyTypesReady = !user?.user_type || user.user_type !== 'company' || (!isLoadingCompanyTypes && companyTypes.length > 0);
    
    if (isProfileReady && isRegionsReady && isTownshipsReady && isCompanyTypesReady && !isFormInitialized) {
      const currentIsCompany = user.user_type === 'company';
      const formData: any = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        media_id: null,
      };

      if (currentIsCompany) {
        formData.company_name = user.personal_information?.company_name || '';
        // Ensure values are numbers for proper Select component matching
        formData.company_type_id = user.company_type_id ? Number(user.company_type_id) : undefined;
        formData.address = user.personal_information?.business_address || '';
        formData.region_id = user.region_id ? Number(user.region_id) : undefined;
        formData.township_id = user.township_id ? Number(user.township_id) : undefined;
        formData.description = user.personal_information?.description || '';
      }

      // Reset form with all data
      form.reset(formData);
      
      // Use setTimeout to ensure Select components have rendered with options before setting values
      // This ensures the Select values are properly matched with available options
      // Set region first, then township after region is set (so availableTownships is populated)
      setTimeout(() => {
        if (currentIsCompany) {
          // Explicitly set Select values after options are rendered
          if (formData.company_type_id) {
            form.setValue('company_type_id' as any, formData.company_type_id, { shouldValidate: false, shouldDirty: false });
          }
          // Set region first
          if (formData.region_id) {
            form.setValue('region_id' as any, formData.region_id, { shouldValidate: false, shouldDirty: false });
          }
        }
        // Trigger validation to update form state
        form.trigger();
      }, 100);
      
      // Set township after region is set and availableTownships is populated
      if (currentIsCompany && formData.region_id && formData.township_id) {
        setTimeout(() => {
          form.setValue('township_id' as any, formData.township_id, { shouldValidate: false, shouldDirty: false });
          form.trigger('township_id');
        }, 200); // Wait a bit longer for region to be set and availableTownships to update
      }

      setIsFormInitialized(true);

      // Set initial media ID if profile image exists
      if (user.profile_image_url) {
        // We need to get the media ID from the URL or store it separately
        // For now, we'll set it to null and let user re-upload if needed
        setMediaId(null);
      }
    }
  }, [user, form, isLoadingProfile, isLoadingRegions, isLoadingTownships, isLoadingCompanyTypes, isFormInitialized, regions.length, townships.length, companyTypes.length]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoadingProfile) {
    return (
      <>
        <SEOHead seo={seo} path="/profile/edit" />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (profileError || !user) {
    return (
      <>
        <SEOHead seo={seo} path="/profile/edit" />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p className="text-destructive">{t('common.error') || 'Error loading profile'}</p>
              <Button onClick={() => navigate('/profile')} className="mt-4">
                {t('common.back') || 'Back'}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const onSubmit = (data: CompanyProfileFormData | IndividualProfileFormData) => {
    const payload: any = {
      name: data.name,
      email: data.email && data.email.trim() !== '' ? data.email : null,
      phone: data.phone,
      ...(mediaId && { media_id: mediaId }),
      ...(coverChanged && { cover_media_id: coverMediaId }),
    };

    if (user?.user_type === 'company') {
      const companyData = data as CompanyProfileFormData;
      payload.company_name = companyData.company_name;
      payload.company_type_id = companyData.company_type_id;
      payload.address = companyData.address;
      payload.region_id = companyData.region_id;
      payload.township_id = companyData.township_id;
      payload.description = companyData.description || '';
    }

    updateProfile(payload, {
      onSuccess: () => {
        navigate('/profile');
      },
    });
  };

  return (
    <>
      <SEOHead seo={seo} path="/profile/edit" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {t('editProfile.title')}
              </h1>
              <p className="text-muted-foreground mt-2">{t('editProfile.subtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/profile')} className="hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back') || 'Back'}
              </Button>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col sm:flex-row flex-wrap items-start gap-6">
              {/* Profile Image */}
              <Card className="backdrop-blur-sm bg-background/95 shadow-sm w-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" />
                    {t('editProfile.profileImage') || 'Profile Image'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ProfileImageUpload
                    variant="profile"
                    onUploadComplete={(id) => setMediaId(id || null)}
                    onUploadError={(error) => console.error('Upload error:', error)}
                    onLoadingChange={setIsMediaLoading}
                    initialImage={user.profile_image_url ? {
                      id: 0,
                      url: user.profile_image_url,
                    } : undefined}
                    disabled={isUpdating}
                  />
                </CardContent>
              </Card>

              {/* Cover Image */}
              <Card className="backdrop-blur-sm bg-background/95 shadow-sm w-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    {t('editProfile.coverImage') || 'Cover Image'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ProfileImageUpload
                    variant="cover"
                    onUploadComplete={(id) => {
                      setCoverMediaId(id);
                      setCoverChanged(true);
                    }}
                    onUploadError={(error) => console.error('Cover upload error:', error)}
                    onLoadingChange={setIsCoverMediaLoading}
                    initialImage={user.cover_image_url ? {
                      id: 0,
                      url: user.cover_image_url,
                    } : undefined}
                    disabled={isUpdating}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Basic Information */}
            <Card className="backdrop-blur-sm bg-background/95 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  {t('editProfile.basicInformation') || 'Basic Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">
                    {t('editProfile.name') || 'Name'} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder={t('editProfile.namePlaceholder') || 'Enter your name'}
                    disabled={isUpdating}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">
                      {t('editProfile.phone') || 'Phone'} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      {...form.register('phone')}
                      placeholder={t('editProfile.phonePlaceholder') || 'Enter your phone number'}
                      disabled={true}
                      readOnly
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-destructive mt-1">{form.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      {t('editProfile.email') || 'Email'}
                      <span className="text-gray-400 text-xs">({t('common.optional') || 'Optional'})</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      placeholder={t('editProfile.emailPlaceholder') || 'Enter your email'}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            {user?.user_type === 'company' && (
              <>
                <Card className="backdrop-blur-sm bg-background/95 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building className="h-5 w-5 text-primary" />
                      {t('editProfile.companyInformation') || 'Company Information'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="company_name">
                        {t('editProfile.companyName') || 'Company Name'} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="company_name"
                        {...form.register('company_name')}
                        placeholder={t('editProfile.companyNamePlaceholder') || 'Enter company name'}
                        disabled={isUpdating}
                      />
                      {'company_name' in form.formState.errors && form.formState.errors.company_name && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.company_name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="company_type_id">
                        {t('editProfile.companyType') || 'Company Type'} <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={form.watch('company_type_id' as any) ? String(form.watch('company_type_id' as any)) : ''}
                        onValueChange={(value) => form.setValue('company_type_id' as any, Number(value))}
                        disabled={isUpdating}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('editProfile.selectCompanyType') || 'Select company type'} />
                        </SelectTrigger>
                        <SelectContent>
                          {companyTypes.map((type: any) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {language === 'mm' ? type.name_mm : type.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {'company_type_id' in form.formState.errors && form.formState.errors.company_type_id && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.company_type_id.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">
                        {t('editProfile.description') || 'About company'}
                      </Label>
                      <Textarea
                        id="description"
                        {...form.register('description')}
                        placeholder={t('editProfile.descriptionPlaceholder') || 'Enter company description'}
                        rows={5}
                        disabled={isUpdating}
                      />
                      {'description' in form.formState.errors && form.formState.errors.description && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Location */}
                <Card className="backdrop-blur-sm bg-background/95 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                      {t('editProfile.location') || 'Location'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="region_id">
                          {t('editProfile.region') || 'Region'} <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={form.watch('region_id' as any) ? String(form.watch('region_id' as any)) : ''}
                          onValueChange={(value) => {
                            form.setValue('region_id' as any, Number(value));
                            form.setValue('township_id' as any, undefined);
                          }}
                          disabled={isUpdating}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('editProfile.selectRegion') || 'Select region'} />
                          </SelectTrigger>
                          <SelectContent>
                            {regions.map((region: any) => (
                              <SelectItem key={region.id} value={region.id.toString()}>
                                {language === 'mm' ? region.name_mm : region.name_en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {'region_id' in form.formState.errors && form.formState.errors.region_id && (
                          <p className="text-sm text-destructive mt-1">{form.formState.errors.region_id.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="township_id">
                          {t('editProfile.township') || 'Township'} <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={form.watch('township_id' as any) ? String(form.watch('township_id' as any)) : ''}
                          onValueChange={(value) => form.setValue('township_id' as any, Number(value))}
                          disabled={isUpdating || !watchedRegionId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('editProfile.selectTownship') || 'Select township'} />
                          </SelectTrigger>
                          <SelectContent>
                            {finalAvailableTownships.map((township: any) => (
                              <SelectItem key={township.id} value={township.id.toString()}>
                                {language === 'mm' ? township.name_mm : township.name_en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {'township_id' in form.formState.errors && form.formState.errors.township_id && (
                          <p className="text-sm text-destructive mt-1">{form.formState.errors.township_id.message}</p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <Label htmlFor="address">
                          {t('editProfile.address') || 'Address'} <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="address"
                          {...form.register('address')}
                          placeholder={t('editProfile.addressPlaceholder') || 'Enter business address'}
                          rows={3}
                          disabled={isUpdating}
                        />
                        {'address' in form.formState.errors && form.formState.errors.address && (
                          <p className="text-sm text-destructive mt-1">{form.formState.errors.address.message}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/profile')}
                disabled={isUpdating}
              >
                {t('common.cancel') || 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={isUpdating || isMediaLoading || isCoverMediaLoading}
                className="gradient-primary"
              >
                {isUpdating ? (
                  <>
                    <span className="mr-2">{t('common.saving') || 'Saving...'}</span>
                  </>
                ) : (
                  t('common.save') || 'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

