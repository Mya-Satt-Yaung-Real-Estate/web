import { memo, useMemo } from 'react';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHomeExploreCategories } from '@/hooks/queries/home';
import {
  getHomeExploreCategoryIcon,
  getHomeExploreCategoryIconStyle,
} from '@/lib/homeExploreCategoryIcons';
import type { HomeExploreCategory } from '@/types/homeExploreCategory';
import { resolveExploreCategoryHref } from '@/lib/exploreCategoryNavigation';
import { cn } from '@/lib/utils';

/** sort_order 1 is reserved for the large featured card on the home page. */
const FEATURED_SORT_ORDER = 1;
/** 1 featured + 8 small cards in a 5-column, 2-row desktop grid. */
const SMALL_CATEGORY_SKELETON_COUNT = 8;

function getCategoryTitle(category: HomeExploreCategory, language: string): string {
  return language === 'mm' ? category.title_mm : category.title_en;
}

function getCategoryDescription(category: HomeExploreCategory, language: string): string {
  const description = language === 'mm' ? category.description_mm : category.description_en;
  return description?.trim() ?? '';
}

function resolveFeaturedCategory(categories: HomeExploreCategory[]): HomeExploreCategory | null {
  if (categories.length === 0) return null;
  return categories.find((category) => category.sort_order === FEATURED_SORT_ORDER) ?? categories[0];
}

const SmallCategoryCard = memo(function SmallCategoryCard({
  category,
  label,
  description,
  browseLabel,
  icon: Icon,
  iconStyle,
}: {
  category: HomeExploreCategory;
  label: string;
  description: string;
  browseLabel: string;
  icon: LucideIcon;
  iconStyle: { containerClass: string; iconClass: string };
}) {
  const href = useMemo(
    () => resolveExploreCategoryHref(category.link_path),
    [category.link_path],
  );

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex h-full min-h-[168px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl p-5 text-center text-white sm:min-h-[180px] lg:min-h-0 lg:gap-2 lg:p-4',
        'bg-gradient-to-br from-[#4a9b82] via-[#3d8f74] to-[#2f7a66]',
        'shadow-md shadow-primary/10 transition-all duration-300',
        'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 hover:ring-2 hover:ring-white/25',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
      )}
    >
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105',
          iconStyle.containerClass,
        )}
      >
        <Icon className={cn('h-4 w-4', iconStyle.iconClass)} strokeWidth={1.75} />
      </div>
      <div className="flex w-full flex-col items-center gap-2">
        <span className="text-sm font-medium leading-snug sm:text-base lg:text-sm">{label}</span>
        {description ? (
          <p className="line-clamp-3 max-w-full px-1 text-xs leading-relaxed text-white/85 sm:text-sm lg:line-clamp-2">
            {description}
          </p>
        ) : null}
        <span className="inline-flex items-center gap-1 text-xs font-medium text-white/95 transition-transform group-hover:translate-x-0.5">
          {browseLabel}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
        </span>
      </div>
    </a>
  );
});

const FeaturedCategoryCard = memo(function FeaturedCategoryCard({
  category,
  title,
  description,
  browseLabel,
  icon: Icon,
  iconStyle,
}: {
  category: HomeExploreCategory;
  title: string;
  description: string;
  browseLabel: string;
  icon: LucideIcon;
  iconStyle: { containerClass: string; iconClass: string };
}) {
  const href = useMemo(
    () => resolveExploreCategoryHref(category.link_path),
    [category.link_path],
  );

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group col-span-2 flex h-full min-h-[280px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl p-8 text-center text-white sm:min-h-[300px] lg:col-span-1 lg:row-span-2 lg:min-h-0',
        'bg-[radial-gradient(circle_at_center,_#4a9b82_0%,_#2d6b58_45%,_#1a4d3f_100%)]',
        'shadow-lg shadow-primary/15 transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/25 hover:ring-2 hover:ring-white/25',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-105',
          iconStyle.containerClass,
        )}
      >
        <Icon className={cn('h-5 w-5', iconStyle.iconClass)} strokeWidth={1.75} />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        {description ? (
          <p className="max-w-[240px] text-sm leading-relaxed text-white/85">{description}</p>
        ) : null}
      </div>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-white/95 transition-transform group-hover:translate-x-0.5">
        {browseLabel}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </a>
  );
});

const SmallCategoryCardSkeleton = memo(function SmallCategoryCardSkeleton() {
  return <Skeleton className="min-h-[168px] rounded-2xl sm:min-h-[180px]" />;
});

const FeaturedCategoryCardSkeleton = memo(function FeaturedCategoryCardSkeleton() {
  return (
    <Skeleton
      className="col-span-2 min-h-[280px] rounded-2xl sm:min-h-[300px] lg:col-span-1 lg:row-span-2 lg:min-h-0"
    />
  );
});

export const HomeExploreByCategorySection = memo(function HomeExploreByCategorySection() {
  const { t, language } = useLanguage();
  const { data, isLoading } = useHomeExploreCategories();

  const categories = useMemo(() => {
    const items = data?.data?.data;
    if (!Array.isArray(items)) return [];
    return [...items].sort((a, b) => a.sort_order - b.sort_order);
  }, [data]);

  const featuredCategory = useMemo(
    () => resolveFeaturedCategory(categories),
    [categories],
  );

  const smallCategories = useMemo(() => {
    if (!featuredCategory) return [];
    return categories.filter((category) => category.id !== featuredCategory.id);
  }, [categories, featuredCategory]);

  const browseLabel = t('home.exploreByCategory.browse');

  if (!isLoading && categories.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h2>{t('home.exploreByCategory.title')}</h2>
          <p className="mt-3 text-muted-foreground">
            {t('home.exploreByCategory.subtitle')}
          </p>
        </div>

        <div className="grid auto-rows-fr grid-cols-2 items-stretch gap-4 lg:grid-cols-5 lg:grid-rows-2">
          {isLoading ? (
            <>
              <FeaturedCategoryCardSkeleton />
              {Array.from({ length: SMALL_CATEGORY_SKELETON_COUNT }, (_, index) => (
                <SmallCategoryCardSkeleton key={index} />
              ))}
            </>
          ) : (
            <>
              {featuredCategory ? (
                <FeaturedCategoryCard
                  category={featuredCategory}
                  title={getCategoryTitle(featuredCategory, language)}
                  description={getCategoryDescription(featuredCategory, language)}
                  browseLabel={browseLabel}
                  icon={getHomeExploreCategoryIcon(featuredCategory.icon_key)}
                  iconStyle={getHomeExploreCategoryIconStyle(featuredCategory.icon_key)}
                />
              ) : null}

              {smallCategories.map((category) => (
                <SmallCategoryCard
                  key={category.id}
                  category={category}
                  label={getCategoryTitle(category, language)}
                  description={getCategoryDescription(category, language)}
                  browseLabel={browseLabel}
                  icon={getHomeExploreCategoryIcon(category.icon_key)}
                  iconStyle={getHomeExploreCategoryIconStyle(category.icon_key)}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
});
