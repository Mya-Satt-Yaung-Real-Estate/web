import { memo, useMemo } from 'react';
import { ArrowRight, Building2, Eye, Home, MapPin, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHomeNewProjects } from '@/hooks/queries/home';
import type { Project } from '@/types/projects';

const conditionLabels: Record<string, string> = {
  upcoming: 'Upcoming',
  ongoing: 'On going',
  under_construction: 'Under Construction',
};

const getConditionColor = (condition: string) => {
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


function HomeProjectCard({ project }: { project: Project }) {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const title = language === 'mm' ? project.title_mm || project.title_en : project.title_en;
  const description = language === 'mm'
    ? project.description_mm || project.description_en
    : project.description_en || project.description_mm;
  const propertyType = language === 'mm'
    ? project.property_type?.name_mm || project.property_type?.name_en
    : project.property_type?.name_en;
  const region = language === 'mm' ? project.location?.region?.name_mm : project.location?.region?.name_en;
  const township = language === 'mm' ? project.location?.township?.name_mm : project.location?.township?.name_en;
  const location = [township, region].filter(Boolean).join(', ');
  const imageUrl = project.primary_image?.url || project.media?.primary_image?.url || project.media?.images?.[0]?.url || '';
  const price = project.price?.range || 'Price not specified';
  const developerName = project.developer?.name || 'Developer not specified';
  const companySlug = project.developer?.user_type === 'company' ? project.developer.company_slug : null;
  const previewImages = (project.media?.images || [])
    .filter((image) => image.url && image.url !== imageUrl)
    .slice(0, 2);

  const openProjectDetail = () => {
    const projectPath = project.slug || String(project.id);
    if (projectPath) {
      navigate(`/projects/${projectPath}`);
    }
  };

  return (
    <Card
      role="link"
      tabIndex={0}
      onClick={openProjectDetail}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openProjectDetail();
        }
      }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-primary/20 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
    >
      <div className="relative h-56 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge variant="outline" className={`rounded-full px-3 py-1 text-[11px] font-semibold shadow-md backdrop-blur-sm ${getConditionColor(project.condition)}`}>
            {conditionLabels[project.condition] || project.condition}
          </Badge>
          {project.is_featured && (
            <Badge className="rounded-full bg-amber-500 px-3 py-1 text-[11px] font-semibold text-white shadow-md">
              <Sparkles className="mr-1 h-3 w-3" />
              Featured
            </Badge>
          )}
        </div>

        {previewImages.length > 0 && (
          <div className="pointer-events-none absolute bottom-3 right-3 flex gap-1.5">
            {previewImages.map((image) => (
              <div key={image.id} className="h-10 w-10 overflow-hidden rounded-md border-2 border-white bg-white shadow-md">
                <ImageWithFallback src={image.url} alt={title} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1 rounded-lg border border-white/20 bg-black/35 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          <Eye className="h-3.5 w-3.5" />
          <span>{(project.view_count || 0).toLocaleString()}</span>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col p-5 pt-7">
        <h3 className="mb-3 line-clamp-1 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>

        {description && (
          <p className="mb-5 min-h-[2.5rem] text-sm leading-5 text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        <div className="space-y-2.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="line-clamp-1">{location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 flex-shrink-0 text-primary" />
            {companySlug ? (
              <Link
                to={`/companies/${companySlug}`}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
                className="line-clamp-1 hover:text-primary hover:underline"
              >
                {developerName}
              </Link>
            ) : (
              <span className="line-clamp-1">{developerName}</span>
            )}
          </div>
        </div>

        <div className="my-4 border-t border-border" />

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="mb-1 text-muted-foreground">Price Range</p>
            <p className="font-semibold text-primary line-clamp-1">{price}</p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-muted-foreground">Completion</p>
            <p className="font-semibold text-foreground line-clamp-1">{project.completion_text || '-'}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Home className="h-3.5 w-3.5 text-primary" />
            <span className="line-clamp-1">{project.total_units || '-'}</span>
          </div>
          {propertyType && (
            <Badge variant="outline" className="max-w-[55%] truncate border-primary/20 bg-primary/5 text-primary">
              {propertyType}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export const HomeNewProjectsSection = memo(function HomeNewProjectsSection() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useHomeNewProjects();

  const projects = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data;
  }, [data]);

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <Skeleton className="mb-4 h-8 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="overflow-hidden rounded-xl">
                <Skeleton className="h-56 w-full" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="mt-4 h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || projects.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2>{t('home.newProjectsTitle') || 'New Projects'}</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <Building2 className="h-3.5 w-3.5" />
                New Launch
              </span>
            </div>
            <p className="text-muted-foreground">
              {t('home.newProjectsSubtitle') || 'Discover the latest development projects and upcoming launches'}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/search?type=projects">
              {t('home.viewAllProjects') || 'View All Projects'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <HomeProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
});
