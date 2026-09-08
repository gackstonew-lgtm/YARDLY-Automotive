import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { VehicleImage } from '../../types/database';
import { normalizeImageUrl } from '../../lib/utils/imageResolver';

interface VehicleImageWithFallbackProps {
  image?: VehicleImage | null;
  make: string;
  model: string;
  year: number;
  alt?: string;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
}

export const VehicleImageWithFallback: React.FC<VehicleImageWithFallbackProps> = ({
  image,
  make,
  model,
  year,
  alt,
  className = '',
  aspectRatio = 'aspect-[16/10]',
  priority = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const rawSrc = image?.image_url || null;
  const isAuthorized = Boolean(rawSrc && rawSrc.trim() !== '' && !imageError);

  if (isAuthorized && rawSrc) {
    return (
      <img
        src={normalizeImageUrl(rawSrc)}
        alt={alt || `${year} ${make} ${model}`}
        className={`${className} transition-opacity duration-300 ease-out ${
          isLoaded || priority ? 'opacity-100' : 'opacity-0'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' } : { fetchPriority: 'auto' })}
        onLoad={() => setIsLoaded(true)}
        onError={() => setImageError(true)}
      />
    );
  }

  // Branded "Photo Coming Soon" fallback state
  return (
    <div className={`w-full h-full bg-gradient-to-br from-[#0A0A0A] via-[#121212] to-[#1A1A1A] text-[#F2F7F3] flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-[#050505]/80 backdrop-blur-md border border-[rgba(255, 255, 255,0.15)] flex items-center justify-center mb-3 shadow-inner">
        <Camera className="w-6 h-6 text-[#2D7DFF]" />
      </div>
      <div className="font-extrabold text-sm tracking-tight text-[#F2F7F3]">{year} {make} {model}</div>
      <div className="text-[11px] font-semibold text-[#8EA79C] mt-0.5">Verified Listing</div>
      <div className="mt-3 px-3 py-1 rounded-full bg-[#2D7DFF]/10 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-[#2D7DFF] border border-[#2D7DFF]/30">
        Photo Coming Soon
      </div>
    </div>
  );
};

