/**
 * Recommended Property Types Section
 * 
 * Displays property type buttons that navigate to search page with filter.
 */

import { useNavigate } from 'react-router-dom';
import { usePropertyTypes } from '@/hooks/queries/usePropertyTypes';
import { useLanguage } from '@/contexts/LanguageContext';
import { Zap } from 'lucide-react';
import type { PropertyType } from '@/services/api/propertyTypes';

export function RecommendedPropertyTypes() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { data: propertyTypesData } = usePropertyTypes();
  
  const propertyTypes = propertyTypesData?.data || [];

  const getPropertyTypeName = (type: PropertyType): string => {
    return language === 'mm' ? type.name_mm : type.name_en;
  };

  const handlePropertyTypeClick = (propertyTypeId: number) => {
    navigate(`/search?property_type_id=${propertyTypeId}`);
  };

  if (propertyTypes.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">
          {t('search.recommendedPropertyTypes') || 'Recommended Property Types'}
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {propertyTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handlePropertyTypeClick(type.id)}
            className="px-4 py-2 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 hover:bg-primary/5 text-sm font-medium transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            {getPropertyTypeName(type)}
          </button>
        ))}
      </div>
    </div>
  );
}

