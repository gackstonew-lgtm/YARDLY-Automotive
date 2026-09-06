import React, { useState } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Navigation, ShieldCheck, CheckCircle2, Phone, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const TrackersPage: React.FC = () => {
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
    <div className="min-h-screen bg-[#001A13] text-[#F2F7F3] flex flex-col pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-8 font-sans">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-[#00251B] via-[#001F17] to-[#001A13] border-b border-[rgba(180,255,210,0.12)] text-[#F2F7F3] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002B1F]/90 border border-[#00E878]/30 text-xs font-extrabold uppercase tracking-wider text-[#00E878]">
            <Navigation className="w-4 h-4 text-[#00E878]" />
            <span>24/7 SATELLITE FLEET & PRIVATE VEHICLE SECURITY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F2F7F3]">
            GPS Tracker Installations
          </h1>
          <p className="text-sm sm:text-base text-[#8EA79C] max-w-2xl mx-auto">
            Protect your investment with certified real-time GPS tracking, remote immobilizers, and insurance-approved vehicle security systems installed by certified technicians in Nairobi, Mombasa, and Nakuru.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow space-y-10">
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trackerFeatures.map((feat, idx) => (
            <div key={idx} className="bg-[#00251B]/90 backdrop-blur-md rounded-3xl p-6 border border-[rgba(180,255,210,0.12)] shadow-xl hover:border-[#00E878]/40 hover:shadow-[0_12px_40px_-8px_rgba(0,232,120,0.15)] transition-all space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#003D2D]/60 border border-[rgba(180,255,210,0.15)] text-[#00E878] flex items-center justify-center font-black">
                <CheckCircle2 className="w-5 h-5 text-[#00E878]" />
              </div>
              <h3 className="text-base font-extrabold text-[#F2F7F3]">{feat.title}</h3>
              <p className="text-xs text-[#8EA79C] leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Booking / Inquiry Form */}
        <div className="bg-[#00251B]/90 backdrop-blur-md rounded-3xl border border-[rgba(180,255,210,0.18)] p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto space-y-6">
          <div className="border-b border-[rgba(180,255,210,0.12)] pb-4">
            <h2 className="text-xl font-black text-[#F2F7F3]">Book a Tracker Installation</h2>
            <p className="text-xs text-[#8EA79C] mt-1">Our mobile technicians can visit your yard, home, or office for installation.</p>
          </div>

          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 bg-[#003D2D] text-[#00E878] border border-[#00E878]/30 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#F2F7F3]">Installation Booking Received!</h3>
              <p className="text-xs text-[#8EA79C]">Our security team will call you shortly to confirm your installation slot.</p>
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
              <Button type="submit" fullWidth className="font-extrabold py-3">
                Request Installation Booking
              </Button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
