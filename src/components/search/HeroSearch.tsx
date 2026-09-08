import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, DollarSign, Calendar, Car, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const HeroSearch: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  // Search parameters
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [year, setYear] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'sell') {
      navigate('/sell');
      return;
    }

    const queryParams = new URLSearchParams();
    if (make) queryParams.set('make', make);
    if (model) queryParams.set('model', model);
    if (location) queryParams.set('location', location);
    if (minPrice) queryParams.set('minPrice', minPrice);
    if (maxPrice) queryParams.set('maxPrice', maxPrice);
    if (year) queryParams.set('minYear', year);

    navigate(`/buy?${queryParams.toString()}`);
  };

  const applyQuickFilter = (type: string, value: string) => {
    const queryParams = new URLSearchParams();
    if (type === 'bodyType') queryParams.set('bodyType', value);
    if (type === 'transmission') queryParams.set('transmission', value);
    if (type === 'maxPrice') queryParams.set('maxPrice', value);
    navigate(`/buy?${queryParams.toString()}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 -mt-12 lg:-mt-16 relative z-20">
      <div className="bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl rounded-3xl shadow-xl dark:shadow-2xl shadow-black/5 dark:shadow-black/70 border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.15)] overflow-hidden p-6 sm:p-8">
        
        {/* Tab Selection */}
        <div className="flex items-center gap-2 mb-6 border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.1)] pb-4">
          <button
            onClick={() => setActiveTab('buy')}
            className={`px-6 py-2.5 rounded-full font-extrabold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'buy'
                ? 'bg-[#0251B8] dark:bg-[#2D7DFF] text-white dark:text-[#050505] shadow-md shadow-[#0251B8]/20 dark:shadow-[#2D7DFF]/25 font-black'
                : 'bg-[#EBF2EE] dark:bg-[#0A0A0A] text-[#5F7E71] dark:text-[#8EA79C] hover:text-[#0F241C] dark:hover:text-[#F2F7F3] border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.08)]'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>BUY A CAR</span>
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`px-6 py-2.5 rounded-full font-extrabold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'sell'
                ? 'bg-[#0251B8] dark:bg-[#2D7DFF] text-white dark:text-[#050505] shadow-md shadow-[#0251B8]/20 dark:shadow-[#2D7DFF]/25 font-black'
                : 'bg-[#EBF2EE] dark:bg-[#0A0A0A] text-[#5F7E71] dark:text-[#8EA79C] hover:text-[#0F241C] dark:hover:text-[#F2F7F3] border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.08)]'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>SELL YOUR CAR</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'buy' ? (
          <form onSubmit={handleSearchSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Make Input */}
              <div>
                <label className="block text-xs font-bold text-[#355347] dark:text-[#A7BDB3] uppercase tracking-wider mb-1.5">
                  Make
                </label>
                <select
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.18)] bg-[#F4F8F6] dark:bg-[#0A0A0A] px-4 py-3 text-sm text-[#0F241C] dark:text-[#F2F7F3] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF]"
                >
                  <option value="" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">All Makes (Toyota, Mazda, etc.)</option>
                  <option value="Toyota" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Toyota</option>
                  <option value="Mazda" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Mazda</option>
                  <option value="Subaru" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Subaru</option>
                  <option value="Nissan" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Nissan</option>
                  <option value="Mercedes-Benz" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Mercedes-Benz</option>
                  <option value="BMW" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">BMW</option>
                  <option value="Isuzu" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Isuzu</option>
                  <option value="Volkswagen" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Volkswagen</option>
                  <option value="Land Rover" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Land Rover</option>
                  <option value="Ford" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Ford</option>
                </select>
              </div>

              {/* Model Input */}
              <div>
                <label className="block text-xs font-bold text-[#355347] dark:text-[#A7BDB3] uppercase tracking-wider mb-1.5">
                  Model
                </label>
                <input
                  type="text"
                  placeholder="e.g. Harrier, Prado, CX-5"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.18)] bg-[#F4F8F6] dark:bg-[#0A0A0A] px-4 py-3 text-sm text-[#0F241C] dark:text-[#F2F7F3] placeholder-[#5F7E71]/60 dark:placeholder-[#8EA79C]/60 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF]"
                />
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-xs font-bold text-[#355347] dark:text-[#A7BDB3] uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.18)] bg-[#F4F8F6] dark:bg-[#0A0A0A] px-4 py-3 text-sm text-[#0F241C] dark:text-[#F2F7F3] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF]"
                >
                  <option value="" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">All Kenya Locations</option>
                  <option value="Nairobi" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Nairobi</option>
                  <option value="Mombasa" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Mombasa</option>
                  <option value="Nakuru" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Nakuru</option>
                  <option value="Eldoret" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Eldoret</option>
                  <option value="Kisumu" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Kisumu</option>
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-xs font-bold text-[#355347] dark:text-[#A7BDB3] uppercase tracking-wider mb-1.5">
                  Min Price (KES)
                </label>
                <select
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.18)] bg-[#F4F8F6] dark:bg-[#0A0A0A] px-4 py-3 text-sm text-[#0F241C] dark:text-[#F2F7F3] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF]"
                >
                  <option value="" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">No Minimum</option>
                  <option value="1000000" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">1,000,000</option>
                  <option value="2000000" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">2,000,000</option>
                  <option value="3000000" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">3,000,000</option>
                  <option value="5000000" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">5,000,000</option>
                </select>
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-xs font-bold text-[#355347] dark:text-[#A7BDB3] uppercase tracking-wider mb-1.5">
                  Max Price (KES)
                </label>
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.18)] bg-[#F4F8F6] dark:bg-[#0A0A0A] px-4 py-3 text-sm text-[#0F241C] dark:text-[#F2F7F3] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF]"
                >
                  <option value="" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">No Maximum</option>
                  <option value="2000000" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">2,000,000</option>
                  <option value="3000000" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">3,000,000</option>
                  <option value="5000000" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">5,000,000</option>
                  <option value="8000000" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">8,000,000</option>
                  <option value="12000000" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">12,000,000</option>
                </select>
              </div>

              {/* Minimum Year */}
              <div>
                <label className="block text-xs font-bold text-[#355347] dark:text-[#A7BDB3] uppercase tracking-wider mb-1.5">
                  Min Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.18)] bg-[#F4F8F6] dark:bg-[#0A0A0A] px-4 py-3 text-sm text-[#0F241C] dark:text-[#F2F7F3] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF]"
                >
                  <option value="" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Any Year</option>
                  <option value="2016" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">2016+</option>
                  <option value="2018" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">2018+</option>
                  <option value="2020" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">2020+</option>
                  <option value="2022" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">2022+</option>
                </select>
              </div>

            </div>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#5F7E71] dark:text-[#8EA79C]">
                <span className="text-[#0F241C] dark:text-[#F2F7F3] font-bold uppercase">Quick Filters:</span>
                <button
                  type="button"
                  onClick={() => applyQuickFilter('bodyType', 'SUV')}
                  className="px-3 py-1.5 rounded-full bg-[#F4F8F6] dark:bg-[#0A0A0A] border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.15)] text-[#355347] dark:text-[#A7BDB3] hover:bg-[#EBF2EE] dark:hover:bg-[#1A1A1A] hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors"
                >
                  SUV
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickFilter('bodyType', 'Sedan')}
                  className="px-3 py-1.5 rounded-full bg-[#F4F8F6] dark:bg-[#0A0A0A] border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.15)] text-[#355347] dark:text-[#A7BDB3] hover:bg-[#EBF2EE] dark:hover:bg-[#1A1A1A] hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors"
                >
                  Sedan
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickFilter('bodyType', 'Pickup / Truck')}
                  className="px-3 py-1.5 rounded-full bg-[#F4F8F6] dark:bg-[#0A0A0A] border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.15)] text-[#355347] dark:text-[#A7BDB3] hover:bg-[#EBF2EE] dark:hover:bg-[#1A1A1A] hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors"
                >
                  Pickup
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickFilter('transmission', 'Automatic')}
                  className="px-3 py-1.5 rounded-full bg-[#F4F8F6] dark:bg-[#0A0A0A] border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.15)] text-[#355347] dark:text-[#A7BDB3] hover:bg-[#EBF2EE] dark:hover:bg-[#1A1A1A] hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors"
                >
                  Automatic
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickFilter('maxPrice', '2000000')}
                  className="px-3 py-1.5 rounded-full bg-[#F4F8F6] dark:bg-[#0A0A0A] border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.15)] text-[#355347] dark:text-[#A7BDB3] hover:bg-[#EBF2EE] dark:hover:bg-[#1A1A1A] hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors"
                >
                  Under KES 2M
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickFilter('maxPrice', '3000000')}
                  className="px-3 py-1.5 rounded-full bg-[#F4F8F6] dark:bg-[#0A0A0A] border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.15)] text-[#355347] dark:text-[#A7BDB3] hover:bg-[#EBF2EE] dark:hover:bg-[#1A1A1A] hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors"
                >
                  Under KES 3M
                </button>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto min-w-[200px] font-bold"
                icon={<Search className="w-5 h-5" />}
              >
                Find Cars
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-6 text-center space-y-4">
            <h3 className="text-2xl font-black text-[#0F241C] dark:text-[#F2F7F3]">Ready to list your vehicle on Yardly Automotives?</h3>
            <p className="text-sm text-[#355347] dark:text-[#A7BDB3] max-w-md mx-auto">
              Get maximum exposure to serious buyers across Kenya. Verified car-yard approval in less than 24 hours.
            </p>
            <Button
              onClick={() => navigate('/sell')}
              size="lg"
              className="font-bold"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Start Seller Listing
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};
