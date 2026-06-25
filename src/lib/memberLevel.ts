export type MemberLevel = 'basic' | 'bronze' | 'silver' | 'gold' | 'premium';

const MEMBER_LEVEL_SET = new Set<string>(['basic', 'bronze', 'silver', 'gold', 'premium']);

/** Normalize API values (legacy platinum → premium). */
export function normalizeMemberLevel(level?: string | null): MemberLevel | null {
  if (!level) return null;
  const normalized = level.toLowerCase();
  if (normalized === 'platinum') return 'premium';
  if (MEMBER_LEVEL_SET.has(normalized)) return normalized as MemberLevel;
  return null;
}

export function getMemberLevelBadgeClass(level?: string | null): string {
  switch (normalizeMemberLevel(level)) {
    case 'basic':
      return 'bg-slate-100 text-slate-700 border-slate-300';
    case 'bronze':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'silver':
      return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'gold':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'premium':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    default:
      return 'bg-muted text-foreground border-border';
  }
}

export function formatMemberLevelLabel(level?: string | null): string {
  const normalized = normalizeMemberLevel(level);
  if (!normalized) return level ? level.charAt(0).toUpperCase() + level.slice(1).toLowerCase() : '';
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}
