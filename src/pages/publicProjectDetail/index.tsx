import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CalendarCheck,
  Home,
  MapPin,
  Phone,
  Share2,
  Sparkles,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { ShareModal } from '@/components/ui/ShareModal';
import { ProjectGallery } from '@/pages/publicProjectDetail/components/ProjectGallery';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProject } from '@/hooks/queries/useProjects';
import type { Project, ProjectCondition, ProjectPaymentPlan, ProjectUnitType } from '@/types/projects';

const projectCardClass = 'rounded-2xl border-primary/10 shadow-lg';

const projectOutlineButtonClass =
  'w-full border-primary/20 bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary';

const projectTabTriggerClass =
  'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm';

const getConditionColor = (condition: ProjectCondition) => {
  if (condition === 'ongoing') {
    return 'border-emerald-500 bg-emerald-500 text-white';
  }

  if (condition === 'upcoming') {
    return 'border-blue-500 bg-blue-500 text-white';
  }

  if (condition === 'under_construction') {
    return 'border-amber-500 bg-amber-500 text-amber-950';
  }

  return 'border-primary bg-primary text-white';
};

function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20 sm:pt-24 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-5">
            <Card className="overflow-hidden">
              <Skeleton className="h-[420px] w-full" />
              <div className="grid grid-cols-5 gap-3 p-4">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-16 rounded-lg" />
                ))}
              </div>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-px w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="text-right font-semibold text-foreground">{value}</div>
    </div>
  );
}

function ProjectSummaryCard({
  project,
  title,
  location,
  propertyType,
  conditionLabel,
  shareUrl,
  onScheduleVisit,
}: {
  project: Project;
  title: string;
  location: string;
  propertyType: string;
  conditionLabel: string;
  shareUrl: string;
  onScheduleVisit: () => void;
}) {
  const { t } = useLanguage();
  const developerName = project.developer?.name || t('projects.developerNotSpecified') || 'Developer not specified';
  const companySlug = project.developer?.user_type === 'company' ? project.developer.company_slug : null;
  const contactPhone = project.contact_info?.phone;

  return (
    <Card className={`h-fit w-full self-start lg:sticky lg:top-24 ${projectCardClass}`}>
      <CardContent className="p-4 sm:p-5">
        <Badge
          variant="outline"
          className={`mb-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${getConditionColor(project.condition)}`}
        >
          {conditionLabel}
        </Badge>

        <h1 className="mb-2 text-lg font-semibold leading-snug text-foreground">{title}</h1>

        <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary sm:h-4 sm:w-4" />
          <span>{location || t('projects.locationNotSpecified') || 'Location not specified'}</span>
        </div>

        <div className="mb-3 border-t border-border" />

        <div className="space-y-2.5">
          <DetailRow
            label={t('projects.developer') || 'Developer'}
            value={companySlug ? (
              <Link to={`/companies/${companySlug}`} className="hover:text-primary hover:underline">
                {developerName}
              </Link>
            ) : developerName}
          />
          <DetailRow label={t('projects.type') || 'Type'} value={propertyType || '-'} />
          <DetailRow label={t('projects.completion') || 'Completion'} value={project.completion_text || '-'} />
          <DetailRow label={t('projects.totalUnits') || 'Total Units'} value={project.total_units || '-'} />
        </div>

        <div className="my-3 border-t border-border" />

        <p className="mb-1 text-xs text-muted-foreground sm:text-sm">{t('projects.priceRange') || 'Price Range'}</p>
        <p className="mb-4 text-xl font-bold text-primary">{project.price?.range || t('projects.priceNotSpecified') || 'Price not specified'}</p>

        <div className="space-y-3.5">
          <Button
            asChild={!!contactPhone}
            disabled={!contactPhone}
            size="sm"
            className="h-9 w-full bg-primary hover:bg-primary/90"
          >
            {contactPhone ? (
              <a href={`tel:${contactPhone}`}>
                <Phone className="mr-2 h-3.5 w-3.5" />
                {t('projects.contact') || 'Contact'}
              </a>
            ) : (
              <span>
                <Phone className="mr-2 h-3.5 w-3.5" />
                {t('projects.contact') || 'Contact'}
              </span>
            )}
          </Button>
          <Button size="sm" variant="outline" className={`h-9 ${projectOutlineButtonClass}`} onClick={onScheduleVisit}>
            <CalendarCheck className="mr-2 h-3.5 w-3.5" />
            {t('projects.scheduleSiteVisit') || 'Schedule Site Visit'}
          </Button>
          <ShareModal title={title} url={shareUrl}>
            <Button size="sm" variant="outline" className={`h-9 ${projectOutlineButtonClass}`}>
              <Share2 className="mr-2 h-3.5 w-3.5" />
              {t('projects.shareProject') || 'Share Project'}
            </Button>
          </ShareModal>
        </div>
      </CardContent>
    </Card>
  );
}

function UnitTypeCard({ unitType }: { unitType: ProjectUnitType }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-border bg-background/60 p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{unitType.name}</h3>
          {unitType.description && (
            <p className="mt-1 text-sm text-muted-foreground">{unitType.description}</p>
          )}
        </div>
        {unitType.price_range && (
          <Badge variant="outline" className="w-fit border-primary/20 bg-primary/5 text-primary">
            {unitType.price_range}
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        {unitType.area && (
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-muted-foreground">{t('projects.area') || 'Area'}</p>
            <p className="font-semibold">{unitType.area}</p>
          </div>
        )}
        {unitType.units && (
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-muted-foreground">{t('projects.units') || 'Units'}</p>
            <p className="font-semibold">{unitType.units}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentPlanCard({ paymentPlan }: { paymentPlan: ProjectPaymentPlan }) {
  return (
    <div className="rounded-xl border border-border bg-background/60 p-4">
      <h3 className="font-semibold text-foreground">{paymentPlan.name}</h3>
      {paymentPlan.description && (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{paymentPlan.description}</p>
      )}
    </div>
  );
}

export default function PublicProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { data, isLoading, error } = useProject(slug || '');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const project = data?.data?.data || null;

  const title = useMemo(() => {
    if (!project) return '';
    return language === 'mm' ? project.title_mm || project.title_en : project.title_en;
  }, [project, language]);

  const description = useMemo(() => {
    if (!project) return '';
    return language === 'mm'
      ? project.description_mm || project.description_en || ''
      : project.description_en || project.description_mm || '';
  }, [project, language]);

  const galleryImages = useMemo(() => {
    if (!project) return [];

    const images = project.media?.images || [];
    const primaryImage = project.media?.primary_image || project.primary_image;
    const merged = primaryImage
      ? [primaryImage, ...images.filter((image) => image.id !== primaryImage.id)]
      : images;

    return merged
      .filter((image) => Boolean(image.url))
      .map((image) => ({
        id: image.id,
        filename: image.filename,
        url: image.url || image.medium_url || image.small_url || image.thumbnail_url,
        thumbnail_url: image.thumbnail_url || image.small_url || image.url,
        type: image.type || 'image',
      }));
  }, [project]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project?.id, galleryImages.length]);

  const conditionLabel = useMemo(() => {
    if (!project) return '';

    const labels: Record<ProjectCondition, string> = {
      ongoing: t('projects.condition.ongoing') || 'On going',
      upcoming: t('projects.condition.upcoming') || 'Upcoming',
      under_construction: t('projects.condition.underConstruction') || 'Under Construction',
    };

    return labels[project.condition];
  }, [project, t]);

  const propertyType = project
    ? language === 'mm'
      ? project.property_type?.name_mm || project.property_type?.name_en || ''
      : project.property_type?.name_en || ''
    : '';

  const region = project
    ? language === 'mm'
      ? project.location?.region?.name_mm
      : project.location?.region?.name_en
    : '';
  const township = project
    ? language === 'mm'
      ? project.location?.township?.name_mm
      : project.location?.township?.name_en
    : '';
  const location = [township, region].filter(Boolean).join(', ');

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2">{t('projects.errorLoading') || 'Failed to load project'}</h3>
            <p className="mb-4 text-muted-foreground">
              {t('projects.errorMessage') || 'Failed to load the project. Please try again later.'}
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('projectDetail.back') || 'Go Back'}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        seo={{
          title,
          description: description.substring(0, 160),
          keywords: `${title}, ${propertyType}, ${location}, project`,
          image: galleryImages[0]?.url || '/jade.png',
        }}
        path={`/projects/${slug}`}
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 sm:mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('projectDetail.backToListings') || 'Back to Listings'}
          </Button>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="space-y-5 lg:col-span-2">
              {galleryImages.length > 0 && (
                <ProjectGallery
                  galleryImages={galleryImages}
                  title={title}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                  shareUrl={window.location.href}
                  viewCount={project.view_count || 0}
                  isFeatured={project.is_featured}
                  featuredLabel={t('projects.featured') || 'Featured'}
                />
              )}

              <Card className={projectCardClass}>
                <CardContent className="p-4 sm:p-6">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="mb-6 grid w-full grid-cols-3 rounded-xl bg-muted/60">
                      <TabsTrigger value="overview" className={projectTabTriggerClass}>
                        {t('projects.overview') || 'Overview'}
                      </TabsTrigger>
                      <TabsTrigger value="unit-types" className={projectTabTriggerClass}>
                        {t('projects.unitTypes') || 'Unit Types'}
                      </TabsTrigger>
                      <TabsTrigger value="payment-plans" className={projectTabTriggerClass}>
                        {t('projects.paymentPlans') || 'Payment Plans'}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                      <div>
                        <h2 className="mb-3 font-semibold">{t('projects.aboutThisProject') || 'About This Project'}</h2>
                        <p className="leading-7 text-muted-foreground">
                          {description || t('projects.noDescription') || 'No description provided.'}
                        </p>
                      </div>

                      {project.features && project.features.length > 0 && (
                        <div>
                          <h3 className="mb-3 font-semibold">{t('projects.features') || 'Features'}</h3>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {project.features.map((feature) => (
                              <div key={feature} className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-muted/50 p-4">
                          <CalendarCheck className="mb-2 h-5 w-5 text-primary" />
                          <p className="text-sm text-muted-foreground">{t('projects.completion') || 'Completion'}</p>
                          <p className="font-semibold">{project.completion_text || '-'}</p>
                        </div>
                        <div className="rounded-xl bg-muted/50 p-4">
                          <Home className="mb-2 h-5 w-5 text-primary" />
                          <p className="text-sm text-muted-foreground">{t('projects.totalUnits') || 'Total Units'}</p>
                          <p className="font-semibold">{project.total_units || '-'}</p>
                        </div>
                        <div className="rounded-xl bg-muted/50 p-4">
                          <Building2 className="mb-2 h-5 w-5 text-primary" />
                          <p className="text-sm text-muted-foreground">{t('projects.type') || 'Type'}</p>
                          <p className="font-semibold">{propertyType || '-'}</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="unit-types" className="space-y-4">
                      {project.unit_types && project.unit_types.length > 0 ? (
                        project.unit_types.map((unitType) => (
                          <UnitTypeCard key={unitType.id || unitType.name} unitType={unitType} />
                        ))
                      ) : (
                        <p className="rounded-xl bg-muted/50 p-6 text-center text-muted-foreground">
                          {t('projects.noUnitTypes') || 'No unit types available.'}
                        </p>
                      )}
                    </TabsContent>

                    <TabsContent value="payment-plans" className="space-y-4">
                      {project.payment_plans && project.payment_plans.length > 0 ? (
                        project.payment_plans.map((paymentPlan) => (
                          <PaymentPlanCard key={paymentPlan.id || paymentPlan.name} paymentPlan={paymentPlan} />
                        ))
                      ) : (
                        <p className="rounded-xl bg-muted/50 p-6 text-center text-muted-foreground">
                          {t('projects.noPaymentPlans') || 'No payment plans available.'}
                        </p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="self-start">
              <ProjectSummaryCard
                project={project}
                title={title}
                location={location}
                propertyType={propertyType}
                conditionLabel={conditionLabel}
                shareUrl={window.location.href}
                onScheduleVisit={() => navigate('/appointments')}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
