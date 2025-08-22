"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Heart,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  thumbnail?: string;
}

interface MobileImageGalleryProps {
  images: GalleryImage[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  showThumbnails?: boolean;
  allowDownload?: boolean;
  allowShare?: boolean;
  className?: string;
}

export function MobileImageGallery({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
  showThumbnails = true,
  allowDownload = true,
  allowShare = true,
  className
}: MobileImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const constraintsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const currentImage = images[currentIndex];

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsZoomed(false);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [showControls]);

  const showControlsTemporarily = () => {
    setShowControls(true);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    resetZoom();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    resetZoom();
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsZoomed(false);
  };

  const zoomIn = () => {
    const newScale = Math.min(scale * 1.5, 4);
    setScale(newScale);
    setIsZoomed(newScale > 1);
  };

  const zoomOut = () => {
    const newScale = Math.max(scale / 1.5, 1);
    setScale(newScale);
    setIsZoomed(newScale > 1);
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleShare = async () => {
    if (navigator.share && currentImage) {
      try {
        await navigator.share({
          title: currentImage.alt,
          text: currentImage.caption || currentImage.alt,
          url: currentImage.src
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  const handleDownload = () => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage.src;
      link.download = currentImage.alt || `image-${currentIndex + 1}`;
      link.click();
    }
  };

  const handleDoubleTap = () => {
    if (isZoomed) {
      resetZoom();
    } else {
      zoomIn();
    }
  };

  const handlePan = (event: any, info: PanInfo) => {
    if (scale > 1) {
      setPosition({
        x: position.x + info.delta.x,
        y: position.y + info.delta.y
      });
    }
  };

  const handleSwipe = (event: any, info: PanInfo) => {
    if (scale === 1 && Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col",
        className
      )}
      onClick={showControlsTemporarily}
    >
      {/* Header */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent"
          >
            <div className="flex items-center justify-between p-4 pt-8">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-black/50 text-white">
                  {currentIndex + 1} / {images.length}
                </Badge>
                {currentImage.caption && (
                  <span className="text-white text-sm max-w-[200px] truncate">
                    {currentImage.caption}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                {allowShare && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 h-10 w-10 p-0"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                )}
                
                {allowDownload && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 h-10 w-10 p-0"
                    onClick={handleDownload}
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-10 w-10 p-0"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Image Area */}
      <div className="flex-1 relative overflow-hidden" ref={constraintsRef}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex items-center justify-center"
            ref={imageRef}
          >
            <motion.div
              drag={scale > 1}
              dragConstraints={constraintsRef}
              dragElastic={0.1}
              dragMomentum={false}
              onPan={handlePan}
              onPanEnd={handleSwipe}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              style={{
                scale,
                x: position.x,
                y: position.y,
              }}
              className="relative max-w-full max-h-full cursor-grab active:cursor-grabbing"
              onDoubleClick={handleDoubleTap}
            >
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain"
                onLoadingComplete={() => setImageLoaded(true)}
                priority
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <AnimatePresence>
              {showControls && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Bottom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent"
          >
            <div className="p-4 pb-8">
              {/* Zoom Controls */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-10 px-3"
                  onClick={zoomOut}
                  disabled={scale <= 1}
                >
                  <ZoomOut className="h-4 w-4 mr-1" />
                  <span className="text-xs">Зменшити</span>
                </Button>

                <Badge variant="secondary" className="bg-black/50 text-white px-3">
                  {Math.round(scale * 100)}%
                </Badge>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-10 px-3"
                  onClick={zoomIn}
                  disabled={scale >= 4}
                >
                  <ZoomIn className="h-4 w-4 mr-1" />
                  <span className="text-xs">Збільшити</span>
                </Button>

                {isZoomed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 h-10 px-3"
                    onClick={resetZoom}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    <span className="text-xs">Скинути</span>
                  </Button>
                )}
              </div>

              {/* Thumbnails */}
              {showThumbnails && images.length > 1 && (
                <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => {
                        setCurrentIndex(index);
                        resetZoom();
                      }}
                      className={cn(
                        "relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                        index === currentIndex
                          ? "border-white shadow-lg"
                          : "border-transparent opacity-60 hover:opacity-80"
                      )}
                    >
                      <Image
                        src={image.thumbnail || image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
          />
        </div>
      )}
    </motion.div>
  );
}