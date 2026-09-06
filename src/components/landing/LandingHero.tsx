import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, User, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export const LandingHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#001711] via-[#001A13] to-[#00140F] border-b border-[rgba(180,255,210,0.12)] pt-12 pb-16 sm:pt-20 sm:pb-24">
      {/* Background ambient lighting glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#00E878]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-[#00E878]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition & Conversion CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Platform Gateway Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#002B1F]/90 border border-[rgba(180,255,210,0.2)] text-xs font-extrabold uppercase tracking-wider text-[#00E878] shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00E878]" />
              <span>Digital Automotive Marketplace & Gateway</span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3"
            >
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black tracking-tight text-[#F2F7F3] leading-[1.12]">
                Your Journey to the Right Vehicle{' '}
                <span className="block mt-1 bg-gradient-to-r from-[#00E878] via-[#55FF78] to-[#99FFAA] bg-clip-text text-transparent text-shimmer">
                  Starts Here
                </span>
              </h1>
              <p className="text-sm sm:text-base xl:text-lg text-[#A7BDB3] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal pt-2">
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
                <Button size="lg" variant="outline" className="font-bold px-6 py-3.5 bg-[#00251B] border-[rgba(180,255,210,0.25)] text-[#F2F7F3] hover:border-[#00E878] hover:text-[#00E878] active:scale-95 transition-all">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>

              <Link to="/login">
                <Button size="lg" variant="ghost" className="font-extrabold px-5 py-3.5 text-[#8EA79C] hover:text-[#00E878] hover:bg-[#002B1F]/60">
                  <User className="w-4 h-4 mr-1.5 text-[#00E878]" />
                  <span>Sign In</span>
                </Button>
              </Link>
            </motion.div>

            {/* Quick Service Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-3 gap-3 pt-4 border-t border-[rgba(180,255,210,0.1)] text-left"
            >
              <div className="bg-[#00251B]/60 p-3 rounded-2xl border border-[rgba(180,255,210,0.08)]">
                <div className="text-[#00E878] font-black text-sm sm:text-base">Verified</div>
                <div className="text-[11px] text-[#8EA79C]">Vehicle Inspections</div>
              </div>
              <div className="bg-[#00251B]/60 p-3 rounded-2xl border border-[rgba(180,255,210,0.08)]">
                <div className="text-[#00E878] font-black text-sm sm:text-base">Direct</div>
                <div className="text-[11px] text-[#8EA79C]">Import Sourcing</div>
              </div>
              <div className="bg-[#00251B]/60 p-3 rounded-2xl border border-[rgba(180,255,210,0.08)]">
                <div className="text-[#00E878] font-black text-sm sm:text-base">Secure</div>
                <div className="text-[11px] text-[#8EA79C]">Partner Workflows</div>
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
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#002B1F] to-[#001D15] border border-[rgba(180,255,210,0.2)] p-2 shadow-2xl shadow-black/60 group hover-lift">
              <div className="relative h-72 sm:h-84 xl:h-96 rounded-2xl overflow-hidden bg-[#001711]">
                <img
                  src="/Car Images/2019 LEXUS LX570.jpeg"
                  alt="Yardly Automotives Premium Executive Vehicle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001A13] via-transparent to-transparent opacity-80" />
                
                {/* Floating pill overlays */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001A13]/85 backdrop-blur-md border border-[rgba(180,255,210,0.25)] text-xs font-black text-[#00E878] shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00E878]" />
                  <span>Yardly Verified Asset</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-[#001A13]/90 backdrop-blur-md p-3.5 rounded-xl border border-[rgba(180,255,210,0.15)] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-[#F2F7F3]">Executive & Luxury Fleet</div>
                    <div className="text-[11px] text-[#8EA79C]">Available for Browse, Import & Hire</div>
                  </div>
                  <Link to="/buy">
                    <span className="text-xs font-black text-[#00E878] hover:underline flex items-center gap-1">
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
