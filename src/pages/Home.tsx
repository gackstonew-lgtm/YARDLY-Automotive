import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Search, Award, ArrowRight, CheckCircle2, PhoneCall, ChevronRight, Zap, RefreshCw } from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { PopularBrandsBar } from '../components/brand/PopularBrandsBar';
import { UnitPayHero } from '../components/hero/UnitPayHero';
import { HeroSearch } from '../components/search/HeroSearch';
import { VehicleCard } from '../components/vehicle/VehicleCard';
import { VehicleService } from '../lib/vehicles/vehicle.service';
import { Vehicle } from '../types/database';
import { Button } from '../components/ui/Button';
import { siteConfig } from '../config/site';
import { Reveal } from '../components/motion/Reveal';
import { StaggerContainer, StaggerItem } from '../components/motion/Stagger';

export const Home: React.FC = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const all = await VehicleService.getAll();
        const featured = all.filter(v => v.featured);
        setFeaturedVehicles(featured.length > 0 ? featured : all.slice(0, 6));
      } catch (err) {
        console.error('Failed to load featured vehicles', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#050505] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col font-sans selection:bg-[#0251B8] dark:selection:bg-[#2D7DFF] selection:text-[#050505] pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-0">
      <Navbar />

      {/* Popular Brands Logo Bar */}
      <PopularBrandsBar />

      {/* Hero Section */}
      <UnitPayHero onSearchClick={scrollToSearch} />

      {/* Hero Search Panel Container */}
      <div ref={searchRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 w-full mb-6 sm:mb-16">
        <Reveal direction="up" distance={20}>
          <HeroSearch />
        </Reveal>
      </div>

      {/* Featured Vehicles Grid Section */}
      <section className="pt-4 pb-12 sm:py-12 bg-[#F4F8F6] dark:bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <Reveal direction="up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] pb-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#0251B8] dark:text-[#2D7DFF] mb-1">
                  Quality Selection
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">
                  Explore Our Vehicles
                </h2>
                <p className="text-xs sm:text-sm text-[#355347] dark:text-[#8EA79C] mt-1 max-w-xl">
                  Browse our selection of carefully presented vehicles and find an option that fits your needs, lifestyle, and budget.
                </p>
              </div>

              <Link to="/buy" className="inline-flex items-center gap-1 text-xs font-bold text-[#0251B8] dark:text-[#2D7DFF] hover:text-[#0150B5] dark:hover:text-[#FF3B4E] transition-colors group shrink-0">
                <span>View All Vehicles</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>

          {/* Skeleton or Vehicle Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-3xl bg-white/70 dark:bg-[#121212]/60 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.08)] animate-pulse" />
              ))}
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVehicles.map((vehicle, index) => (
                <StaggerItem key={vehicle.id}>
                  <VehicleCard vehicle={vehicle} priority={index < 3} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

        </div>
      </section>

      {/* Why Choose Yardly Automotives Section */}
      <section className="py-16 bg-[#EBF3EF] dark:bg-[#0A0A0A] border-y border-[rgba(0,60,40,0.06)] dark:border-[rgba(255, 255, 255,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <Reveal direction="up" className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest text-[#0251B8] dark:text-[#2D7DFF]">
              Quality & Transparency
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">
              Why Choose Yardly Automotives?
            </h2>
            <p className="text-xs sm:text-sm text-[#355347] dark:text-[#8EA79C]">
              We make the vehicle buying experience straightforward, transparent, and customer-focused.
            </p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
              <div className="bg-white dark:bg-[#121212] p-8 rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] relative h-full space-y-4 hover:border-[#0251B8]/40 dark:hover:border-[#2D7DFF]/40 transition-colors shadow-sm dark:shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF2FC] dark:bg-[#1A1A1A] text-[#0251B8] dark:text-[#2D7DFF] border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] flex items-center justify-center font-black text-lg">
                  01
                </div>
                <h3 className="text-lg font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">Quality-Focused</h3>
                <p className="text-xs text-[#355347] dark:text-[#8EA79C] leading-relaxed">
                  We present vehicles with clear information to help you make confident choices.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white dark:bg-[#121212] p-8 rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] relative h-full space-y-4 hover:border-[#0251B8]/40 dark:hover:border-[#2D7DFF]/40 transition-colors shadow-sm dark:shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF2FC] dark:bg-[#1A1A1A] text-[#0251B8] dark:text-[#2D7DFF] border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] flex items-center justify-center font-black text-lg">
                  02
                </div>
                <h3 className="text-lg font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">Customer-First Service</h3>
                <p className="text-xs text-[#355347] dark:text-[#8EA79C] leading-relaxed">
                  Your needs come first, from your first enquiry to your final decision.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white dark:bg-[#121212] p-8 rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] relative h-full space-y-4 hover:border-[#0251B8]/40 dark:hover:border-[#2D7DFF]/40 transition-colors shadow-sm dark:shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF2FC] dark:bg-[#1A1A1A] text-[#0251B8] dark:text-[#2D7DFF] border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] flex items-center justify-center font-black text-lg">
                  03
                </div>
                <h3 className="text-lg font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">Transparent Information</h3>
                <p className="text-xs text-[#355347] dark:text-[#8EA79C] leading-relaxed">
                  We make it easier to understand the vehicles and options available to you.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>

        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-[#F4F8F6] dark:bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up">
            <div className="rounded-3xl bg-gradient-to-r from-[#1A1A1A] via-[#242424] to-[#121212] p-8 sm:p-12 text-[#F2F7F3] shadow-2xl border border-[rgba(255, 255, 255,0.2)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              
              <div className="space-y-4 max-w-xl text-center md:text-left z-10">
                <div className="inline-flex items-center gap-2 bg-[#050505]/50 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold border border-[rgba(255, 255, 255,0.2)] text-[#2D7DFF]">
                  <ShieldCheck className="w-4 h-4 text-[#2D7DFF]" />
                  <span>Ready for the Road Ahead?</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-[#F2F7F3]">
                  Ready to Find Your Next Vehicle?
                </h2>
                <p className="text-xs sm:text-sm text-[#A7BDB3] leading-relaxed">
                  Explore our available vehicles or speak with the Yardly Automotives team about your next drive.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 z-10">
                <Link to="/buy">
                  <Button size="lg" variant="primary" className="font-extrabold shadow-xl active:scale-95 transition-transform">
                    Browse Vehicles
                  </Button>
                </Link>
                <a href={`tel:${siteConfig.contact.phone}`}>
                  <Button size="lg" variant="outline" className="font-extrabold bg-[#121212]/80 border-[rgba(255, 255, 255,0.25)] text-[#F2F7F3] hover:border-[#2D7DFF] hover:text-[#2D7DFF] active:scale-95 transition-transform">
                    Contact Yardly Automotives
                  </Button>
                </a>
              </div>

            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#E4ECE7] dark:bg-[#000000] text-[#0F241C] dark:text-[#F2F7F3] pt-12 pb-8 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.1)] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h3 className="text-lg font-black text-[#0F241C] dark:text-[#F2F7F3]">{siteConfig.name}</h3>
              <p className="text-xs text-[#355347] dark:text-[#8EA79C] leading-relaxed">
                Yardly Automotives helps you discover quality vehicles and make confident choices for your next journey.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0251B8] dark:text-[#2D7DFF] mb-3">Marketplace</h4>
              <ul className="space-y-2 text-xs text-[#355347] dark:text-[#A7BDB3]">
                <li><Link to="/buy?make=Toyota" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF]">Toyota Vehicles</Link></li>
                <li><Link to="/buy?transmission=Automatic" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF]">Automatic SUVs</Link></li>
                <li><Link to="/buy?maxPrice=5000000" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF]">Under KES 5M</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0251B8] dark:text-[#2D7DFF] mb-3">Car Yard</h4>
              <ul className="space-y-2 text-xs text-[#355347] dark:text-[#A7BDB3]">
                <li><Link to="/sell" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF]">Sell Your Car</Link></li>
                <li><Link to="/admin" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF]">Admin Dashboard</Link></li>
                <li><Link to="/auth" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF]">Partner Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0251B8] dark:text-[#2D7DFF] mb-3">Contact</h4>
              <div className="text-xs text-[#355347] dark:text-[#A7BDB3] space-y-1">
                <p>{siteConfig.contact.address}</p>
                <p><a href={`tel:${siteConfig.contact.phone}`} className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors">{siteConfig.contact.phone}</a></p>
                <p><a href={`mailto:${siteConfig.contact.email}`} className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors">{siteConfig.contact.email}</a></p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[rgba(0,60,40,0.06)] dark:border-[rgba(255, 255, 255,0.08)] text-center text-xs text-[#5F7E71] dark:text-[#5B7569]">
            &copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};
