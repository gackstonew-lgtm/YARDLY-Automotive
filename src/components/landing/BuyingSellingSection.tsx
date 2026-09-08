import React from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, CheckCircle2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { Button } from '../ui/Button';

export const BuyingSellingSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#F4F8F6] dark:bg-[#050505] border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.1)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Interactive Media Card */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <Reveal direction="left">
              <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#121212] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.18)] p-3 shadow-lg dark:shadow-2xl group hover-lift">
                <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#EBF2EE] dark:bg-[#0A0A0A]">
                  <img
                    src="/Car Images/2020 BMW X6 35D.jpeg"
                    alt="Buy or Sell Quality Vehicles With Yardly Automotives"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />
                  
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-[#050505]/85 backdrop-blur-md border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.25)] text-xs font-black text-[#0251B8] dark:text-[#2D7DFF]">
                    <Tag className="w-3.5 h-3.5 text-[#0251B8] dark:text-[#2D7DFF]" />
                    <span>Marketplace Inventory</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-md p-4 rounded-xl border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.15)] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">Browse Verified Stock</div>
                      <div className="text-[11px] text-[#5F7E71] dark:text-[#8EA79C]">Over 500+ Japanese & European Models</div>
                    </div>
                    <Link to="/buy">
                      <Button size="sm" variant="primary" className="font-extrabold text-xs">
                        Browse
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Content & Actionable CTAs */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <Reveal direction="right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF2EE] dark:bg-[#121212] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.15)] text-xs font-extrabold uppercase tracking-wider text-[#0251B8] dark:text-[#2D7DFF]">
                <span>Automotive Marketplace</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0F241C] dark:text-[#F2F7F3] leading-tight mt-3">
                Buy or Sell With Confidence
              </h2>

              <p className="text-sm sm:text-base text-[#355347] dark:text-[#8EA79C] leading-relaxed">
                Whether you're searching for your next vehicle or preparing to sell your current one, Yardly Automotives connects you with a straightforward automotive marketplace designed around informed decisions.
              </p>

              {/* Service Key Pillars */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 bg-white/80 dark:bg-[#121212]/50 p-3 rounded-xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.08)]">
                  <CheckCircle2 className="w-5 h-5 text-[#0251B8] dark:text-[#2D7DFF] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#0F241C] dark:text-[#F2F7F3]">For Buyers</h4>
                    <p className="text-[11px] text-[#5F7E71] dark:text-[#8EA79C]">Verified vehicle photos, complete specs, mileage history, and instant reservation deposits.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/80 dark:bg-[#121212]/50 p-3 rounded-xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.08)]">
                  <CheckCircle2 className="w-5 h-5 text-[#0251B8] dark:text-[#2D7DFF] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#0F241C] dark:text-[#F2F7F3]">For Sellers & Dealerships</h4>
                    <p className="text-[11px] text-[#5F7E71] dark:text-[#8EA79C]">List private cars or fleet stock to reach verified buyers across Kenya quickly.</p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <Link to="/buy">
                  <Button variant="primary" className="font-extrabold shadow-lg flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    <span>Explore Vehicles</span>
                  </Button>
                </Link>

                <Link to="/sell">
                  <Button variant="outline" className="font-extrabold bg-white dark:bg-[#121212] border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] text-[#0F241C] dark:text-[#F2F7F3] hover:border-[#0251B8] dark:hover:border-[#2D7DFF] hover:text-[#0251B8] dark:hover:text-[#2D7DFF] flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-rose-500" />
                    <span>Sell Your Vehicle</span>
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
