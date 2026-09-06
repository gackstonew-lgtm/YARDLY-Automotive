import React from 'react';
import { Link } from 'react-router-dom';
import { Building, ArrowRight, ShieldCheck, Users, TrendingUp } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { Button } from '../ui/Button';

export const DealershipSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#001711] border-b border-[rgba(180,255,210,0.1)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Copy & Partnership Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <Reveal direction="left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002B1F] border border-[rgba(180,255,210,0.15)] text-xs font-extrabold uppercase tracking-wider text-[#00E878]">
                <Building className="w-3.5 h-3.5 text-[#00E878]" />
                <span>Commercial Dealership Network</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#F2F7F3] leading-tight mt-3">
                Grow Your Dealership With Yardly
              </h2>

              <p className="text-sm sm:text-base text-[#8EA79C] leading-relaxed">
                Give your dealership greater visibility through Yardly Automotives. Showcase your vehicles, reach potential buyers and build a stronger digital presence for your automotive business.
              </p>

              {/* Partnership Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-[#00251B]/70 p-4 rounded-2xl border border-[rgba(180,255,210,0.1)] space-y-1.5">
                  <div className="text-xs font-bold text-[#F2F7F3] flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#00E878]" />
                    <span>Digital Inventory Showcase</span>
                  </div>
                  <p className="text-[11px] text-[#8EA79C]">Display high-resolution photos, spec sheets, and price points to qualified automotive buyers.</p>
                </div>

                <div className="bg-[#00251B]/70 p-4 rounded-2xl border border-[rgba(180,255,210,0.1)] space-y-1.5">
                  <div className="text-xs font-bold text-[#F2F7F3] flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#00E878]" />
                    <span>Dealer Management Portal</span>
                  </div>
                  <p className="text-[11px] text-[#8EA79C]">Dedicated admin console to update listings, track buyer enquiries, and manage vehicle status.</p>
                </div>
              </div>

              <div className="pt-3">
                <Link to="/dealerships">
                  <Button variant="primary" className="font-extrabold shadow-lg flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span>Partner With Yardly</span>
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right: Showroom Image */}
          <div className="lg:col-span-6">
            <Reveal direction="right">
              <div className="relative rounded-3xl overflow-hidden bg-[#00251B] border border-[rgba(180,255,210,0.18)] p-3 shadow-2xl group hover-lift">
                <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#001711]">
                  <img
                    src="/Car Images/Mercedes-AMG_GLE_53_Coupe_01.jpeg"
                    alt="Partner Car Dealership Showroom with Yardly Automotives"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001A13] via-transparent to-transparent opacity-70" />
                  
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001A13]/85 backdrop-blur-md border border-[rgba(180,255,210,0.25)] text-xs font-black text-[#00E878]">
                    <Building className="w-3.5 h-3.5 text-[#00E878]" />
                    <span>Car Yard Partners</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-[#001A13]/95 backdrop-blur-md p-4 rounded-xl border border-[rgba(180,255,210,0.15)] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-[#F2F7F3]">Join Dealership Network</div>
                      <div className="text-[11px] text-[#8EA79C]">Nairobi, Mombasa, Nakuru & Countrywide</div>
                    </div>
                    <Link to="/dealerships">
                      <Button size="sm" variant="primary" className="font-extrabold text-xs">
                        Partner
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
