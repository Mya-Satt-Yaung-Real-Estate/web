import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, CheckCircle2, FileText, Home, Image, MapPin, Plus, Sparkles, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useFormValidation } from '@/hooks/useFormValidation';
import { projectFormSchema, type ProjectFormValues } from '@/lib/validation/project';
import { FormField } from '@/components/forms';
import { MediaUpload } from '@/components/MediaUpload';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { usePropertyTypes } from '@/hooks/queries/usePropertyTypes';
import { useModal } from '@/contexts/ModalContext';
import { useCreateMyProject, useUpdateMyProject } from '@/hooks/mutations/useProjectMutations';
import { pointSettingsApi, type PointSettings } from '@/services/api/pointSettings';
import type { Project, ProjectFormPayload, ProjectPaymentPlan, ProjectPublishStatus, ProjectUnitType } from '@/types/projects';

type ProjectFormMode = 'create' | 'edit';

interface ProjectFormPageProps {
  mode: ProjectFormMode;
  project?: Project;
  projectId?: string;
  isLoading?: boolean;
}

const emptyUnitType: ProjectUnitType = {
  name: '',
  area: '',
  price_range: '',
  description: '',
  units: '',
};

const emptyPaymentPlan: ProjectPaymentPlan = {
  name: '',
  description: '',
};

const cleanString = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

type ProjectPointChargeType = 'upload' | 'upgrade' | null;

const resolvePointChargeType = (
  currentPublishStatus: ProjectPublishStatus | null,
  newPublishStatus: ProjectPublishStatus,
): ProjectPointChargeType => {
  if (newPublishStatus !== 'published') {
    return null;
  }

  if (!currentPublishStatus || currentPublishStatus !== 'published') {
    return 'upload';
  }

  return 'upgrade';
};

export function ProjectFormPage({ mode, project, projectId, isLoading = false }: ProjectFormPageProps) {
  const navigate = useNavigate();
  const seo = seoUtils.getPageSEO(mode === 'create' ? 'createProject' : 'editProject');
  const { showSuccess, showError } = useModal();
  const { form, errors } = useFormValidation<ProjectFormValues>(projectFormSchema);
  const createProject = useCreateMyProject();
  const updateProject = useUpdateMyProject();

  const { data: regionsResp } = useRegions();
  const { data: townshipsResp } = useTownships();
  const { data: propertyTypesResp } = usePropertyTypes();
  const regions = regionsResp?.data || [];
  const townships = townshipsResp?.data || [];
  const propertyTypes = propertyTypesResp?.data || [];

  const [mediaIds, setMediaIds] = useState<number[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [unitTypes, setUnitTypes] = useState<ProjectUnitType[]>([{ ...emptyUnitType }]);
  const [paymentPlans, setPaymentPlans] = useState<ProjectPaymentPlan[]>([{ ...emptyPaymentPlan }]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pointSettings, setPointSettings] = useState<PointSettings | null>(null);
  const [loadingPointSettings, setLoadingPointSettings] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<ProjectFormPayload | null>(null);
  const [pendingChargeType, setPendingChargeType] = useState<ProjectPointChargeType>(null);
  const [originalPublishStatus, setOriginalPublishStatus] = useState<ProjectPublishStatus>('draft');

  const selectedRegionId = form.watch('region_id');
  const selectedCurrency = form.watch('currency') || 'MMK';
  const features = form.watch('features') || [];

  const filteredTownships = useMemo(() => {
    if (!selectedRegionId) {
      return townships;
    }

    return townships.filter((township: any) => Number(township.region_id) === Number(selectedRegionId));
  }, [selectedRegionId, townships]);

  const initialMediaFiles = useMemo(() => {
    const images = project?.media?.images || [];

    return images.map((image) => ({
      id: image.id,
      url: image.url,
      filename: image.filename || 'project-image',
      type: 'image' as const,
      size: 0,
    }));
  }, [project]);

  useEffect(() => {
    form.setValue('condition', 'upcoming');
    form.setValue('publish_status', 'draft');
    form.setValue('currency', 'MMK');
    form.setValue('features', []);
    form.setValue('media_ids', []);
  }, []);

  useEffect(() => {
    if (!project || mode !== 'edit') {
      return;
    }

    form.setValue('title_en', project.title_en || '');
    form.setValue('title_mm', project.title_mm || '');
    if (project.property_type?.id) {
      form.setValue('property_type_id', project.property_type.id);
    } else {
      form.resetField('property_type_id');
    }
    if (project.location?.region?.id) {
      form.setValue('region_id', project.location.region.id);
    } else {
      form.resetField('region_id');
    }
    if (project.location?.township?.id) {
      form.setValue('township_id', project.location.township.id);
    } else {
      form.resetField('township_id');
    }
    form.setValue('address', project.location?.address || '');
    form.setValue('total_units', project.total_units || '');
    form.setValue('completion_text', project.completion_text || '');
    form.setValue('condition', project.condition || 'upcoming');
    form.setValue('publish_status', project.publish_status || 'draft');
    setOriginalPublishStatus(project.publish_status || 'draft');
    if (project.price?.min !== null && project.price?.min !== undefined) {
      form.setValue('price_min', Number(project.price.min));
    } else {
      form.resetField('price_min');
    }
    if (project.price?.max !== null && project.price?.max !== undefined) {
      form.setValue('price_max', Number(project.price.max));
    } else {
      form.resetField('price_max');
    }
    form.setValue('currency', project.price?.currency || 'MMK');
    form.setValue('description_en', project.description_en || '');
    form.setValue('description_mm', project.description_mm || '');
    form.setValue('features', project.features || []);
    form.setValue('contact_name', project.contact_info?.name || '');
    form.setValue('contact_phone', project.contact_info?.phone || '');
    form.setValue('contact_email', project.contact_info?.email || '');
    const projectMediaIds = project.media?.images?.map((image) => image.id) || [];
    setMediaIds(projectMediaIds);
    form.setValue('media_ids', projectMediaIds);
    setUnitTypes(project.unit_types?.length ? project.unit_types : [{ ...emptyUnitType }]);
    setPaymentPlans(project.payment_plans?.length ? project.payment_plans : [{ ...emptyPaymentPlan }]);
  }, [project, mode]);

  useEffect(() => {
    form.setValue('media_ids', mediaIds, { shouldValidate: true });
  }, [mediaIds]);

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed || features.includes(trimmed)) {
      setFeatureInput('');
      return;
    }

    form.setValue('features', [...features, trimmed]);
    setFeatureInput('');
  };

  const removeFeature = (feature: string) => {
    form.setValue('features', features.filter((item) => item !== feature));
  };

  const updateUnitType = (index: number, field: keyof ProjectUnitType, value: string) => {
    setUnitTypes((current) => current.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    )));
  };

  const updatePaymentPlan = (index: number, field: keyof ProjectPaymentPlan, value: string) => {
    setPaymentPlans((current) => current.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    )));
  };

  const buildPayload = (values: ProjectFormValues): ProjectFormPayload => {
    const cleanedUnitTypes = unitTypes
      .filter((unitType) => unitType.name.trim())
      .map((unitType) => ({
        name: unitType.name.trim(),
        area: cleanString(unitType.area),
        price_range: cleanString(unitType.price_range),
        description: cleanString(unitType.description),
        units: cleanString(unitType.units),
      }));

    const cleanedPaymentPlans = paymentPlans
      .filter((paymentPlan) => paymentPlan.name.trim())
      .map((paymentPlan) => ({
        name: paymentPlan.name.trim(),
        description: cleanString(paymentPlan.description),
      }));

    return {
      title_en: values.title_en,
      title_mm: cleanString(values.title_mm),
      property_type_id: values.property_type_id,
      region_id: values.region_id,
      township_id: values.township_id,
      address: cleanString(values.address),
      total_units: cleanString(values.total_units),
      completion_text: cleanString(values.completion_text),
      condition: values.condition,
      publish_status: values.publish_status,
      price_min: values.price_min,
      price_max: values.price_max,
      currency: values.currency,
      description_en: cleanString(values.description_en),
      description_mm: cleanString(values.description_mm),
      features,
      contact_name: cleanString(values.contact_name),
      contact_phone: cleanString(values.contact_phone),
      contact_email: cleanString(values.contact_email),
      media_ids: mediaIds,
      unit_types: cleanedUnitTypes,
      payment_plans: cleanedPaymentPlans,
    };
  };

  const submitProject = async (payload: ProjectFormPayload) => {
    try {
      if (mode === 'create') {
        await createProject.mutateAsync(payload);
        showSuccess('Project created successfully!', 'Success!');
        navigate('/my-projects');
      } else if (projectId) {
        await updateProject.mutateAsync({ id: projectId, data: payload });
        showSuccess('Project updated successfully!', 'Success!');
        navigate('/my-projects');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to save project.';
      showError(message, 'Error');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }

    const values = form.getValues();
    const payload = buildPayload(values);
    const currentStatus = mode === 'edit' ? originalPublishStatus : null;
    const chargeType = resolvePointChargeType(currentStatus, values.publish_status);

    if (!chargeType) {
      await submitProject(payload);
      return;
    }

    setPendingPayload(payload);
    setPendingChargeType(chargeType);
    setLoadingPointSettings(true);

    try {
      const response = await pointSettingsApi.getPointSettings();
      setPointSettings(response.data?.data || null);
    } catch (error) {
      console.error('Failed to fetch point settings:', error);
      showError('Failed to load point information. Please try again.', 'Error');
      setLoadingPointSettings(false);
      return;
    }

    setLoadingPointSettings(false);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    if (!pendingPayload) {
      return;
    }

    setShowConfirmDialog(false);
    await submitProject(pendingPayload);
    setPendingPayload(null);
    setPendingChargeType(null);
    setPointSettings(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const saving = createProject.isPending || updateProject.isPending;

  return (
    <>
      <SEOHead seo={seo} path={mode === 'create' ? '/my-projects/create' : `/my-projects/edit/${projectId || ''}`} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {mode === 'create' ? 'Create Project' : 'Edit Project'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {mode === 'create' ? 'Create an upcoming project listing' : 'Update your project listing'}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Home className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="title_en" label="Project Title (English)" error={errors.title_en} required>
                    <Input id="title_en" {...form.register('title_en')} placeholder="e.g., Emerald Residence" />
                  </FormField>
                  <FormField name="title_mm" label="Project Title (Myanmar)" error={errors.title_mm} required>
                    <Input id="title_mm" {...form.register('title_mm')} placeholder="မြန်မာ ခေါင်းစဉ်" />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="property_type_id" label="Property Type" error={errors.property_type_id} required>
                    <Select
                      value={form.watch('property_type_id') ? String(form.watch('property_type_id')) : undefined}
                      onValueChange={(value) => form.setValue('property_type_id', Number(value), { shouldValidate: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type: any) => (
                          <SelectItem key={type.id} value={String(type.id)}>
                            {type.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField name="condition" label="Condition" error={errors.condition} required>
                    <Select
                      value={form.watch('condition') || 'upcoming'}
                      onValueChange={(value) => form.setValue('condition', value as ProjectFormValues['condition'])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="under_construction">Under Construction</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="total_units" label="Total Units" error={errors.total_units} required>
                    <Input id="total_units" {...form.register('total_units')} placeholder="e.g., 120 units" />
                  </FormField>
                  <FormField name="completion_text" label="Completion" error={errors.completion_text} required>
                    <Input id="completion_text" {...form.register('completion_text')} placeholder="e.g., Q4 2026" />
                  </FormField>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="region_id" label="Region" error={errors.region_id} required>
                    <Select
                      value={form.watch('region_id') ? String(form.watch('region_id')) : undefined}
                      onValueChange={(value) => {
                        form.setValue('region_id', Number(value), { shouldValidate: true });
                        form.resetField('township_id');
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region: any) => (
                          <SelectItem key={region.id} value={String(region.id)}>
                            {region.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField name="township_id" label="Township" error={errors.township_id} required>
                    <Select
                      value={form.watch('township_id') ? String(form.watch('township_id')) : undefined}
                      onValueChange={(value) => form.setValue('township_id', Number(value), { shouldValidate: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select township" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredTownships.map((township: any) => (
                          <SelectItem key={township.id} value={String(township.id)}>
                            {township.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <FormField name="address" label="Address" error={errors.address} required>
                  <Textarea id="address" {...form.register('address')} placeholder="Project address" rows={3} />
                </FormField>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-primary" />
                  Price & Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField name="currency" label="Currency" error={errors.currency} required>
                    <Select
                      value={selectedCurrency}
                      onValueChange={(value) => form.setValue('currency', value as ProjectFormValues['currency'])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MMK">MMK (Lakhs)</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="THB">THB</SelectItem>
                        <SelectItem value="CNY">CNY</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField name="price_min" label="Minimum Price" error={errors.price_min} required>
                    <Input id="price_min" type="number" {...form.register('price_min')} placeholder="Minimum price" />
                  </FormField>
                  <FormField name="price_max" label="Maximum Price" error={errors.price_max} required>
                    <Input id="price_max" type="number" {...form.register('price_max')} placeholder="Maximum price" />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="description_en" label="Description (English)" error={errors.description_en} required>
                    <Textarea id="description_en" {...form.register('description_en')} rows={5} placeholder="Project description" />
                  </FormField>
                  <FormField name="description_mm" label="Description (Myanmar)" error={errors.description_mm} required>
                    <Textarea id="description_mm" {...form.register('description_mm')} rows={5} placeholder="မြန်မာ ဖော်ပြချက်" />
                  </FormField>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Image className="h-5 w-5 text-primary" />
                  Project Images <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <MediaUpload
                  maxFiles={8}
                  acceptedTypes={['image/*']}
                  initialFiles={initialMediaFiles}
                  onUploadComplete={setMediaIds}
                  onUploadError={(message) => showError(message, 'Upload Error')}
                  onLoadingChange={setIsMediaLoading}
                />
                {errors.media_ids && (
                  <p className="text-sm text-red-500">{errors.media_ids.message}</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={featureInput}
                    onChange={(event) => setFeatureInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addFeature();
                      }
                    }}
                    placeholder="Add feature, e.g., Swimming Pool"
                  />
                  <Button type="button" variant="outline" onClick={addFeature}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <span key={feature} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                        {feature}
                        <button type="button" onClick={() => removeFeature(feature)}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Unit Types <span className="text-muted-foreground">(Optional)</span>
                </CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => setUnitTypes([...unitTypes, { ...emptyUnitType }])}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Unit Type
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {unitTypes.map((unitType, index) => (
                  <div key={index} className="rounded-xl border border-border/50 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Unit Type {index + 1}</h4>
                      {unitTypes.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => setUnitTypes(unitTypes.filter((_, itemIndex) => itemIndex !== index))}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input value={unitType.name} onChange={(event) => updateUnitType(index, 'name', event.target.value)} placeholder="Name" />
                      <Input value={unitType.area || ''} onChange={(event) => updateUnitType(index, 'area', event.target.value)} placeholder="Area (Sqft)" />
                      <Input value={unitType.price_range || ''} onChange={(event) => updateUnitType(index, 'price_range', event.target.value)} placeholder="Price range" />
                      <Input value={unitType.units || ''} onChange={(event) => updateUnitType(index, 'units', event.target.value)} placeholder="Units" />
                    </div>
                    <Textarea value={unitType.description || ''} onChange={(event) => updateUnitType(index, 'description', event.target.value)} placeholder="Description" rows={3} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Payment Plans <span className="text-muted-foreground">(Optional)</span>
                </CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => setPaymentPlans([...paymentPlans, { ...emptyPaymentPlan }])}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Plan
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentPlans.map((paymentPlan, index) => (
                  <div key={index} className="rounded-xl border border-border/50 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Payment Plan {index + 1}</h4>
                      {paymentPlans.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => setPaymentPlans(paymentPlans.filter((_, itemIndex) => itemIndex !== index))}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Input value={paymentPlan.name} onChange={(event) => updatePaymentPlan(index, 'name', event.target.value)} placeholder="Name" />
                    <Textarea value={paymentPlan.description || ''} onChange={(event) => updatePaymentPlan(index, 'description', event.target.value)} placeholder="Description" rows={3} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Contact & Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField name="contact_name" label="Contact Name" error={errors.contact_name}>
                    <Input id="contact_name" {...form.register('contact_name')} placeholder="Sales Team" />
                  </FormField>
                  <FormField name="contact_phone" label="Contact Phone" error={errors.contact_phone}>
                    <Input id="contact_phone" {...form.register('contact_phone')} placeholder="09123456789" />
                  </FormField>
                  <FormField name="contact_email" label="Contact Email" error={errors.contact_email}>
                    <Input id="contact_email" type="email" {...form.register('contact_email')} placeholder="sales@example.com" />
                  </FormField>
                </div>

              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Publishing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField name="publish_status" label="Publish Status" error={errors.publish_status} required>
                  <Select
                    value={form.watch('publish_status') || 'draft'}
                    onValueChange={(value) => form.setValue('publish_status', value as ProjectFormValues['publish_status'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="unpublished">Unpublished</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={saving || isMediaLoading}>
                Cancel
              </Button>
              <Button type="submit" className="gradient-primary shadow-lg shadow-primary/30" disabled={saving || isMediaLoading}>
                {saving ? 'Saving...' : mode === 'create' ? 'Create Project' : 'Update Project'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Dialog
        open={showConfirmDialog}
        onOpenChange={(open) => {
          setShowConfirmDialog(open);
          if (!open) {
            setPointSettings(null);
            setPendingPayload(null);
            setPendingChargeType(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-left">
                  {pendingChargeType === 'upload' ? 'Confirm Publishing Project' : 'Confirm Project Update'}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  {pendingChargeType === 'upload'
                    ? 'Publishing this project will deduct points from your balance.'
                    : 'Updating this published project will deduct points from your balance.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {loadingPointSettings ? (
            <div className="py-10 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-primary border-t-transparent" />
              <p className="mt-4 text-sm text-muted-foreground">Loading point information...</p>
            </div>
          ) : pointSettings ? (
            <div className="py-4">
              <div className="overflow-hidden border border-border rounded-lg">
                <table className="w-full border-collapse">
                  <tbody className="divide-y divide-border">
                    {pendingChargeType === 'upload' && (
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium">Upload Fee</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold">
                          {pointSettings.upload_project_info?.point_amount || 0} Points
                        </td>
                      </tr>
                    )}
                    {pendingChargeType === 'upgrade' && (
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium">Update Fee</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold">
                          {pointSettings.update_project_info?.point_amount || 0} Points
                        </td>
                      </tr>
                    )}
                    <tr className="bg-muted/30">
                      <td className="px-4 py-3 text-sm font-semibold">Total</td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-primary">
                        {pendingChargeType === 'upload'
                          ? (pointSettings.upload_project_info?.point_amount || 0)
                          : (pointSettings.update_project_info?.point_amount || 0)}{' '}
                        Points
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Draft projects are free. Published projects do not expire.
              </p>
            </div>
          ) : null}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="gradient-primary"
              onClick={handleConfirmSubmit}
              disabled={loadingPointSettings || saving || !pointSettings}
            >
              {saving ? 'Saving...' : 'Confirm & Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
