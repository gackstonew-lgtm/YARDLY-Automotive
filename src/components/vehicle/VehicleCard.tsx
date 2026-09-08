import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Gauge, Fuel, Cog, Calendar, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Vehicle } from '../../types/database';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { VehicleCardCarousel } from './VehicleCardCarousel';
import { resolveVehicleImages } from '../../lib/utils/imageResolver';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const images = resolveVehicleImages(vehicle);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.12)] overflow-hidden shadow-md hover:shadow-glass-hover hover:border-[#0251B8]/50 dark:hover:border-[#2D7DFF]/50 transition-all duration-300 flex flex-col h-full hover-lift text-[#0F241C] dark:text-[#F2F7F3]"
    >
      {/* Interactive Image Header Container / Slideshow */}
      <VehicleCardCarousel vehicle={vehicle} images={images} />

      {/* Body Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Seller / Dealer */}
        <div className="text-xs font-bold text-[#0251B8] dark:text-[#2D7DFF] mb-1">
          {vehicle.dealer_name || (vehicle.seller_type === 'dealer' ? 'Verified Car Yard' : 'Private Seller')}
        </div>

        {/* Title */}
        <h3 className="text-lg font-extrabold text-[#0F241C] dark:text-[#F2F7F3] group-hover:text-[#0251B8] dark:group-hover:text-[#2D7DFF] transition-colors line-clamp-1">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
        <p className="text-xs text-[#5F7E71] dark:text-[#8EA79C] line-clamp-1 mb-4">
          {vehicle.variant || `${vehicle.engine_cc}cc • ${vehicle.drive_type || '2WD'}`}
        </p>

        {/* Specs Pill Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-[#0F241C] dark:text-[#F2F7F3] bg-[#F4F8F6] dark:bg-[#0A0A0A] p-2.5 rounded-xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.1)] mb-4">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-[#0251B8] dark:text-[#2D7DFF] shrink-0" />
            <span className="font-bold truncate">{vehicle.mileage.toLocaleString()} KM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cog className="w-3.5 h-3.5 text-[#0251B8] dark:text-[#2D7DFF] shrink-0" />
            <span className="font-bold truncate">{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-[#0251B8] dark:text-[#2D7DFF] shrink-0" />
            <span className="font-bold truncate">{vehicle.fuel_type}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#0251B8] dark:text-[#2D7DFF] shrink-0" />
            <span className="font-bold truncate">{vehicle.year}</span>
          </div>
        </div>

        {/* Price & Actions Row */}
        <div className="mt-auto pt-2 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.1)] flex items-center justify-between gap-2">
          <div className="min-w-0 shrink">
            <div className="text-[10px] uppercase font-bold text-[#5F7E71] dark:text-[#8EA79C]">Cash Price</div>
            <div className="text-base sm:text-lg font-black text-[#0251B8] dark:text-[#2D7DFF] truncate">
              KES {vehicle.price.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link to={`/vehicles/${vehicle.id}`}>
              <Button size="sm" variant="outline" className="px-2.5 sm:px-3 text-xs active:scale-95 transition-transform">
                Details
              </Button>
            </Link>
            <Link to={`/vehicles/${vehicle.id}`}>
              <Button size="sm" variant="primary" className="px-2.5 sm:px-3 text-xs active:scale-95 transition-transform btn-glow">
                Reserve
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
