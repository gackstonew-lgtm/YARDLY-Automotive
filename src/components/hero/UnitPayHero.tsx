import React from 'react';
import { ShieldCheck, ArrowRight, Zap, CheckCircle2, Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { siteConfig } from '../../config/site';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { VehicleImageWithFallback } from '../ui/VehicleImageWithFallback';

interface UnitPayHeroProps {
  onSearchClick?: () => void;
}

export const UnitPayHero: React.FC<UnitPayHeroProps> = ({ onSearchClick }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF2EE] via-[#F4F8F6] to-[#E5EFE9] dark:from-[#000000] dark:via-[#121212] dark:to-[#050505] pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[rgba(0,60,40,0.08)] dark:border-transparent">
      {/* Background Decorative Radial Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-[#0251B8]/10 dark:from-[#2D7DFF]/15 via-[#0150B5]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Copy */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-6 space-y-6 text-left"
          >
            {/* 1. Eyebrow Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2">
              <Badge variant="verified" className="px-3.5 py-1 text-xs shadow-sm bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.2)] text-[#0251B8] dark:text-[#2D7DFF]">
                <ShieldCheck className="w-4 h-4 text-[#0251B8] dark:text-[#2D7DFF]" />
                <span>Verified Digital Car Yard Platform</span>
              </Badge>
            </motion.div>

            {/* 2. Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F241C] dark:text-[#F2F7F3] tracking-tight leading-[1.1]"
            >
              Find Your Next Drive
              <span className="block mt-2 bg-gradient-to-r from-[#0251B8] via-[#0150B5] to-[#2D7DFF] dark:from-[#2D7DFF] dark:via-[#FF3B4E] dark:to-[#FF3B4E] bg-clip-text text-transparent text-shimmer">
                With Yardly Automotives
              </span>
            </motion.h1>

            {/* 3. Subtitle Description */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-[#355347] dark:text-[#A7BDB3] font-normal leading-relaxed max-w-xl"
            >
              Explore quality vehicles, compare your options, and find the right car for your lifestyle with Yardly Automotives.
            </motion.p>

            {/* 4. CTA Button Group & Mobile Action Bar */}
            <motion.div variants={itemVariants} className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={onSearchClick}
                  className="font-bold shadow-lg shadow-[#0251B8]/20 dark:shadow-[#2D7DFF]/25 group active:scale-95 transition-transform btn-glow"
                >
                  <span>Explore Vehicles</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <a href={`tel:${siteConfig.contact.phone}`}>
                  <Button size="lg" variant="outline" className="font-bold bg-white dark:bg-[#121212]/80 border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] text-[#0F241C] dark:text-[#F2F7F3] hover:border-[#0251B8] dark:hover:border-[#2D7DFF] hover:text-[#0251B8] dark:hover:text-[#2D7DFF] active:scale-95 transition-transform">
                    Get in Touch
                  </Button>
                </a>
              </div>

              {/* Inspiration Action Bar Container for Mobile & Tablet Overview */}
              <div className="bg-white/90 dark:bg-[#121212]/85 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.15)] shadow-md dark:shadow-xl max-w-xl">
                <div className="grid grid-cols-3 divide-x divide-[rgba(0,60,40,0.08)] dark:divide-[#1A1A1A] text-center">
                  <a
                    href="/buy"
                    className="flex flex-col items-center justify-center py-2 px-1 hover:bg-[#EBF2EE] dark:hover:bg-[#1A1A1A]/60 rounded-xl transition-all group active:scale-95"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#EBF2EE] dark:bg-[#1A1A1A] flex items-center justify-center mb-1 group-hover:bg-[#0251B8] dark:group-hover:bg-[#2D7DFF] transition-colors">
                      <ArrowRight className="w-4 h-4 text-[#0251B8] dark:text-[#2D7DFF] group-hover:text-white dark:group-hover:text-[#050505] transition-colors rotate-[315deg]" />
                    </div>
                    <span className="text-xs font-black tracking-wider text-[#0251B8] dark:text-[#2D7DFF]">BUY</span>
                  </a>

                  <a
                    href="/sell"
                    className="flex flex-col items-center justify-center py-2 px-1 hover:bg-[#EBF2EE] dark:hover:bg-[#1A1A1A]/60 rounded-xl transition-all group active:scale-95"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800/30 flex items-center justify-center mb-1 group-hover:bg-[#DC2626] transition-colors">
                      <Zap className="w-4 h-4 text-rose-500 dark:text-rose-400 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-xs font-black tracking-wider text-rose-500 dark:text-rose-400">SELL</span>
                  </a>

                  <a
                    href="/admin"
                    className="flex flex-col items-center justify-center py-2 px-1 hover:bg-[#EBF2EE] dark:hover:bg-[#1A1A1A]/60 rounded-xl transition-all group active:scale-95"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#EBF2EE] dark:bg-[#1A1A1A] flex items-center justify-center mb-1 group-hover:bg-[#0251B8] dark:group-hover:bg-[#FF3B4E] transition-colors">
                      <ShieldCheck className="w-4 h-4 text-[#0251B8] dark:text-[#FF3B4E] group-hover:text-white dark:group-hover:text-[#050505] transition-colors" />
                    </div>
                    <span className="text-xs font-black tracking-wider text-[#0251B8] dark:text-[#FF3B4E]">YARD ADMIN</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* 5. Trust Metrics Row */}
            <motion.div variants={itemVariants} className="pt-4 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-[#355347] dark:text-[#A7BDB3]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0251B8] dark:text-[#2D7DFF] shrink-0" />
                <span>Logbook Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#0251B8] dark:text-[#2D7DFF] shrink-0" />
                <span>Instant M-Pesa Holding</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                <span>0% Escrow Fraud</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: UnitPay Glass Floating Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            {/* Smooth Floating Container Wrapper */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: [0.45, 0, 0.55, 1], // Ultra smooth sine curve float
              }}
              className="relative"
            >
              {/* Primary Main Glass Card */}
              <div className="relative rounded-3xl bg-white/90 dark:bg-[#121212]/85 backdrop-blur-xl border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.18)] p-4 sm:p-6 shadow-xl dark:shadow-2xl shadow-black/5 dark:shadow-black/70 hover:border-[#0251B8]/40 dark:hover:border-[#2D7DFF]/40 transition-all duration-500">
                
                {/* Featured Vehicle Showcase Image - Toyota Supra Carbon Gear Shift */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#EBF2EE] dark:bg-[#000000] border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)]">
                  <VehicleImageWithFallback
                    make="Toyota"
                    model="Supra"
                    year={2020}
                    image={{
                      id: 'hero-supra-gear-img',
                      vehicle_id: 'a1000000-0000-0000-0000-000000000015',
                      image_url: '/Car Images/Toyota Supra (5).jpeg',
                      display_order: 1,
                      is_primary: true,
                      license_status: 'authorized',
                      source_type: 'local_image_library',
                      created_at: ''
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

              </div>

              {/* Smooth Floating Counter-Moving Pill Badge */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: [0.45, 0, 0.55, 1],
                }}
                className="absolute -top-5 -right-3 sm:top-2 sm:right-2 bg-gradient-to-br from-white to-[#EBF2EE] dark:from-[#242424] dark:to-[#121212] text-[#0F241C] dark:text-[#F2F7F3] p-3.5 rounded-2xl shadow-xl dark:shadow-2xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.25)] hidden sm:flex items-center gap-3 z-20"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0251B8]/15 dark:bg-[#2D7DFF]/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-[#0251B8] dark:text-[#2D7DFF] fill-[#0251B8] dark:fill-[#2D7DFF]" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#0F241C] dark:text-[#F2F7F3]">99.4% Verified</div>
                  <div className="text-[10px] text-[#5F7E71] dark:text-[#A7BDB3]">Clean Logbook History</div>
                </div>
              </motion.div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
