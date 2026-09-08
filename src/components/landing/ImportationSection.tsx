import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight, Plane, CheckCircle2, Shield } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { Button } from '../ui/Button';

export const ImportationSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#0A0A0A] border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.1)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Content & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <Reveal direction="left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF2EE] dark:bg-[#121212] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.15)] text-xs font-extrabold uppercase tracking-wider text-[#0251B8] dark:text-[#2D7DFF]">
                <Globe className="w-3.5 h-3.5 text-[#0251B8] dark:text-[#2D7DFF]" />
                <span>Global Vehicle Sourcing</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0F241C] dark:text-[#F2F7F3] leading-tight mt-3">
                Vehicle Importation Made Simpler
              </h2>

              <p className="text-sm sm:text-base text-[#355347] dark:text-[#8EA79C] leading-relaxed">
                Looking for a vehicle beyond the local market? Yardly Automotives helps customers navigate vehicle sourcing and importation with a clear, convenient approach from selection to arrival.
              </p>

              {/* Import Process Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-[#F4F8F6] dark:bg-[#121212]/70 p-4 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.1)] space-y-1.5">
                  <div className="text-xs font-bold text-[#0F241C] dark:text-[#F2F7F3] flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#0251B8] dark:text-[#2D7DFF]" />
                    <span>Japan, UK & Thailand Sourcing</span>
                  </div>
                  <p className="text-[11px] text-[#5F7E71] dark:text-[#8EA79C]">Access trusted international auction catalogs and supplier inventories.</p>
                </div>

                <div className="bg-[#F4F8F6] dark:bg-[#121212]/70 p-4 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.1)] space-y-1.5">
                  <div className="text-xs font-bold text-[#0F241C] dark:text-[#F2F7F3] flex items-center gap-1.5">
                    <Plane className="w-4 h-4 text-[#0251B8] dark:text-[#2D7DFF]" />
                    <span>Clear Sourcing Support</span>
                  </div>
                  <p className="text-[11px] text-[#5F7E71] dark:text-[#8EA79C]">Assistance with vehicle selection, duty calculations, and tracking updates.</p>
                </div>
              </div>

              <div className="pt-3">
                <Link to="/import">
                  <Button variant="primary" className="font-extrabold shadow-lg flex items-center gap-2">
                    <span>Explore Importation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right: Premium Vehicle Visual */}
          <div className="lg:col-span-6">
            <Reveal direction="right">
              <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#121212] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.18)] p-3 shadow-lg dark:shadow-2xl group hover-lift">
                <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#EBF2EE] dark:bg-[#0A0A0A]">
                  <img
                    src="/Car Images/Mercedes-Benz_S-Class_01.jpeg"
                    alt="Direct Vehicle Importation with Yardly Automotives"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />
                  
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-[#050505]/85 backdrop-blur-md border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.25)] text-xs font-black text-[#0251B8] dark:text-[#2D7DFF]">
                    <Globe className="w-3.5 h-3.5 text-[#0251B8] dark:text-[#2D7DFF]" />
                    <span>Global Import Assistance</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-md p-4 rounded-xl border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.15)] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">Custom Import Requests</div>
                      <div className="text-[11px] text-[#5F7E71] dark:text-[#8EA79C]">Specify your exact make, trim, year & budget</div>
                    </div>
                    <Link to="/import">
                      <Button size="sm" variant="primary" className="font-extrabold text-xs">
                        Request
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
};
