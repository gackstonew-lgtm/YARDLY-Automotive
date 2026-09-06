import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation, ShieldCheck, Smartphone, Bell, Cpu, ArrowRight } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { Button } from '../ui/Button';

export const TrackerSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#001A13] border-b border-[rgba(180,255,210,0.1)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Professional Technician Photo Card */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <Reveal direction="left">
              <div className="relative rounded-3xl overflow-hidden bg-[#00251B] border border-[rgba(180,255,210,0.18)] p-3 shadow-2xl group hover-lift">
                <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#001711]">
                  <img
                    src="/services/tracker_install.jpg"
                    alt="Professional Vehicle GPS Tracker Installation"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001A13] via-transparent to-transparent opacity-70" />
                  
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001A13]/85 backdrop-blur-md border border-[rgba(180,255,210,0.25)] text-xs font-black text-[#00E878]">
                    <Cpu className="w-3.5 h-3.5 text-[#00E878]" />
                    <span>Certified Installation</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-[#001A13]/95 backdrop-blur-md p-4 rounded-xl border border-[rgba(180,255,210,0.15)] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-[#F2F7F3]">Vehicle Telemetry & GPS</div>
                      <div className="text-[11px] text-[#8EA79C]">Mobile app monitoring & instant alerts</div>
                    </div>
                    <Link to="/trackers">
                      <Button size="sm" variant="primary" className="font-extrabold text-xs">
                        Details
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002B1F] border border-[rgba(180,255,210,0.15)] text-xs font-extrabold uppercase tracking-wider text-[#00E878]">
                <Navigation className="w-3.5 h-3.5 text-[#00E878]" />
                <span>Vehicle Telematics & Security</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#F2F7F3] leading-tight mt-3">
                Stay Connected to Your Vehicle
              </h2>

              <p className="text-sm sm:text-base text-[#8EA79C] leading-relaxed">
                Protect your vehicle with professional tracker installation and access to technology designed to help you stay informed about your vehicle.
              </p>

              {/* Functional Highlights */}
              <div className="space-y-3 pt-2">
                <div className="bg-[#00251B]/60 p-3.5 rounded-2xl border border-[rgba(180,255,210,0.08)] flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-[#00E878] shrink-0" />
                  <div className="text-xs text-[#8EA79C]"><strong className="text-[#F2F7F3]">Real-Time GPS Tracking:</strong> Monitor vehicle location, route history, and playback from your smartphone.</div>
                </div>

                <div className="bg-[#00251B]/60 p-3.5 rounded-2xl border border-[rgba(180,255,210,0.08)] flex items-center gap-3">
                  <Bell className="w-5 h-5 text-[#00E878] shrink-0" />
                  <div className="text-xs text-[#8EA79C]"><strong className="text-[#F2F7F3]">Instant Notifications:</strong> Geofencing alerts, engine on/off triggers, and speed warning reports.</div>
                </div>

                <div className="bg-[#00251B]/60 p-3.5 rounded-2xl border border-[rgba(180,255,210,0.08)] flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#00E878] shrink-0" />
                  <div className="text-xs text-[#8EA79C]"><strong className="text-[#F2F7F3]">Concealed Installation:</strong> Clean, non-intrusive electrical wiring by certified automotive technicians.</div>
                </div>
              </div>

              <div className="pt-3">
                <Link to="/trackers">
                  <Button variant="primary" className="font-extrabold shadow-lg flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    <span>Learn About Tracking</span>
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
