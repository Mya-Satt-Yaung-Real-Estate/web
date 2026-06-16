import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2, Home, RotateCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePropertyTypes } from '@/hooks/queries/usePropertyTypes';
import type { ProjectCondition } from '@/types/projects';

const PROJECT_CONDITIONS: ProjectCondition[] = ['ongoing', 'upcoming', 'under_construction'];

export function ProjectFilters() {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: propertyTypesData } = usePropertyTypes();

  const propertyTypes = propertyTypesData?.data || [];

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [propertyTypeId, setPropertyTypeId] = useState(searchParams.get('property_type_id') || 'all');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'all');

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setPropertyTypeId(searchParams.get('property_type_id') || 'all');
    setCondition(searchParams.get('condition') || 'all');
  }, [searchParams]);

  const updateFilters = (updates: {
    search?: string;
    property_type_id?: string;
    condition?: string;
  }) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    newParams.delete('page');
    setSearchParams(newParams);
  };

  useEffect(() => {
    const currentSearchParam = searchParams.get('search') || '';

    if (search === currentSearchParam) {
      return;
    }

    const timeoutId = setTimeout(() => {
      updateFilters({ search });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResetFilters = () => {
    const newParams = new URLSearchParams();
    newParams.set('type', 'projects');
    setSearchParams(newParams);
  };

  const getLocalizedName = (item: { name_en: string; name_mm: string }) => {
    return language === 'mm' ? item.name_mm : item.name_en;
  };

  const getConditionLabel = (value: ProjectCondition) => {
    const labels: Record<ProjectCondition, string> = {
      ongoing: t('projects.condition.ongoing') || 'Ongoing',
      upcoming: t('projects.condition.upcoming') || 'Upcoming',
      under_construction: t('projects.condition.underConstruction') || 'Under Construction',
    };

    return labels[value];
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 sm:p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('projects.searchPlaceholder') || 'Search projects...'}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10 h-10 bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>

        <div className="md:col-span-3">
          <Select
            value={propertyTypeId}
            onValueChange={(value) => {
              setPropertyTypeId(value);
              updateFilters({ property_type_id: value });
            }}
          >
            <SelectTrigger className="h-10 bg-background/50 border-border/50">
              <Home className="h-4 w-4 mr-2 text-primary" />
              <SelectValue placeholder={t('search.propertyType') || 'Property Type'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('search.allTypes') || 'All Types'}</SelectItem>
              {propertyTypes.map((type) => (
                <SelectItem key={type.id} value={String(type.id)}>
                  {getLocalizedName(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-3">
          <Select
            value={condition}
            onValueChange={(value) => {
              setCondition(value);
              updateFilters({ condition: value });
            }}
          >
            <SelectTrigger className="h-10 bg-background/50 border-border/50">
              <Building2 className="h-4 w-4 mr-2 text-primary" />
              <SelectValue placeholder={t('projects.condition') || 'Condition'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('projects.allConditions') || 'All Conditions'}</SelectItem>
              {PROJECT_CONDITIONS.map((value) => (
                <SelectItem key={value} value={value}>
                  {getConditionLabel(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-10 text-sm"
            onClick={handleResetFilters}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('search.reset') || 'Reset'}
          </Button>
        </div>
      </div>
    </div>
  );
}
