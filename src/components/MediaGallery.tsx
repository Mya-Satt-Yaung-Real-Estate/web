import { useEffect, useMemo, useState } from 'react';
import { Maximize2, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/ImageWithFallback';

type GalleryImage = {
    id: number;
    filename: string;
    url: string; // large image or video
    thumbnail_url?: string; // small
    type?: string; // 'image' | 'video' | 'document' | 'audio'
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

    const handlePrevious = () => {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : safeImages.length - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev < safeImages.length - 1 ? prev + 1 : 0));
    };

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

                        {safeImages.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handlePrevious();
                                    }}
                                    aria-label="Previous image"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                                >
                                    <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleNext();
                                    }}
                                    aria-label="Next image"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                                >
                                    <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
                                </button>
                            </>
                        )}

                        {active.type === 'video' ? (
                            <video
                                key={active.id}
                                src={active.url}
                                controls
                                playsInline
                                {...({ webkitPlaysInline: true } as React.VideoHTMLAttributes<HTMLVideoElement>)}
                                className="w-full h-64 md:h-96 object-contain rounded bg-black"
                                preload="metadata"
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <ImageWithFallback
                                key={active.id}
                                src={active.url}
                                alt={active.filename}
                                className="w-full h-64 md:h-96 object-cover rounded cursor-zoom-in"
                                onClick={() => setIsLightboxOpen(true)}
                            />
                        )}
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
                                aria-label={`Preview ${img.type === 'video' ? 'video' : 'image'} ${idx + 1}`}
                            >
                                {img.type === 'video' ? (
                                    <div className="w-full h-16 sm:h-20 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center relative">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                                                <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white ml-0.5" fill="white" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <ImageWithFallback
                                        src={img.thumbnail_url || img.url}
                                        alt={img.filename}
                                        className="w-full h-16 sm:h-20 object-cover"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </CardContent>
            <MediaLightbox 
                open={isLightboxOpen} 
                onClose={() => setIsLightboxOpen(false)} 
                src={active?.url || ''} 
                alt={active?.filename || ''}
                type={active?.type || 'image'}
            />
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
    type = 'image',
}: { open: boolean; onClose: () => void; src: string; alt: string; type?: string }) {
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
            {type === 'video' ? (
                <video
                    src={src}
                    controls
                    autoPlay
                    playsInline
                    {...({ webkitPlaysInline: true } as React.VideoHTMLAttributes<HTMLVideoElement>)}
                    className="max-w-full max-h-full object-contain"
                    onClick={(e) => e.stopPropagation()}
                >
                    Your browser does not support the video tag.
                </video>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    className="max-w-full max-h-full object-contain"
                    onClick={(e) => e.stopPropagation()}
                />
            )}
        </div>
    );
}


