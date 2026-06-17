import { Link, useNavigate } from 'react-router-dom';
import { Building2, Eye, Home, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { InfiniteScrollList } from '@/components/features/InfiniteScrollList';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInfiniteProjects } from '@/hooks/queries/useProjects';
import type { Project, ProjectCondition, ProjectFilters } from '@/types/projects';

interface ProjectListProps {
  filters?: ProjectFilters;
}

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

function ProjectCard({ project }: { project: Project }) {
  const { t, language } = useLanguage();
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
  const developerName = project.developer?.name || t('projects.developerNotSpecified') || 'Developer not specified';
  const companySlug = project.developer?.user_type === 'company' ? project.developer.company_slug : null;

  const conditionLabels: Record<ProjectCondition, string> = {
    ongoing: t('projects.condition.ongoing') || 'Ongoing',
    upcoming: t('projects.condition.upcoming') || 'Upcoming',
    under_construction: t('projects.condition.underConstruction') || 'Under Construction',
  };

  const openProjectDetail = () => {
    navigate(`/projects/${project.slug}`);
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
      className="group h-full cursor-pointer overflow-hidden rounded-xl border border-primary/20 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
    >
      <div className="relative h-56 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={`rounded-full px-3 py-1 text-[11px] font-semibold shadow-md ${getConditionColor(project.condition)}`}
          >
            {conditionLabels[project.condition]}
          </Badge>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg border border-white/20 bg-black/35 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          <Eye className="h-3.5 w-3.5" />
          <span>{(project.view_count || 0).toLocaleString()}</span>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col p-5 pt-6">
        <h3 className="mb-3 line-clamp-1 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>

        {description && (
          <p className="mb-5 min-h-[2.5rem] line-clamp-2 text-sm leading-5 text-muted-foreground">
            {description}
          </p>
        )}

        <div className="space-y-2.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="line-clamp-1">{location || t('projects.locationNotSpecified') || 'Location not specified'}</span>
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
            <p className="mb-1 text-muted-foreground">{t('projects.priceRange') || 'Price Range'}</p>
            <p className="line-clamp-1 font-semibold text-primary">
              {project.price?.range || t('projects.priceNotSpecified') || 'Price not specified'}
            </p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-muted-foreground">{t('projects.completion') || 'Completion'}</p>
            <p className="line-clamp-1 font-semibold text-foreground">{project.completion_text || '-'}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Home className="h-3.5 w-3.5 text-primary" />
            <span className="line-clamp-1">
              {project.total_units || '-'} {t('projects.units') || 'units'}
            </span>
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

const skeletons = (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {[...Array(6)].map((_, index) => (
      <Card key={index} className="overflow-hidden rounded-xl">
        <Skeleton className="h-56 w-full" />
        <div className="space-y-2 p-5">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="mt-4 h-10 w-full" />
        </div>
      </Card>
    ))}
  </div>
);

export function ProjectList({ filters }: ProjectListProps) {
  const { t } = useLanguage();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProjects(filters);

  if (isLoading) {
    return skeletons;
  }

  if (error) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">
          {t('projects.errorLoading') || 'Failed to load projects. Please try again later.'}
        </p>
      </Card>
    );
  }

  const projects = data?.pages.flatMap((page) => page.data?.data || []) || [];

  if (projects.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2">{t('projects.noProjectsFound') || 'No projects found'}</h3>
        <p className="text-muted-foreground">
          {t('search.tryAdjustingFilters') || 'Try adjusting your search or filters'}
        </p>
      </Card>
    );
  }

  const loadingSkeletons = (
    <div className="mt-4 sm:mt-6">
      {skeletons}
    </div>
  );

  return (
    <InfiniteScrollList
      hasNextPage={hasNextPage || false}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      loadingComponent={loadingSkeletons}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </InfiniteScrollList>
  );
}
