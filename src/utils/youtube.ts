export function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const videoId = parsedUrl.pathname.split('/').filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0` : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsedUrl.pathname === '/watch') {
        const videoId = parsedUrl.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0` : null;
      }

      const embedMatch = parsedUrl.pathname.match(/^\/embed\/([^/?]+)/);
      if (embedMatch?.[1]) {
        return `https://www.youtube.com/embed/${embedMatch[1]}?modestbranding=1&rel=0`;
      }

      const shortsMatch = parsedUrl.pathname.match(/^\/shorts\/([^/?]+)/);
      if (shortsMatch?.[1]) {
        return `https://www.youtube.com/embed/${shortsMatch[1]}?modestbranding=1&rel=0`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function formatYoutubeViewCount(count: number | null | undefined): string {
  const value = count ?? 0;
  const formattedValue = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

  return `${formattedValue} views`;
}
