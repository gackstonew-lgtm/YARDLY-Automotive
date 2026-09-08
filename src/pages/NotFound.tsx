import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Button } from '../components/ui/Button';
import { useSEO } from '../lib/hooks/useSEO';
import { siteConfig } from '../config/site';
import { Search, Home, ArrowLeft, MessageSquare, Compass } from 'lucide-react';

export const NotFound: React.FC = () => {
  useSEO({
    title: '404 - Page Not Found',
    description: 'The requested page could not be found on Yardly Automotives. Explore our verified vehicle marketplace or return to the homepage.'
  });

  return (
    <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#050505] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col font-sans selection:bg-[#0251B8] dark:selection:bg-[#2D7DFF] selection:text-[#050505] pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-12">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center justify-center text-center">
        {/* Visual 404 Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF2EE] dark:bg-[#121212] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.2)] text-xs font-black uppercase tracking-widest text-[#0251B8] dark:text-[#2D7DFF] mb-6">
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span>Error 404 • Destination Not Found</span>
        </div>

        <h1 className="text-6xl sm:text-8xl font-black tracking-tight text-[#0F241C] dark:text-[#F2F7F3] mb-4">
          4<span className="text-[#0251B8] dark:text-[#2D7DFF]">0</span>4
        </h1>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#0F241C] dark:text-[#F2F7F3] mb-3">
          Looks Like You Took a Detour
        </h2>

        <p className="text-sm sm:text-base text-[#355347] dark:text-[#8EA79C] max-w-lg mb-8 leading-relaxed">
          The page you requested may have been moved, sold, renamed, or is temporarily unavailable. Let's get you back on the right road.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link to="/">
            <Button size="lg" variant="primary" className="font-extrabold flex items-center gap-2 shadow-lg btn-glow">
              <Home className="w-4 h-4" />
              <span>Back to Homepage</span>
            </Button>
          </Link>

          <Link to="/buy">
            <Button size="lg" variant="outline" className="font-bold flex items-center gap-2 bg-white dark:bg-[#121212]">
              <Search className="w-4 h-4" />
              <span>Browse All Vehicles</span>
            </Button>
          </Link>
        </div>

        {/* Useful Quick Navigation Grid */}
        <div className="w-full bg-white dark:bg-[#121212]/80 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] p-6 sm:p-8 text-left shadow-sm">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0251B8] dark:text-[#2D7DFF] mb-4">
            Popular Automotive Portals
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <Link to="/sell" className="p-3 rounded-xl bg-[#F4F8F6] dark:bg-[#0A0A0A] hover:border-[#0251B8] dark:hover:border-[#2D7DFF] border border-transparent font-bold text-[#0F241C] dark:text-[#F2F7F3] transition-colors">
              Sell Your Car →
            </Link>
            <Link to="/import" className="p-3 rounded-xl bg-[#F4F8F6] dark:bg-[#0A0A0A] hover:border-[#0251B8] dark:hover:border-[#2D7DFF] border border-transparent font-bold text-[#0F241C] dark:text-[#F2F7F3] transition-colors">
              Direct Import →
            </Link>
            <Link to="/trade-in" className="p-3 rounded-xl bg-[#F4F8F6] dark:bg-[#0A0A0A] hover:border-[#0251B8] dark:hover:border-[#2D7DFF] border border-transparent font-bold text-[#0F241C] dark:text-[#F2F7F3] transition-colors">
              Trade-In →
            </Link>
            <Link to="/car-hire" className="p-3 rounded-xl bg-[#F4F8F6] dark:bg-[#0A0A0A] hover:border-[#0251B8] dark:hover:border-[#2D7DFF] border border-transparent font-bold text-[#0F241C] dark:text-[#F2F7F3] transition-colors">
              Car Hire →
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.1)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5F7E71] dark:text-[#8EA79C]">
            <span>Need immediate assistance?</span>
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Hi%2C%20I%20encountered%20a%20404%20error%20on%20Yardly%20Automotives.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-[#0251B8] dark:text-[#2D7DFF] hover:underline"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact Support on WhatsApp</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
