import React, { useEffect } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { PopularBrandsBar } from '../components/brand/PopularBrandsBar';
import { LandingHero } from '../components/landing/LandingHero';
import { BuyingSellingSection } from '../components/landing/BuyingSellingSection';
import { ImportationSection } from '../components/landing/ImportationSection';
import { TradeInSection } from '../components/landing/TradeInSection';
import { AuctionsSection } from '../components/landing/AuctionsSection';
import { CarHireSection } from '../components/landing/CarHireSection';
import { SparesAccessoriesSection } from '../components/landing/SparesAccessoriesSection';
import { TrackerSection } from '../components/landing/TrackerSection';
import { DealershipSection } from '../components/landing/DealershipSection';
import { AboutSection } from '../components/landing/AboutSection';
import { FinalCTASection } from '../components/landing/FinalCTASection';
import { LandingFooter } from '../components/landing/LandingFooter';
import { FloatingWhatsApp } from '../components/ui/FloatingWhatsApp';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#001A13] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col font-sans selection:bg-[#009E52] selection:text-white dark:selection:bg-[#00E878] dark:selection:text-[#001A13] pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-0 overflow-x-hidden">
      {/* 1. Navigation / Header */}
      <Navbar />

      {/* Popular Brands Logo Bar */}
      <PopularBrandsBar />

      {/* 2. Hero Section */}
      <LandingHero />

      {/* 3. Car Buying & Selling */}
      <BuyingSellingSection />

      {/* 4. Vehicle Importation */}
      <ImportationSection />

      {/* 5. Vehicle Trade-In */}
      <TradeInSection />

      {/* 6. Vehicle Auctions */}
      <AuctionsSection />

      {/* 7. Car Hire Services */}
      <CarHireSection />

      {/* 8. Car Spares & Accessories */}
      <SparesAccessoriesSection />

      {/* 9. Tracker Installation */}
      <TrackerSection />

      {/* 10. Yard Dealerships & Marketing */}
      <DealershipSection />

      {/* 11. About Us */}
      <AboutSection />

      {/* 12. Call To Action */}
      <FinalCTASection />

      {/* 13. Footer */}
      <LandingFooter />

      {/* Floating Direct WhatsApp Inquiry Button */}
      <FloatingWhatsApp />
    </div>
  );
};

export default LandingPage;
