import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { ShieldCheck, MapPin, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Vehicle, VehicleImage } from '../../types/database';
import { Badge } from '../ui/Badge';
import { VehicleImageWithFallback } from '../ui/VehicleImageWithFallback';
import { getVehiclePrimaryImage, normalizeImageUrl } from '../../lib/utils/imageResolver';

interface VehicleCardCarouselProps {
  vehicle: Vehicle;
  images: VehicleImage[];
  priority?: boolean;
}

const VehicleCardCarouselComponent: React.FC<VehicleCardCarouselProps> = ({ 
  vehicle, 
  images,
  priority = false 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(() => new Set());
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(() => new Set());
  const [isInView, setIsInView] = useState<boolean>(() => Boolean(priority));
  const [hasInteracted, setHasInteracted] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const validImages = useMemo(() => (images && images.length > 0 ? images : []), [images]);
  const hasMultipleImages = validImages.length > 1;

  // Viewport visibility observer to prevent background thrashing
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '200px 0px', threshold: 0.01 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Detect reduced-motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Auto-play sequential advance
  const nextSlide = useCallback(() => {
    if (!hasMultipleImages) return;
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  }, [hasMultipleImages, validImages.length]);

  const prevSlide = useCallback(() => {
    if (!hasMultipleImages) return;
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  }, [hasMultipleImages, validImages.length]);

  // Preload adjacent images ONLY when visible in viewport
  useEffect(() => {
    if (!hasMultipleImages || !isInView) return;
    const prevIdx = (currentIndex - 1 + validImages.length) % validImages.length;
    const nextIdx = (currentIndex + 1) % validImages.length;

    [prevIdx, nextIdx].forEach((idx) => {
      const imgObj = validImages[idx];
      if (imgObj?.image_url && !failedImageIds.has(imgObj.id || '')) {
        const img = new Image();
        img.src = normalizeImageUrl(imgObj.image_url);
      }
    });
  }, [currentIndex, hasMultipleImages, validImages, failedImageIds, isInView]);

  // Auto-play timer (Active only when visible in viewport and not paused/dragged)
  useEffect(() => {
    if (!hasMultipleImages || isPaused || isDragging || !isInView) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 3500);

    return () => clearInterval(timer);
  }, [hasMultipleImages, isPaused, isDragging, isInView, nextSlide]);

  // Pause & delayed resume on interaction
  const pauseAndScheduleResume = useCallback(() => {
    setIsPaused(true);
    setHasInteracted(true);
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 4000);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  // Desktop arrow click handlers
  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    pauseAndScheduleResume();
    prevSlide();
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    pauseAndScheduleResume();
    nextSlide();
  };

  // Touch & Pointer Gesture Handling (Real-Time Dragging)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!hasMultipleImages) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    touchStartX.current = e.clientX;
    touchStartY.current = e.clientY;
    setIsDragging(true);
    setDragOffsetX(0);
    setIsPaused(true);
    setHasInteracted(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.clientX - touchStartX.current;
    const deltaY = e.clientY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setDragOffsetX(deltaX);
    }
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const containerWidth = containerRef.current?.offsetWidth || 300;
    const threshold = Math.min(containerWidth * 0.15, 45);

    if (dragOffsetX < -threshold) {
      nextSlide();
    } else if (dragOffsetX > threshold) {
      prevSlide();
    }

    touchStartX.current = null;
    touchStartY.current = null;
    setIsDragging(false);
    setDragOffsetX(0);
    pauseAndScheduleResume();
  };

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!hasMultipleImages) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      pauseAndScheduleResume();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      pauseAndScheduleResume();
      nextSlide();
    }
  };

  // Image load error fallback handler
  const handleImageError = (imgId: string) => {
    setFailedImageIds((prev) => new Set(prev).add(imgId));
  };

  const handleImageLoad = (idx: number) => {
    setLoadedIndices((prev) => new Set(prev).add(idx));
  };

  // If single image or no images, render optimized static container
  if (!hasMultipleImages) {
    const singleImg = validImages[0] || getVehiclePrimaryImage(vehicle);
    return (
      <div 
        ref={containerRef}
        className="relative aspect-[16/10] overflow-hidden bg-[#0A0A0A] select-none"
      >
        <VehicleImageWithFallback
          image={singleImg}
          make={vehicle.make}
          model={vehicle.model}
          year={vehicle.year}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          priority={priority}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10 pointer-events-none">
          {vehicle.verification_status === 'verified' && (
            <Badge variant="verified" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified Listing
            </Badge>
          )}
          {vehicle.featured && (
            <Badge variant="warning" size="sm">
              Featured
            </Badge>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="bg-[#050505]/85 backdrop-blur-md text-[#F2F7F3] border border-[rgba(255, 255, 255,0.15)] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <MapPin className="w-3 h-3 text-[#2D7DFF]" />
            <span>{vehicle.location}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="Save to favorites"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#121212]/80 backdrop-blur-md border border-[rgba(255, 255, 255,0.15)] flex items-center justify-center text-[#8EA79C] hover:text-red-400 hover:bg-[#1A1A1A] active:scale-90 transition-all z-20 shadow-xs"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Sliding track transform style
  const transitionStyle = isDragging
    ? 'none'
    : prefersReducedMotion
    ? 'none'
    : 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)';

  const transformStyle = `translate3d(calc(${-currentIndex * 100}% + ${dragOffsetX}px), 0, 0)`;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => {
        setIsPaused(true);
        setHasInteracted(true);
      }}
      onMouseLeave={() => setIsPaused(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      className="relative aspect-[16/10] overflow-hidden bg-[#0A0A0A] touch-pan-y select-none group/carousel focus:outline-none"
    >
      {/* Physical GPU-Accelerated Sliding Track */}
      <div
        className="flex w-full h-full"
        style={{
          transform: transformStyle,
          transition: transitionStyle,
          willChange: 'transform',
        }}
      >
        {validImages.map((img, idx) => {
          const isFailed = img.id ? failedImageIds.has(img.id) : false;
          const isCurrentOrAdjacent = 
            idx === currentIndex || 
            idx === (currentIndex - 1 + validImages.length) % validImages.length || 
            idx === (currentIndex + 1) % validImages.length;
          
          const shouldRenderImage = isCurrentOrAdjacent || hasInteracted || idx === 0;
          const isLoaded = loadedIndices.has(idx);

          return (
            <div key={img.id || idx} className="w-full h-full shrink-0 flex-none relative aspect-[16/10] bg-[#0A0A0A]">
              {isFailed ? (
                <VehicleImageWithFallback
                  image={null}
                  make={vehicle.make}
                  model={vehicle.model}
                  year={vehicle.year}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
              ) : shouldRenderImage ? (
                <img
                  src={normalizeImageUrl(img.image_url)}
                  alt={img.alt_text || `${vehicle.year} ${vehicle.make} ${vehicle.model} - Photo ${idx + 1}`}
                  onLoad={() => handleImageLoad(idx)}
                  onError={() => img.id && handleImageError(img.id)}
                  className={`w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-500 ease-out pointer-events-none ${
                    isLoaded || (idx === 0 && priority) ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading={idx === 0 && priority ? 'eager' : 'lazy'}
                  decoding="async"
                  {...(idx === 0 && priority ? { fetchPriority: 'high' } : { fetchPriority: 'auto' })}
                />
              ) : (
                <div className="w-full h-full bg-[#0A0A0A]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop Arrow Navigation */}
      <button
        type="button"
        onClick={handlePrevClick}
        aria-label="Previous image"
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#050505]/70 hover:bg-[#2D7DFF] hover:text-[#050505] text-[#F2F7F3] backdrop-blur-md border border-[rgba(255, 255, 255,0.2)] flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 z-20 active:scale-90 shadow-md"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={handleNextClick}
        aria-label="Next image"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#050505]/70 hover:bg-[#2D7DFF] hover:text-[#050505] text-[#F2F7F3] backdrop-blur-md border border-[rgba(255, 255, 255,0.2)] flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 z-20 active:scale-90 shadow-md"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Top Overlay Badges */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10 pointer-events-none">
        {vehicle.verification_status === 'verified' && (
          <Badge variant="verified" size="sm">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Verified Listing
          </Badge>
        )}
        {vehicle.featured && (
          <Badge variant="warning" size="sm">
            Featured
          </Badge>
        )}
      </div>

      {/* Location Tag & Image Counter */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-[#050505]/85 backdrop-blur-md text-[#F2F7F3] border border-[rgba(255, 255, 255,0.15)] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
          <MapPin className="w-3 h-3 text-[#2D7DFF]" />
          <span>{vehicle.location}</span>
        </div>

        <div className="bg-[#121212]/90 backdrop-blur-md text-[#2D7DFF] text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-[rgba(255, 255, 255,0.2)] shadow-md tracking-tight">
          {currentIndex + 1} / {validImages.length}
        </div>
      </div>

      {/* Favorite Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        aria-label="Save to favorites"
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#121212]/80 backdrop-blur-md border border-[rgba(255, 255, 255,0.15)] flex items-center justify-center text-[#8EA79C] hover:text-red-400 hover:bg-[#1A1A1A] active:scale-90 transition-all z-20 shadow-xs"
      >
        <Heart className="w-4 h-4" />
      </button>
    </div>
  );
};

export const VehicleCardCarousel = memo(VehicleCardCarouselComponent);

