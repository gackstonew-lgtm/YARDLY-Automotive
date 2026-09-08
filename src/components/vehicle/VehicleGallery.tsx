import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from 'lucide-react';
import { VehicleImage } from '../../types/database';
import { normalizeImageUrl } from '../../lib/utils/imageResolver';

interface VehicleGalleryProps {
  images: VehicleImage[];
  altTitle: string;
  className?: string;
}

export const VehicleGallery: React.FC<VehicleGalleryProps> = ({
  images,
  altTitle,
  className = ''
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className={`w-full aspect-[16/10] bg-[#121212] rounded-3xl border border-[rgba(255, 255, 255,0.15)] flex flex-col items-center justify-center text-[#8EA79C] p-6 ${className}`}>
        <ImageIcon className="w-12 h-12 text-[#2D7DFF] mb-2 opacity-60" />
        <span className="text-xs font-bold uppercase tracking-wider text-[#F2F7F3]">Photography Under Verification</span>
        <span className="text-[11px] text-[#8EA79C] mt-1 text-center">Images for this unit are being processed by Yardly Automotives Inspectors.</span>
      </div>
    );
  }

  const currentImg = images[selectedIndex] || images[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Mobile swipe gesture handler
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  return (
    <div className={`space-y-3.5 select-none ${className}`}>
      
      {/* Primary Main Image Container */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#0A0A0A] rounded-3xl overflow-hidden shadow-xl border border-[rgba(255, 255, 255,0.15)] group">
        
        {/* Animated Image Display with Touch Swipe Support */}
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedIndex}
            src={normalizeImageUrl(currentImg.image_url)}
            alt={currentImg.alt_text || `${altTitle} Photo ${selectedIndex + 1}`}
            initial={{ opacity: 0.4, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.4 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            onClick={() => setLightboxOpen(true)}
            className="w-full h-full object-cover cursor-zoom-in"
            loading="lazy"
          />
        </AnimatePresence>

        {/* Top Floating Overlay Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <div className="bg-[#050505]/85 backdrop-blur-md text-[#F2F7F3] text-[11px] font-extrabold px-3 py-1.5 rounded-full border border-[rgba(255, 255, 255,0.2)] shadow flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#2D7DFF]" />
            <span>Photo {selectedIndex + 1} of {images.length}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(true);
            }}
            aria-label="View Fullscreen Lightbox"
            className="pointer-events-auto w-9 h-9 rounded-full bg-[#050505]/80 hover:bg-[#2D7DFF] hover:text-[#050505] backdrop-blur-md text-[#F2F7F3] border border-[rgba(255, 255, 255,0.2)] flex items-center justify-center transition-all shadow active:scale-95"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Previous & Next Desktop Arrow Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Photograph"
              className="absolute left-3 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] rounded-full bg-[#050505]/70 hover:bg-[#2D7DFF] hover:text-[#050505] text-[#F2F7F3] backdrop-blur-md border border-[rgba(255, 255, 255,0.2)] flex items-center justify-center transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 shadow-md active:scale-95 z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Photograph"
              className="absolute right-3 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] rounded-full bg-[#050505]/70 hover:bg-[#2D7DFF] hover:text-[#050505] text-[#F2F7F3] backdrop-blur-md border border-[rgba(255, 255, 255,0.2)] flex items-center justify-center transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 shadow-md active:scale-95 z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

      </div>

      {/* Thumbnail Strip Container */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-[#242424] max-w-full">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-[#2D7DFF] ring-2 ring-[#2D7DFF]/40 scale-[1.02] shadow-md'
                  : 'border-[rgba(255, 255, 255,0.15)] opacity-60 hover:opacity-100 hover:border-[#2D7DFF]'
              }`}
            >
              <img
                src={normalizeImageUrl(img.image_url)}
                alt={img.alt_text || `${altTitle} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {idx === 0 && (
                <span className="absolute bottom-0 inset-x-0 bg-[#2D7DFF] text-[#050505] text-[8px] font-extrabold uppercase py-0.5 text-center leading-none">
                  Hero
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox / Fullscreen Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close Lightbox"
            className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-[#2D7DFF] hover:text-[#050505] text-white border border-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl w-full max-h-[85vh] flex items-center justify-center">
            <img
              src={normalizeImageUrl(currentImg.image_url)}
              alt={currentImg.alt_text || altTitle}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#050505]/80 hover:bg-[#2D7DFF] hover:text-[#050505] text-white border border-white/20 flex items-center justify-center transition-all"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#050505]/80 hover:bg-[#2D7DFF] hover:text-[#050505] text-white border border-white/20 flex items-center justify-center transition-all"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#050505]/85 backdrop-blur-md text-[#F2F7F3] text-xs font-bold px-4 py-2 rounded-full border border-[rgba(255, 255, 255,0.2)]">
            {selectedIndex + 1} / {images.length} — {altTitle}
          </div>
        </div>
      )}

    </div>
  );
};
