import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation, ShieldCheck, Smartphone, Bell, Cpu, ArrowRight, Lock, Radio } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { Button } from '../ui/Button';

export const TrackerSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#F4F8F6] dark:bg-[#001A13] border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.1)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left: Telematics & Security Visual Showcase */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <Reveal direction="left">
              <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#00251B] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(180,255,210,0.18)] p-3 sm:p-4 shadow-xl dark:shadow-2xl group hover-lift">
                <div className="relative aspect-square sm:h-[430px] rounded-2xl overflow-hidden bg-[#EBF2EE] dark:bg-[#001711]">
                  <img
                    src="/Car Images/VEHICLE TELEMATICS & SECURITY.jpeg"
                    alt="Vehicle Telematics & Security - Always Track. Always Protected."
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  
                  {/* Top Floating Badge */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#001A13]/90 backdrop-blur-md border border-[rgba(0,60,40,0.15)] dark:border-[rgba(180,255,210,0.25)] text-xs font-black text-[#009E52] dark:text-[#00E878] shadow-md">
                    <Radio className="w-3.5 h-3.5 text-[#009E52] dark:text-[#00E878] animate-pulse" />
                    <span>24/7 Satellite Telemetry Active</span>
                  </div>

                  {/* Bottom Overlay Summary */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#001A13]/95 backdrop-blur-md p-4 rounded-2xl border border-[rgba(0,60,40,0.1)] dark:border-[rgba(180,255,210,0.18)] flex items-center justify-between shadow-lg">
                    <div className="min-w-0 pr-3">
                      <div className="text-xs sm:text-sm font-black text-[#0F241C] dark:text-[#F2F7F3] truncate">
                        Always Track. Always Protected.
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-bold text-[#5F7E71] dark:text-[#8EA79C] truncate">
                        Live Tracking • 24/7 Security • Mobile App Control
                      </div>
                    </div>
                    <Link to="/trackers" className="shrink-0">
                      <Button size="sm" variant="primary" className="font-extrabold text-xs shadow-sm">
                        <span>Get Tracker</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Copy & Feature Highlights */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <Reveal direction="right">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF2EE] dark:bg-[#002B1F] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(180,255,210,0.15)] text-xs font-extrabold uppercase tracking-wider text-[#009E52] dark:text-[#00E878]">
                <Navigation className="w-3.5 h-3.5 text-[#009E52] dark:text-[#00E878]" />
                <span>Vehicle Telematics & Security</span>
              </div>

              <div className="space-y-2 mt-3">
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0F241C] dark:text-[#F2F7F3] leading-tight">
                  Always Track. Always Protected.
                </h2>
                <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#009E52] dark:text-[#00E878]">
                  Live Tracking • 24/7 Security • Full Mobile Control
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#355347] dark:text-[#8EA79C] leading-relaxed">
                Protect your vehicle with certified real-time GPS telemetry, anti-theft immobilizers, and smartphone monitoring. Expertly installed by certified automotive technicians across Kenya.
              </p>

              {/* Functional Highlights matching creative asset */}
              <div className="space-y-3 pt-2">
                <div className="bg-white/90 dark:bg-[#00251B]/80 p-4 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.1)] flex items-start gap-3.5 shadow-sm">
                  <div className="p-2 rounded-xl bg-[#E6F4ED] dark:bg-[#003D2D]/60 text-[#009E52] dark:text-[#00E878] shrink-0 mt-0.5">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-[#0F241C] dark:text-[#F2F7F3]">Live Real-Time Tracking</h3>
                    <p className="text-xs text-[#5F7E71] dark:text-[#8EA79C] mt-0.5 leading-relaxed">
                      Instant pinpoint satellite location, continuous route playback, trip mileage logs, and geofencing boundaries.
                    </p>
                  </div>
                </div>

                <div className="bg-white/90 dark:bg-[#00251B]/80 p-4 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.1)] flex items-start gap-3.5 shadow-sm">
                  <div className="p-2 rounded-xl bg-[#E6F4ED] dark:bg-[#003D2D]/60 text-[#009E52] dark:text-[#00E878] shrink-0 mt-0.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-[#0F241C] dark:text-[#F2F7F3]">24/7 Security & Remote Immobilizer</h3>
                    <p className="text-xs text-[#5F7E71] dark:text-[#8EA79C] mt-0.5 leading-relaxed">
                      Remote engine cut-off command, anti-tamper alarms, unauthorized movement alerts, and battery disconnect protection.
                    </p>
                  </div>
                </div>

                <div className="bg-white/90 dark:bg-[#00251B]/80 p-4 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.1)] flex items-start gap-3.5 shadow-sm">
                  <div className="p-2 rounded-xl bg-[#E6F4ED] dark:bg-[#003D2D]/60 text-[#009E52] dark:text-[#00E878] shrink-0 mt-0.5">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-[#0F241C] dark:text-[#F2F7F3]">Full Smartphone App Control</h3>
                    <p className="text-xs text-[#5F7E71] dark:text-[#8EA79C] mt-0.5 leading-relaxed">
                      Dedicated iOS & Android application with real-time push alerts, speed notifications, and multi-vehicle fleet dashboards.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link to="/trackers">
                  <Button variant="primary" className="font-extrabold shadow-lg flex items-center gap-2 btn-glow">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Book Tracker Installation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <a
                  href="https://wa.me/254712052104?text=Hi%2C%20I%20am%20inquiring%20about%20Vehicle%20Telematics%20and%20GPS%20Tracker%20Installation"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="font-extrabold flex items-center gap-2">
                    <span>Chat With Security Team</span>
                  </Button>
                </a>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
};

