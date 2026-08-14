import { Link } from 'react-router-dom';
import type { SliderAd } from '@/types/ads';

export interface HomeAdLocationState {
  fromHomeAd: true;
  homeAd: SliderAd;
}

export function getHomeAdNavigation(ad: SliderAd) {
  const adLink = ad.link?.trim();
  const companySlug = ad.user?.company?.slug;

  if (adLink) {
    return {
      href: adLink,
      opensInNewTab: true as const,
      isCompany: false as const,
    };
  }

  if (companySlug) {
    return {
      href: `/companies/${companySlug}`,
      opensInNewTab: false as const,
      isCompany: true as const,
      state: { fromHomeAd: true, homeAd: ad } satisfies HomeAdLocationState,
    };
  }

  return {
    href: '#' as const,
    opensInNewTab: false as const,
    isCompany: false as const,
  };
}

export function isHomeAdLocationState(state: unknown): state is HomeAdLocationState {
  if (!state || typeof state !== 'object') return false;
  const value = state as Partial<HomeAdLocationState>;
  return value.fromHomeAd === true && Boolean(value.homeAd);
}

interface HomeAdTargetLinkProps {
  ad: SliderAd;
  className?: string;
  ariaLabel: string;
}

export function HomeAdTargetLink({ ad, className, ariaLabel }: HomeAdTargetLinkProps) {
  const navigation = getHomeAdNavigation(ad);

  if (navigation.href === '#') return null;

  if (navigation.opensInNewTab) {
    return (
      <a
        href={navigation.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={ariaLabel}
      />
    );
  }

  return (
    <Link
      to={navigation.href}
      state={navigation.isCompany ? navigation.state : undefined}
      className={className}
      aria-label={ariaLabel}
    />
  );
}
