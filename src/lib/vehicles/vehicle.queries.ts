export interface VehicleFilterParams {
  make?: string;
  model?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  bodyType?: string;
  transmission?: string;
  fuelType?: string;
  verifiedOnly?: boolean;
  featuredOnly?: boolean;
  status?: string;
  sortBy?: 'newest' | 'price_low' | 'price_high' | 'mileage_low';
  limit?: number;
  offset?: number;
}
