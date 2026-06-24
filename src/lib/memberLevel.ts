export type MemberLevel = 'basic' | 'silver' | 'gold' | 'premium' | 'bronze' | 'platinum';

export function getMemberLevelBadgeClass(level?: string | null): string {
  switch (level?.toLowerCase()) {
    case 'basic':
      return 'bg-slate-100 text-slate-700 border-slate-300';
    case 'silver':
      return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'gold':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'premium':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'bronze':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'platinum':
      return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    default:
      return 'bg-muted text-foreground border-border';
  }
}

export function formatMemberLevelLabel(level?: string | null): string {
  if (!level) return '';
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
}
