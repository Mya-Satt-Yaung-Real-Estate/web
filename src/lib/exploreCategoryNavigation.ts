/**
 * Resolve an explore category destination to a browser-ready URL.
 */
export function resolveExploreCategoryHref(href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      return new URL(trimmed).toString();
    } catch {
      return null;
    }
  }

  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${window.location.origin}${path}`;
}

/** @deprecated Use resolveExploreCategoryHref with target="_blank" instead */
export function navigateExploreCategoryLink(
  href: string,
  _navigate: (to: string) => void,
): void {
  const url = resolveExploreCategoryHref(href);
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
}
