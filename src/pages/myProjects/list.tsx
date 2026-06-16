import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Edit,
  Eye,
  Image as ImageIcon,
  MapPin,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { SEOHead } from '@/components/seo/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useModal } from '@/contexts/ModalContext';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useDeleteMyProject } from '@/hooks/mutations/useProjectMutations';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { useMyProjects } from '@/hooks/queries/useProjects';
import { seoUtils } from '@/lib/seo';
import type { Project, ProjectCondition, ProjectFilters, ProjectPublishStatus } from '@/types/projects';

const conditionLabels: Record<ProjectCondition, string> = {
  upcoming: 'Upcoming',
  ongoing: 'Ongoing',
  under_construction: 'Under Construction',
};

const publishStatusLabels: Record<ProjectPublishStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  unpublished: 'Unpublished',
};

const conditionColors: Record<ProjectCondition, string> = {
  upcoming: 'bg-blue-500/90 text-white border-blue-500/50',
  ongoing: 'bg-emerald-500/90 text-white border-emerald-500/50',
  under_construction: 'bg-amber-500/90 text-amber-950 border-amber-500/50',
};

const publishStatusColors: Record<ProjectPublishStatus, string> = {
  draft: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  published: 'bg-green-500/10 text-green-600 border-green-500/20',
  unpublished: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function MyProjectsList() {
  const seo = seoUtils.getPageSEO('myProjects');
  const { t, language } = useLanguage();
  const { showSuccess, showError } = useModal();
  const deleteProject = useDeleteMyProject();
  const {
    isOpen: isConfirmOpen,
    options: confirmOptions,
    isLoading: isConfirmLoading,
    showConfirm,
    hideConfirm,
    handleConfirm,
  } = useConfirmModal();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [publishStatus, setPublishStatus] = useState<string>('all');
  const [condition, setCondition] = useState<string>('all');
  const [regionId, setRegionId] = useState<string>('all');
  const [townshipId, setTownshipId] = useState<string>('all');

  const filters = useMemo<ProjectFilters>(() => {
    const filterParams: ProjectFilters = {
      page: currentPage,
      per_page: 12,
    };

    if (search.trim()) filterParams.search = search.trim();
    if (publishStatus !== 'all') filterParams.publish_status = publishStatus as ProjectPublishStatus;
    if (condition !== 'all') filterParams.condition = condition as ProjectCondition;
    if (regionId !== 'all') filterParams.region_id = Number(regionId);
    if (townshipId !== 'all') filterParams.township_id = Number(townshipId);

    return filterParams;
  }, [condition, currentPage, publishStatus, regionId, search, townshipId]);

  const { data, isLoading, error, refetch } = useMyProjects(filters);
  const { data: regionsResp } = useRegions();
  const { data: townshipsResp } = useTownships();

  const projects = data?.data?.data || [];
  const pagination = data?.data?.pagination;
  const regions = regionsResp?.data || [];
  const allTownships = townshipsResp?.data || [];
  const filteredTownships = regionId === 'all'
    ? allTownships
    : allTownships.filter((township: any) => String(township.region_id) === regionId);

  const resetPage = () => setCurrentPage(1);

  const getTitle = (project: Project) => {
    if (language === 'mm') {
      return project.title_mm || project.title_en;
    }

    return project.title_en;
  };

  const getDescription = (project: Project) => {
    if (language === 'mm') {
      return project.description_mm || project.description_en || '';
    }

    return project.description_en || project.description_mm || '';
  };

  const getLocation = (project: Project) => {
    const region = language === 'mm' ? project.location?.region?.name_mm : project.location?.region?.name_en;
    const township = language === 'mm' ? project.location?.township?.name_mm : project.location?.township?.name_en;

    return [township, region].filter(Boolean).join(', ') || 'Location not specified';
  };

  const getPropertyType = (project: Project) => {
    return (language === 'mm' ? project.property_type?.name_mm : project.property_type?.name_en) || 'Project';
  };

  const getProjectImage = (project: Project) => {
    return project.primary_image?.url || project.media?.primary_image?.url || project.media?.images?.[0]?.url;
  };

  const getPrice = (project: Project) => {
    if (project.price?.range) {
      return project.price.range;
    }

    const min = project.price?.min;
    const max = project.price?.max;
    const currency = project.price?.currency || 'MMK';

    if (min && max) return `${min} - ${max} ${currency}`;
    if (min) return `From ${min} ${currency}`;
    if (max) return `Up to ${max} ${currency}`;

    return 'Price not specified';
  };

  const handleDelete = (project: Project) => {
    showConfirm({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete "${getTitle(project)}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmVariant: 'destructive',
      onConfirm: async () => {
        try {
          await deleteProject.mutateAsync(project.id);
          showSuccess('Project deleted successfully!', 'Success!');
        } catch (deleteError: any) {
          const message = deleteError?.response?.data?.message || deleteError?.message || 'Failed to delete project.';
          showError(message, 'Error');
        }
      },
    });
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="glass border-border/50 overflow-hidden">
          <Skeleton className="h-48 w-full rounded-none" />
          <CardHeader className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <SEOHead seo={seo} path="/my-projects" />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                My Projects
              </h1>
              <p className="text-muted-foreground mt-2">Manage your upcoming project listings.</p>
            </div>
            <Button asChild className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105">
              <Link to="/my-projects/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Link>
            </Button>
          </div>

          <Card className="glass border-border/50 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col xl:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('forms.searchPlaceholder') || 'Search...'}
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        resetPage();
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full xl:w-auto">
                  <Select
                    value={publishStatus}
                    onValueChange={(value) => {
                      setPublishStatus(value);
                      resetPage();
                    }}
                  >
                    <SelectTrigger className="w-full lg:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="unpublished">Unpublished</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={condition}
                    onValueChange={(value) => {
                      setCondition(value);
                      resetPage();
                    }}
                  >
                    <SelectTrigger className="w-full lg:w-44">
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="under_construction">Under Construction</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={regionId}
                    onValueChange={(value) => {
                      setRegionId(value);
                      setTownshipId('all');
                      resetPage();
                    }}
                  >
                    <SelectTrigger className="w-full lg:w-40">
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      {regions.map((region: any) => (
                        <SelectItem key={region.id} value={String(region.id)}>
                          {language === 'mm' ? region.name_mm : region.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={townshipId}
                    onValueChange={(value) => {
                      setTownshipId(value);
                      resetPage();
                    }}
                  >
                    <SelectTrigger className="w-full lg:w-40">
                      <SelectValue placeholder="Township" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Townships</SelectItem>
                      {filteredTownships.map((township: any) => (
                        <SelectItem key={township.id} value={String(township.id)}>
                          {language === 'mm' ? township.name_mm : township.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            renderSkeletons()
          ) : error ? (
            <Card className="glass border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="text-lg font-semibold mb-2">{t('common.error') || 'Error'}</h3>
                <p className="text-muted-foreground mb-4">Unable to load your projects.</p>
                <Button onClick={() => refetch()} variant="outline">
                  {t('advertisements.retry') || 'Retry'}
                </Button>
              </CardContent>
            </Card>
          ) : projects.length === 0 ? (
            <Card className="glass border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-primary/60 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-4">Create your first project listing to get started.</p>
                <Button asChild className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50">
                  <Link to="/my-projects/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {projects.map((project: Project) => {
                  const imageUrl = getProjectImage(project);

                  return (
                    <Card key={project.id} className="group hover:shadow-xl transition-all border-border/50 backdrop-blur-sm h-full flex flex-col overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        {imageUrl ? (
                          <ImageWithFallback
                            src={imageUrl}
                            alt={getTitle(project)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                            <ImageIcon className="h-10 w-10 text-primary/40" />
                          </div>
                        )}

                        <div className="absolute top-3 left-3">
                          <Badge variant="outline" className={`${conditionColors[project.condition]} backdrop-blur-sm`}>
                            {conditionLabels[project.condition]}
                          </Badge>
                        </div>

                        <div className="absolute top-3 right-3">
                          <Badge variant="outline" className={`${publishStatusColors[project.publish_status]} backdrop-blur-sm`}>
                            {publishStatusLabels[project.publish_status]}
                          </Badge>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/40 to-transparent">
                          <Badge variant="outline" className="bg-background/80 text-foreground border-border/50 max-w-full truncate">
                            {getPropertyType(project)}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className="space-y-3 pb-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                            {getTitle(project)}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{getDescription(project)}</p>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="line-clamp-1">{getLocation(project)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="line-clamp-1">{getPrice(project)}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 py-2 border-t border-border/50">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                              <Eye className="h-4 w-4 text-primary" />
                              <span className="font-medium">{project.view_count ?? 0}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                              <Building2 className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{project.total_units || '-'}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              <span className="font-medium line-clamp-1">{project.completion_text || '-'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border/50 space-y-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>
                                Created {new Date(project.dates?.created_at || Date.now()).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm" className="flex-1 bg-primary/10 text-primary hover:bg-primary/20">
                              <Link to={`/my-projects/edit/${project.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(project)}
                              className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {pagination && pagination.last_page > 1 && (
                <div className="flex justify-center">
                  <Pagination currentPage={currentPage} totalPages={pagination.last_page} onPageChange={setCurrentPage} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={hideConfirm}
        onConfirm={handleConfirm}
        title={confirmOptions?.title || ''}
        message={confirmOptions?.message || ''}
        confirmText={confirmOptions?.confirmText}
        cancelText={confirmOptions?.cancelText}
        confirmVariant={confirmOptions?.confirmVariant}
        isLoading={isConfirmLoading}
      />
    </>
  );
}
