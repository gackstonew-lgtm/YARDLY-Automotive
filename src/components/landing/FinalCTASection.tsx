import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, UserPlus, LogIn, PhoneCall, ArrowRight, Sparkles } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { Button } from '../ui/Button';
import { siteConfig } from '../../config/site';

export const FinalCTASection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#0A0A0A] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#0251B8]/10 dark:bg-[#2D7DFF]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal direction="up">
          <div className="rounded-3xl bg-gradient-to-r from-[#1A1A1A] via-[#242424] to-[#121212] p-8 sm:p-14 text-[#F2F7F3] shadow-xl dark:shadow-2xl border border-[rgba(255, 255, 255,0.25)] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#050505]/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black border border-[rgba(255, 255, 255,0.2)] text-[#2D7DFF]">
                <Sparkles className="w-4 h-4 text-[#2D7DFF]" />
                <span>Begin Today with Yardly Automotives</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight leading-tight text-[#F2F7F3]">
                Ready to Start Your Automotive Journey?
              </h2>

              <p className="text-sm sm:text-base text-[#A7BDB3] leading-relaxed">
                Explore vehicles, discover automotive services or create your Yardly Automotives account and get started.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0 w-full sm:w-auto justify-center">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto font-black px-7 py-4 shadow-xl btn-glow flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </Button>
              </Link>

              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto font-bold px-6 py-4 bg-white/10 dark:bg-[#121212]/90 border-[rgba(255, 255, 255,0.25)] text-[#F2F7F3] hover:border-[#2D7DFF] hover:text-[#2D7DFF] flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4 text-[#2D7DFF]" />
                  <span>Sign In</span>
                </Button>
              </Link>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
};
