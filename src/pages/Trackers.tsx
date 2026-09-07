import React, { useState } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Navigation, ShieldCheck, CheckCircle2, Phone, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useSEO } from '../lib/hooks/useSEO';
import { siteConfig } from '../config/site';
import { Analytics } from '../lib/analytics';

export const TrackersPage: React.FC = () => {
  useSEO({
    title: 'GPS Car Tracker Installation & Fleet Security Kenya',
    description: 'Certified GPS tracker installation and anti-theft security in Kenya. Real-time tracking, remote engine immobilization, and geo-fencing alerts.',
    canonical: `${siteConfig.url}/trackers`
  });

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [carDetails, setCarDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const trackerFeatures = [
    { title: 'Real-Time GPS Tracking', desc: 'Live mobile app and web portal monitoring across Kenya, Uganda, and Tanzania.' },
    { title: 'Remote Engine Cut-Off', desc: 'Instantly immobilize your vehicle via SMS or mobile app in case of unauthorized access.' },
    { title: 'Geo-Fencing Alerts', desc: 'Receive instant notifications whenever your vehicle enters or exits designated zones.' },
    { title: 'Speed & Fuel Analytics', desc: 'Monitor driver speed, harsh braking, mileage reports, and fuel consumption trends.' }
  ];

  return (
    <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#001A13] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-8 font-sans">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-[#E6F4ED] via-[#EDF7F2] to-[#F4F8F6] dark:from-[#00251B] dark:via-[#001F17] dark:to-[#001A13] border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] text-[#0F241C] dark:text-[#F2F7F3] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#002B1F]/90 border border-[#009E52]/30 dark:border-[#00E878]/30 text-xs font-extrabold uppercase tracking-wider text-[#009E52] dark:text-[#00E878] shadow-xs">
            <Navigation className="w-4 h-4 text-[#009E52] dark:text-[#00E878]" />
            <span>24/7 SATELLITE FLEET & PRIVATE VEHICLE SECURITY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0F241C] dark:text-[#F2F7F3]">
            GPS Tracker Installations
          </h1>
          <p className="text-sm sm:text-base text-[#355347] dark:text-[#8EA79C] max-w-2xl mx-auto">
            Protect your investment with certified real-time GPS tracking, remote immobilizers, and insurance-approved vehicle security systems installed by certified technicians in Nairobi, Mombasa, and Nakuru.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow space-y-10">
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trackerFeatures.map((feat, idx) => (
            <div key={idx} className="bg-white dark:bg-[#00251B]/90 backdrop-blur-md rounded-3xl p-6 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] shadow-sm dark:shadow-xl hover:border-[#009E52]/40 dark:hover:border-[#00E878]/40 hover:shadow-md dark:hover:shadow-[0_12px_40px_-8px_rgba(0,232,120,0.15)] transition-all space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E6F4ED] dark:bg-[#003D2D]/60 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.15)] text-[#009E52] dark:text-[#00E878] flex items-center justify-center font-black">
                <CheckCircle2 className="w-5 h-5 text-[#009E52] dark:text-[#00E878]" />
              </div>
              <h3 className="text-base font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">{feat.title}</h3>
              <p className="text-xs text-[#355347] dark:text-[#8EA79C] leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Booking / Inquiry & Telematics Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Left: Telematics Showcase Card */}
          <div className="lg:col-span-5 bg-white dark:bg-[#00251B]/90 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.1)] dark:border-[rgba(180,255,210,0.18)] p-5 sm:p-6 shadow-lg dark:shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="relative aspect-square sm:aspect-4/3 lg:aspect-square rounded-2xl overflow-hidden bg-[#EBF2EE] dark:bg-[#001711]">
                <img
                  src="/Car Images/VEHICLE TELEMATICS & SECURITY.jpeg"
                  alt="Vehicle Telematics & Security"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-[#001A13]/85 backdrop-blur-md border border-[rgba(0,60,40,0.15)] dark:border-[rgba(180,255,210,0.25)] text-xs font-black text-[#009E52] dark:text-[#00E878]">
                  Live Satellite Telemetry
                </div>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-black text-[#0F241C] dark:text-[#F2F7F3]">
                  Always Track. Always Protected.
                </h3>
                <p className="text-xs text-[#5F7E71] dark:text-[#8EA79C] leading-relaxed">
                  24/7 real-time GPS tracking, remote immobilizer engine cut-off, and instant smartphone notifications across Kenya.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.1)] flex items-center justify-between">
              <span className="text-xs font-bold text-[#355347] dark:text-[#A7BDB3]">Need instant support?</span>
              <a
                href="https://wa.me/254712052104?text=Hi%2C%20I%20am%20inquiring%20about%20Vehicle%20Telematics%20and%20GPS%20Tracker%20Installation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-black text-[#009E52] dark:text-[#00E878] hover:underline"
              >
                Chat on WhatsApp →
              </a>
            </div>
          </div>

          {/* Right: Booking / Inquiry Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#00251B]/90 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.1)] dark:border-[rgba(180,255,210,0.18)] p-6 sm:p-10 shadow-lg dark:shadow-2xl space-y-6 flex flex-col justify-center">
            <div className="border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] pb-4">
              <h2 className="text-xl font-black text-[#0F241C] dark:text-[#F2F7F3]">Book a Tracker Installation</h2>
              <p className="text-xs text-[#355347] dark:text-[#8EA79C] mt-1">Our mobile technicians can visit your yard, home, or office for installation.</p>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-[#E6F4ED] dark:bg-[#003D2D] text-[#009E52] dark:text-[#00E878] border border-[#009E52]/30 dark:border-[#00E878]/30 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#0F241C] dark:text-[#F2F7F3]">Installation Booking Received!</h3>
                <p className="text-xs text-[#355347] dark:text-[#8EA79C]">Our security team will call you shortly to confirm your installation slot.</p>
                <Button onClick={() => setSubmitted(false)} variant="outline">Book Another Vehicle</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Samuel Ochieng"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Phone Number *"
                  placeholder="0712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <Input
                  label="Vehicle Make & Model *"
                  placeholder="e.g. 2021 Toyota Prado / Mazda CX-5"
                  value={carDetails}
                  onChange={(e) => setCarDetails(e.target.value)}
                  required
                />
                <Button type="submit" fullWidth className="font-extrabold py-3 btn-glow">
                  Request Installation Booking
                </Button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
