import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, RefreshCw, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/navigation/Navbar';
import { PopularBrandsBar } from '../components/brand/PopularBrandsBar';
import { VehicleCard } from '../components/vehicle/VehicleCard';
import { VehicleService } from '../lib/vehicles/vehicle.service';
import { RealtimeService } from '../lib/realtime/realtime.service';
import { Vehicle, FuelType, TransmissionType, BodyType } from '../types/database';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Reveal } from '../components/motion/Reveal';
import { useSEO } from '../lib/hooks/useSEO';
import { siteConfig } from '../config/site';

export const BuyCars: React.FC = () => {
  useSEO({
    title: 'Available Vehicles & Cars for Sale in Kenya',
    description: 'Browse verified quality cars for sale in Kenya. Filter by make, model, price, transmission, and body type with Yardly Automotives.',
    canonical: `${siteConfig.url}/buy`
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States
  const [make, setMake] = useState(searchParams.get('make') || '');
  const [model, setModel] = useState(searchParams.get('model') || '');
  const [bodyType, setBodyType] = useState<BodyType | ''>((searchParams.get('bodyType') as BodyType) || '');
  const [transmission, setTransmission] = useState<TransmissionType | ''>((searchParams.get('transmission') as TransmissionType) || '');
  const [fuelType, setFuelType] = useState<FuelType | ''>((searchParams.get('fuelType') as FuelType) || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  // Load Vehicles based on filters & subscribe to multi-device Realtime updates
  useEffect(() => {
    async function loadFilteredVehicles() {
      setLoading(true);
      try {
        const filters = {
          make: make || undefined,
          model: model || undefined,
          bodyType: bodyType || undefined,
          body_type: bodyType || undefined,
          transmission: transmission || undefined,
          fuelType: fuelType || undefined,
          fuel_type: fuelType || undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          sortBy: (sortBy === 'price_asc' ? 'price_low' : sortBy === 'price_desc' ? 'price_high' : sortBy === 'mileage_asc' ? 'mileage_low' : 'newest') as 'newest' | 'price_low' | 'price_high' | 'mileage_low',
        };

        // Sync with browser URL search parameters
        const newParams: Record<string, string> = {};
        if (make) newParams.make = make;
        if (model) newParams.model = model;
        if (bodyType) newParams.bodyType = bodyType;
        if (transmission) newParams.transmission = transmission;
        if (fuelType) newParams.fuelType = fuelType;
        if (minPrice) newParams.minPrice = minPrice;
        if (maxPrice) newParams.maxPrice = maxPrice;
        if (sortBy) newParams.sortBy = sortBy;
        setSearchParams(newParams, { replace: true });

        const results = await VehicleService.filterVehicles(filters);
        setVehicles(results);
      } catch (err) {
        console.error('Error fetching filtered vehicles:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFilteredVehicles();

    const unsub = RealtimeService.subscribeToTable('vehicles', () => {
      loadFilteredVehicles();
    });

    return () => {
      unsub();
    };
  }, [make, model, bodyType, transmission, fuelType, minPrice, maxPrice, sortBy]);

  const resetFilters = () => {
    setMake('');
    setModel('');
    setBodyType('');
    setTransmission('');
    setFuelType('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#050505] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col font-sans selection:bg-[#0251B8] dark:selection:bg-[#2D7DFF] selection:text-[#050505]">
      <Navbar />

      {/* Popular Brands Logo Bar */}
      <PopularBrandsBar />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#EDF5F1] via-[#E4EFEA] to-[#DBE9E2] dark:from-[#000000] dark:via-[#121212] dark:to-[#0A0A0A] border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] text-[#0F241C] dark:text-[#F2F7F3] py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2D7DFF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-2 relative z-10">
          <Reveal direction="up" distance={15}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0251B8]/10 dark:bg-[#2D7DFF]/10 border border-[#0251B8]/20 dark:border-[#2D7DFF]/30 text-[#0251B8] dark:text-[#2D7DFF] text-xs font-bold uppercase tracking-wider mb-2">
              Quality Selection
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F241C] dark:text-[#F2F7F3]">
              Explore Our Vehicles
            </h1>
            <p className="text-xs sm:text-sm text-[#355347] dark:text-[#8EA79C]">
              Browse our selection of carefully presented vehicles and find an option that fits your needs, lifestyle, and budget.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] lg:pb-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl p-6 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] shadow-sm dark:shadow-glass sticky top-28 space-y-6">
              <div className="flex items-center justify-between border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] pb-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">
                  <SlidersHorizontal className="w-4 h-4 text-[#0251B8] dark:text-[#2D7DFF]" />
                  <span>Filter Vehicles</span>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-[#0251B8] dark:text-[#2D7DFF] hover:text-[#0150B5] dark:hover:text-[#FF3B4E] hover:underline flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase tracking-wider mb-1">Make</label>
                  <select
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] bg-[#F4F8F6] dark:bg-[#0A0A0A] p-2.5 text-xs font-bold text-[#0F241C] dark:text-[#F2F7F3] focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF]"
                  >
                    <option value="" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">All Makes</option>
                    <option value="Toyota" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Toyota</option>
                    <option value="Nissan" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Nissan</option>
                    <option value="Subaru" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Subaru</option>
                    <option value="Mazda" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Mazda</option>
                    <option value="Land Rover" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Land Rover</option>
                    <option value="Mercedes-Benz" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Mercedes-Benz</option>
                    <option value="BMW" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">BMW</option>
                    <option value="Volkswagen" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Volkswagen</option>
                    <option value="Volvo" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Volvo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase tracking-wider mb-1">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                    className="w-full rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] bg-[#F4F8F6] dark:bg-[#0A0A0A] p-2.5 text-xs font-bold text-[#0F241C] dark:text-[#F2F7F3] focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF]"
                  >
                    <option value="" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">All Transmissions</option>
                    <option value="Automatic" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Automatic</option>
                    <option value="Manual" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Manual</option>
                    <option value="CVT" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">CVT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase tracking-wider mb-1">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as FuelType)}
                    className="w-full rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] bg-[#F4F8F6] dark:bg-[#0A0A0A] p-2.5 text-xs font-bold text-[#0F241C] dark:text-[#F2F7F3] focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF]"
                  >
                    <option value="" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">All Fuel Types</option>
                    <option value="Petrol" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Petrol</option>
                    <option value="Diesel" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Diesel</option>
                    <option value="Hybrid" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Hybrid</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Min Price (KES)"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="e.g. 1000000"
                  />
                  <Input
                    label="Max Price (KES)"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="e.g. 10000000"
                  />
                </div>
              </div>

            </div>
          </aside>

          {/* Main Results Display */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Top Toolbar */}
            <div className="bg-white dark:bg-[#121212]/90 backdrop-blur-md p-4 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] shadow-sm dark:shadow-glass flex items-center justify-between gap-4">
              <div className="text-xs font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">
                Showing <span className="text-[#0251B8] dark:text-[#2D7DFF]">{vehicles.length}</span> Verified Vehicles
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden px-3 py-2 rounded-xl bg-[#F4F8F6] dark:bg-[#0A0A0A] border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] text-xs font-bold text-[#0F241C] dark:text-[#F2F7F3] flex items-center gap-1.5 hover:border-[#0251B8] dark:hover:border-[#2D7DFF]"
                >
                  <Filter className="w-3.5 h-3.5 text-[#0251B8] dark:text-[#2D7DFF]" />
                  <span>Filters</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F241C] dark:text-[#F2F7F3]">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#0251B8] dark:text-[#2D7DFF]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] bg-[#F4F8F6] dark:bg-[#0A0A0A] p-2 text-xs font-bold text-[#0F241C] dark:text-[#F2F7F3] focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF]"
                  >
                    <option value="newest" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Newest First</option>
                    <option value="price_low" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Price: Low to High</option>
                    <option value="price_high" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Price: High to Low</option>
                    <option value="mileage_low" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Lowest Mileage</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Filter Modal */}
            <AnimatePresence>
              {mobileFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex items-center justify-center p-4 bg-black/80 backdrop-blur-md menu-backdrop">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-[#121212] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.2)] rounded-3xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] pb-3">
                      <h3 className="text-base font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">Filters</h3>
                      <button
                        onClick={() => setMobileFilterOpen(false)}
                        className="text-xs font-bold text-[#355347] dark:text-[#8EA79C] hover:text-[#0F241C] dark:hover:text-[#F2F7F3]"
                      >
                        Close
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] mb-1">Make</label>
                        <select
                          value={make}
                          onChange={(e) => setMake(e.target.value)}
                          className="w-full rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] bg-[#F4F8F6] dark:bg-[#0A0A0A] p-2.5 text-xs font-bold text-[#0F241C] dark:text-[#F2F7F3]"
                        >
                          <option value="">All Makes</option>
                          <option value="Toyota">Toyota</option>
                          <option value="Nissan">Nissan</option>
                          <option value="Subaru">Subaru</option>
                          <option value="Mazda">Mazda</option>
                          <option value="Land Rover">Land Rover</option>
                          <option value="Mercedes-Benz">Mercedes-Benz</option>
                          <option value="BMW">BMW</option>
                          <option value="Volkswagen">Volkswagen</option>
                          <option value="Volvo">Volvo</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Min Price (KES)"
                          type="number"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          placeholder="Min Price"
                        />
                        <Input
                          label="Max Price (KES)"
                          type="number"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          placeholder="Max Price"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="flex-1" onClick={resetFilters}>Reset</Button>
                      <Button variant="primary" className="flex-1" onClick={() => setMobileFilterOpen(false)}>Apply</Button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Animated Vehicle Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-96 rounded-3xl bg-white/70 dark:bg-[#121212]/60 animate-pulse border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.08)]" />
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <div className="bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl p-12 text-center border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] space-y-4 shadow-sm">
                <Search className="w-12 h-12 text-[#0251B8] dark:text-[#2D7DFF] mx-auto opacity-40" />
                <h3 className="text-lg font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">No Vehicles Found</h3>
                <p className="text-xs text-[#355347] dark:text-[#8EA79C]">Try broadening your filter criteria or reset your filters.</p>
                <Button variant="outline" onClick={resetFilters}>Reset All Filters</Button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {vehicles.map((vehicle) => (
                    <motion.div
                      key={vehicle.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <VehicleCard vehicle={vehicle} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

          </main>

        </div>
      </div>

    </div>
  );
};
