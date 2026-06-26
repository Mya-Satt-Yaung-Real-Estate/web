import {
  BadgeCheck,
  Building2,
  Calendar,
  CreditCard,
  Crown,
  Grid3x3,
  Handshake,
  Home,
  List,
  Megaphone,
  ShoppingCart,
  Star,
  Tag,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

const HOME_EXPLORE_CATEGORY_ICONS: Record<string, LucideIcon> = {
  trending_up: TrendingUp,
  handshake: Handshake,
  tag: Tag,
  badge_check: BadgeCheck,
  list: List,
  credit_card: CreditCard,
  megaphone: Megaphone,
  building2: Building2,
  shopping_cart: ShoppingCart,
  grid3x3: Grid3x3,
  calendar: Calendar,
  star: Star,
  crown: Crown,
  home: Home,
};

const DEFAULT_ICON = Home;

export type HomeExploreCategoryIconStyle = {
  containerClass: string;
  iconClass: string;
};

/** Colored icon badge (container) + icon glyph — keyed by icon_key from API. */
const HOME_EXPLORE_CATEGORY_ICON_STYLES: Record<string, HomeExploreCategoryIconStyle> = {
  crown: {
    containerClass: 'bg-gradient-to-br from-amber-300 to-amber-500 shadow-md shadow-amber-950/25 ring-1 ring-amber-200/40',
    iconClass: 'text-white',
  },
  star: {
    containerClass: 'bg-gradient-to-br from-amber-200 to-amber-400 shadow-md shadow-amber-950/20 ring-1 ring-amber-100/30',
    iconClass: 'text-amber-950',
  },
  trending_up: {
    containerClass: 'bg-gradient-to-br from-sky-300 to-sky-500 shadow-md shadow-sky-950/20 ring-1 ring-sky-200/30',
    iconClass: 'text-white',
  },
  handshake: {
    containerClass: 'bg-gradient-to-br from-blue-300 to-blue-500 shadow-md shadow-blue-950/20 ring-1 ring-blue-200/30',
    iconClass: 'text-white',
  },
  tag: {
    containerClass: 'bg-gradient-to-br from-orange-300 to-orange-500 shadow-md shadow-orange-950/20 ring-1 ring-orange-200/30',
    iconClass: 'text-white',
  },
  badge_check: {
    containerClass: 'bg-gradient-to-br from-emerald-300 to-emerald-500 shadow-md shadow-emerald-950/20 ring-1 ring-emerald-200/30',
    iconClass: 'text-white',
  },
  list: {
    containerClass: 'bg-gradient-to-br from-violet-300 to-violet-500 shadow-md shadow-violet-950/20 ring-1 ring-violet-200/30',
    iconClass: 'text-white',
  },
  credit_card: {
    containerClass: 'bg-gradient-to-br from-cyan-300 to-cyan-500 shadow-md shadow-cyan-950/20 ring-1 ring-cyan-200/30',
    iconClass: 'text-white',
  },
  megaphone: {
    containerClass: 'bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-md shadow-yellow-950/20 ring-1 ring-yellow-200/30',
    iconClass: 'text-yellow-950',
  },
  building2: {
    containerClass: 'bg-gradient-to-br from-slate-300 to-slate-500 shadow-md shadow-slate-950/20 ring-1 ring-slate-200/30',
    iconClass: 'text-white',
  },
  shopping_cart: {
    containerClass: 'bg-gradient-to-br from-teal-300 to-teal-500 shadow-md shadow-teal-950/20 ring-1 ring-teal-200/30',
    iconClass: 'text-white',
  },
  grid3x3: {
    containerClass: 'bg-gradient-to-br from-lime-300 to-lime-500 shadow-md shadow-lime-950/20 ring-1 ring-lime-200/30',
    iconClass: 'text-lime-950',
  },
  calendar: {
    containerClass: 'bg-gradient-to-br from-rose-300 to-rose-500 shadow-md shadow-rose-950/20 ring-1 ring-rose-200/30',
    iconClass: 'text-white',
  },
  home: {
    containerClass: 'bg-white/25 ring-1 ring-white/30',
    iconClass: 'text-white',
  },
};

const DEFAULT_ICON_STYLE: HomeExploreCategoryIconStyle = {
  containerClass: 'bg-white/20 ring-1 ring-white/25',
  iconClass: 'text-white',
};

export function getHomeExploreCategoryIcon(iconKey?: string | null): LucideIcon {
  if (!iconKey) return DEFAULT_ICON;
  return HOME_EXPLORE_CATEGORY_ICONS[iconKey] ?? DEFAULT_ICON;
}

export function getHomeExploreCategoryIconStyle(iconKey?: string | null): HomeExploreCategoryIconStyle {
  if (!iconKey) return DEFAULT_ICON_STYLE;
  return HOME_EXPLORE_CATEGORY_ICON_STYLES[iconKey] ?? DEFAULT_ICON_STYLE;
}

/** @deprecated Use getHomeExploreCategoryIconStyle */
export function getHomeExploreCategoryIconColor(iconKey?: string | null): string {
  return getHomeExploreCategoryIconStyle(iconKey).iconClass;
}

/** @deprecated Use getHomeExploreCategoryIconStyle */
export function getHomeExploreCategoryIconContainerClass(iconKey?: string | null): string {
  return getHomeExploreCategoryIconStyle(iconKey).containerClass;
}
