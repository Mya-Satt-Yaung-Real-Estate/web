import { useEffect, useMemo, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/ImageWithFallback';

type GalleryImage = {
    id: number;
    filename: string;
    url: string; // large image
    thumbnail_url?: string; // small
};

interface MediaGalleryProps {
    images: GalleryImage[];
    title?: string;
    className?: string;
    cardClassName?: string;
    initialIndex?: number;
}

export function MediaGallery({
    images,
    title = 'Media',
    className = '',
    cardClassName = 'w-full md:w-3/5 mx-auto',
    initialIndex = 0,
}: MediaGalleryProps) {
    const safeImages = useMemo(() => (Array.isArray(images) ? images : []), [images]);
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    useEffect(() => {
        if (activeIndex >= safeImages.length) {
            setActiveIndex(0);
        }
    }, [safeImages.length, activeIndex]);

    const active = safeImages.length > 0 ? safeImages[activeIndex] : null;

    if (!safeImages.length) return null;

    return (
        <Card className={`shadow-lg mb-6 ${cardClassName} ${className}`}>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-2 md:p-4 space-y-3">
                {active && (
                    <div className="w-full relative">
                        <button
                            type="button"
                            onClick={() => setIsLightboxOpen(true)}
                            aria-label="Open fullscreen"
                            className="absolute top-2 right-2 z-10 inline-flex items-center justify-center h-8 w-8 rounded-md bg-black/50 text-white hover:bg-black/60 transition-colors"
                        >
                            <Maximize2 className="h-4 w-4" />
                        </button>
                        <ImageWithFallback
                            key={active.id}
                            src={active.url}
                            alt={active.filename}
                            className="w-full h-64 md:h-96 object-cover rounded cursor-zoom-in"
                            onClick={() => setIsLightboxOpen(true)}
                        />
                    </div>
                )}

                {safeImages.length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                        {safeImages.map((img, idx) => (
                            <button
                                key={img.id}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveIndex(idx);
                                }}
                                className={`relative rounded overflow-hidden border ${
                                    activeIndex === idx ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'
                                }`}
                                aria-label={`Preview image ${idx + 1}`}
                            >
                                <ImageWithFallback
                                    src={img.thumbnail_url || img.url}
                                    alt={img.filename}
                                    className="w-full h-16 sm:h-20 object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </CardContent>
            <MediaLightbox open={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} src={active?.url || ''} alt={active?.filename || ''} />
        </Card>
    );
}

export default MediaGallery;

// Lightbox overlay
export function MediaLightbox({
    open,
    onClose,
    src,
    alt,
}: { open: boolean; onClose: () => void; src: string; alt: string }) {
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={onClose}
        >
            <img
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}


