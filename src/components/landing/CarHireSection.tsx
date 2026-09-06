import React from 'react';
import { Link } from 'react-router-dom';
import { Key, ArrowRight, ShieldCheck, MapPin, Calendar } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { Button } from '../ui/Button';

export const CarHireSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#F4F8F6] dark:bg-[#001A13] border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.1)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Vehicle Image Card */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <Reveal direction="left">
              <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#00251B] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(180,255,210,0.18)] p-3 shadow-lg dark:shadow-2xl group hover-lift">
                <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#EBF2EE] dark:bg-[#001711]">
                  <img
                    src="/Car Images/Toyota_Land_Cruiser_200_01.jpeg"
                    alt="Car Hire & Rental Fleet with Yardly Automotives"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />
                  
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-[#001A13]/85 backdrop-blur-md border border-[rgba(0,60,40,0.15)] dark:border-[rgba(180,255,210,0.25)] text-xs font-black text-[#009E52] dark:text-[#00E878]">
                    <Key className="w-3.5 h-3.5 text-[#009E52] dark:text-[#00E878]" />
                    <span>Fleet & Rental Services</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#001A13]/95 backdrop-blur-md p-4 rounded-xl border border-[rgba(0,60,40,0.1)] dark:border-[rgba(180,255,210,0.15)] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">SUVs, Sedans & 4x4s</div>
                      <div className="text-[11px] text-[#5F7E71] dark:text-[#8EA79C]">Self-drive and chauffeur options</div>
                    </div>
                    <Link to="/car-hire">
                      <Button size="sm" variant="primary" className="font-extrabold text-xs">
                        View Fleet
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Content & CTA */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <Reveal direction="right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF2EE] dark:bg-[#002B1F] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(180,255,210,0.15)] text-xs font-extrabold uppercase tracking-wider text-[#009E52] dark:text-[#00E878]">
                <Key className="w-3.5 h-3.5 text-[#009E52] dark:text-[#00E878]" />
                <span>Car Hire & Mobility Solutions</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0F241C] dark:text-[#F2F7F3] leading-tight mt-3">
                Drive When You Need To
              </h2>

              <p className="text-sm sm:text-base text-[#355347] dark:text-[#8EA79C] leading-relaxed">
                From short trips to extended journeys, explore convenient vehicle hire options designed to give you flexibility on the road.
              </p>

              {/* Hire Benefits */}
              <div className="space-y-3 pt-2">
                <div className="bg-white/80 dark:bg-[#00251B]/60 p-3.5 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.08)] flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#009E52] dark:text-[#00E878] shrink-0" />
                  <div className="text-xs text-[#5F7E71] dark:text-[#8EA79C]"><strong className="text-[#0F241C] dark:text-[#F2F7F3]">Flexible Durations:</strong> Daily, weekly, and monthly corporate leasing options.</div>
                </div>

                <div className="bg-white/80 dark:bg-[#00251B]/60 p-3.5 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.08)] flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#009E52] dark:text-[#00E878] shrink-0" />
                  <div className="text-xs text-[#5F7E71] dark:text-[#8EA79C]"><strong className="text-[#0F241C] dark:text-[#F2F7F3]">Convenient Pickup:</strong> Station pickups in Nairobi, Mombasa, Nakuru, and Eldoret.</div>
                </div>

                <div className="bg-white/80 dark:bg-[#00251B]/60 p-3.5 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.08)] flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#009E52] dark:text-[#00E878] shrink-0" />
                  <div className="text-xs text-[#5F7E71] dark:text-[#8EA79C]"><strong className="text-[#0F241C] dark:text-[#F2F7F3]">Maintained Fleet:</strong> Rigorously serviced vehicles with 24/7 roadside assistance.</div>
                </div>
              </div>

              <div className="pt-3">
                <Link to="/car-hire">
                  <Button variant="primary" className="font-extrabold shadow-lg flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    <span>Explore Car Hire</span>
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
};
