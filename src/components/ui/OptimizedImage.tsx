"use client";

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  className?: string;
  containerClassName?: string;
  loading?: 'lazy' | 'eager';
  unoptimized?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallback?: string;
  aspectRatio?: 'square' | '16:9' | '4:3' | '3:2' | '21:9' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  showLoader?: boolean;
  style?: React.CSSProperties;
}

const aspectRatioClasses = {
  'square': 'aspect-square',
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '3:2': 'aspect-[3/2]',
  '21:9': 'aspect-[21/9]',
  'auto': ''
};

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  className,
  containerClassName,
  loading = 'lazy',
  unoptimized = false,
  onLoad,
  onError,
  fallback = '/images/placeholder.jpg',
  aspectRatio = 'auto',
  objectFit = 'cover',
  showLoader = true,
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    if (imageSrc !== fallback) {
      setImageSrc(fallback);
    }
    onError?.();
  }, [onError, imageSrc, fallback]);

  // Generate blur data URL for better UX
  const generateBlurDataURL = (w: number = 10, h: number = 10) => {
    if (blurDataURL) return blurDataURL;
    
    // Simple base64 blur placeholder
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <animate attributeName="fill" values="#f3f4f6;#e5e7eb;#f3f4f6" dur="2s" repeatCount="indefinite"/>
      </svg>`
    ).toString('base64')}`;
  };

  const imageProps = {
    src: imageSrc,
    alt,
    loading: priority ? 'eager' as const : loading,
    priority,
    quality,
    unoptimized,
    onLoad: handleLoad,
    onError: handleError,
    className: cn(
      'transition-opacity duration-300',
      isLoading && 'opacity-0',
      !isLoading && 'opacity-100',
      objectFit === 'cover' && 'object-cover',
      objectFit === 'contain' && 'object-contain',
      objectFit === 'fill' && 'object-fill',
      objectFit === 'none' && 'object-none',
      objectFit === 'scale-down' && 'object-scale-down',
      className
    ),
    placeholder: placeholder === 'blur' ? 'blur' as const : 'empty' as const,
    ...(placeholder === 'blur' && {
      blurDataURL: generateBlurDataURL(width, height)
    }),
    style,
    ...props
  };

  if (fill) {
    return (
      <div className={cn(
        'relative overflow-hidden',
        aspectRatio && aspectRatioClasses[aspectRatio],
        containerClassName
      )}>
        <Image
          {...imageProps}
          fill
          sizes={sizes}
        />
        
        {/* Loading placeholder */}
        {isLoading && showLoader && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Error state */}
        {hasError && imageSrc === fallback && (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">Зображення недоступне</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative', containerClassName)}>
      <Image
        {...imageProps}
        width={width}
        height={height}
        sizes={sizes}
      />
      
      {/* Loading placeholder */}
      {isLoading && showLoader && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Error state */}
      {hasError && imageSrc === fallback && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Зображення недоступне</p>
          </div>
        </div>
      )}
    </div>
  );
}