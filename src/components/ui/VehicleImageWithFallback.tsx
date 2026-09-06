import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { VehicleImage } from '../../types/database';

interface VehicleImageWithFallbackProps {
  image?: VehicleImage | null;
  make: string;
  model: string;
  year: number;
  alt?: string;
  className?: string;
  aspectRatio?: string;
}

export const VehicleImageWithFallback: React.FC<VehicleImageWithFallbackProps> = ({
  image,
  make,
  model,
  year,
  alt,
  className = '',
  aspectRatio = 'aspect-[16/10]'
}) => {
  const [imageError, setImageError] = useState(false);

  const rawSrc = image?.image_url || null;
  const isAuthorized = Boolean(rawSrc && rawSrc.trim() !== '' && !imageError);

  if (isAuthorized && rawSrc) {
    return (
      <img
        src={rawSrc}
        alt={alt || `${year} ${make} ${model}`}
        className={className}
        loading="lazy"
        onError={() => setImageError(true)}
      />
    );
  }

  // Branded "Photo Coming Soon" fallback state
  return (
    <div className={`w-full h-full bg-gradient-to-br from-[#001711] via-[#002B1F] to-[#003D2D] text-[#F2F7F3] flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-[#001A13]/80 backdrop-blur-md border border-[rgba(180,255,210,0.15)] flex items-center justify-center mb-3 shadow-inner">
        <Camera className="w-6 h-6 text-[#00E878]" />
      </div>
      <div className="font-extrabold text-sm tracking-tight text-[#F2F7F3]">{year} {make} {model}</div>
      <div className="text-[11px] font-semibold text-[#8EA79C] mt-0.5">Verified Listing</div>
      <div className="mt-3 px-3 py-1 rounded-full bg-[#00E878]/10 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-[#00E878] border border-[#00E878]/30">
        Photo Coming Soon
      </div>
    </div>
  );
};
