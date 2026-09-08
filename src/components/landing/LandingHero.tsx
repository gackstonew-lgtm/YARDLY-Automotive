import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, User, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export const LandingHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF2EE] via-[#F4F8F6] to-[#E5EFE9] dark:from-[#0A0A0A] dark:via-[#050505] dark:to-[#000000] border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] pt-12 pb-16 sm:pt-20 sm:pb-24">
      {/* Background ambient lighting glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#0251B8]/10 dark:bg-[#2D7DFF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-[#0251B8]/5 dark:bg-[#2D7DFF]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition & Conversion CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Platform Gateway Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF2EE]/90 dark:bg-[#121212]/90 border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.2)] text-xs font-extrabold uppercase tracking-wider text-[#0251B8] dark:text-[#2D7DFF] shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0251B8] dark:text-[#2D7DFF]" />
              <span>Digital Automotive Marketplace & Gateway</span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3"
            >
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black tracking-tight text-[#0F241C] dark:text-[#F2F7F3] leading-[1.12]">
                Your Journey to the Right Vehicle{' '}
                <span className="block mt-1 bg-gradient-to-r from-[#0251B8] via-[#0150B5] to-[#2D7DFF] dark:from-[#2D7DFF] dark:via-[#FF3B4E] dark:to-[#FF5E6E] bg-clip-text text-transparent text-shimmer">
                  Starts Here
                </span>
              </h1>
              <p className="text-sm sm:text-base xl:text-lg text-[#355347] dark:text-[#A7BDB3] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal pt-2">
                Discover, buy, sell, import, trade, hire and manage your automotive needs with Yardly Automotives.
              </p>
            </motion.div>

            {/* Primary, Secondary, and Authentication CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <Link to="/buy">
                <Button size="lg" variant="primary" className="font-black px-7 py-3.5 shadow-xl btn-glow flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span>Explore Vehicles</span>
                </Button>
              </Link>

              <Link to="/register">
                <Button size="lg" variant="outline" className="font-bold px-6 py-3.5 bg-white dark:bg-[#121212] border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.25)] text-[#0F241C] dark:text-[#F2F7F3] hover:border-[#0251B8] dark:hover:border-[#2D7DFF] hover:text-[#0251B8] dark:hover:text-[#2D7DFF] active:scale-95 transition-all">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>

              <Link to="/login">
                <Button size="lg" variant="ghost" className="font-extrabold px-5 py-3.5 text-[#5F7E71] dark:text-[#8EA79C] hover:text-[#0251B8] dark:hover:text-[#2D7DFF] hover:bg-[#EBF2EE] dark:hover:bg-[#121212]/60">
                  <User className="w-4 h-4 mr-1.5 text-[#0251B8] dark:text-[#2D7DFF]" />
                  <span>Sign In</span>
                </Button>
              </Link>
            </motion.div>

            {/* Quick Service Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-3 gap-3 pt-4 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.1)] text-left"
            >
              <div className="bg-white/80 dark:bg-[#121212]/60 p-3 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.08)]">
                <div className="text-[#0251B8] dark:text-[#2D7DFF] font-black text-sm sm:text-base">Verified</div>
                <div className="text-[11px] text-[#5F7E71] dark:text-[#8EA79C]">Vehicle Inspections</div>
              </div>
              <div className="bg-white/80 dark:bg-[#121212]/60 p-3 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.08)]">
                <div className="text-[#0251B8] dark:text-[#2D7DFF] font-black text-sm sm:text-base">Direct</div>
                <div className="text-[11px] text-[#5F7E71] dark:text-[#8EA79C]">Import Sourcing</div>
              </div>
              <div className="bg-white/80 dark:bg-[#121212]/60 p-3 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.08)]">
                <div className="text-[#0251B8] dark:text-[#2D7DFF] font-black text-sm sm:text-base">Secure</div>
                <div className="text-[11px] text-[#5F7E71] dark:text-[#8EA79C]">Partner Workflows</div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Premium Showcase Vehicle Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-white to-[#EBF2EE] dark:from-[#121212] dark:to-[#0A0A0A] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.2)] p-2 shadow-xl shadow-black/5 dark:shadow-2xl dark:shadow-black/60 group hover-lift">
              <div className="relative h-72 sm:h-84 xl:h-96 rounded-2xl overflow-hidden bg-[#EBF2EE] dark:bg-[#0A0A0A]">
                <img
                  src="/Car Images/2019 LEXUS LX570.jpeg"
                  alt="Yardly Automotives Premium Executive Vehicle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                
                {/* Floating pill overlays */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-[#050505]/85 backdrop-blur-md border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.25)] text-xs font-black text-[#0251B8] dark:text-[#2D7DFF] shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0251B8] dark:text-[#2D7DFF]" />
                  <span>Yardly Verified Asset</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#050505]/90 backdrop-blur-md p-3.5 rounded-xl border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.15)] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">Executive & Luxury Fleet</div>
                    <div className="text-[11px] text-[#5F7E71] dark:text-[#8EA79C]">Available for Browse, Import & Hire</div>
                  </div>
                  <Link to="/buy">
                    <span className="text-xs font-black text-[#0251B8] dark:text-[#2D7DFF] hover:underline flex items-center gap-1">
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
