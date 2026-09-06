import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Key, ShieldCheck, Calendar, MapPin, CheckCircle2, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const CarHirePage: React.FC = () => {
  const hireCategories = [
    { title: 'Executive SUVs & Prado', price: 'From KES 12,000 / day', desc: 'Ideal for upcountry trips, executive travel, and corporate site visits.' },
    { title: 'Saloon & Economy Cars', price: 'From KES 4,500 / day', desc: 'Efficient automatic sedans and hatchbacks for Nairobi city mobility.' },
    { title: 'Chauffeur-Driven Luxury', price: 'From KES 25,000 / day', desc: 'Mercedes-Benz E/S-Class and Range Rover with professional uniformed drivers.' },
    { title: 'Pickups & Commercial Vans', price: 'From KES 8,000 / day', desc: 'Double-cab Hilux and Hiace vans for cargo, haulage, and team transport.' }
  ];

  return (
    <div className="min-h-screen bg-[#001A13] text-[#F2F7F3] flex flex-col pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-8 font-sans">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-[#00251B] via-[#001F17] to-[#001A13] border-b border-[rgba(180,255,210,0.12)] text-[#F2F7F3] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002B1F]/90 border border-[#00E878]/30 text-xs font-extrabold uppercase tracking-wider text-[#00E878]">
            <Key className="w-4 h-4 text-[#00E878]" />
            <span>FLEXIBLE SHORT & LONG TERM VEHICLE HIRE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F2F7F3]">
            Car Hire Services
          </h1>
          <p className="text-sm sm:text-base text-[#8EA79C] max-w-2xl mx-auto">
            Rent fully insured, logbook-verified vehicles directly from verified Yardly Automotives fleet partners across Kenya. Self-drive and chauffeur-driven options available.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow space-y-10">
        
        {/* Hire Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hireCategories.map((cat, idx) => (
            <div key={idx} className="bg-[#00251B]/90 backdrop-blur-md rounded-3xl p-6 border border-[rgba(180,255,210,0.12)] shadow-xl hover:border-[#00E878]/40 hover:shadow-[0_12px_40px_-8px_rgba(0,232,120,0.15)] transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-extrabold text-[#00E878] uppercase tracking-wider">{cat.price}</div>
                <h3 className="text-lg font-black text-[#F2F7F3]">{cat.title}</h3>
                <p className="text-xs text-[#8EA79C] leading-relaxed">{cat.desc}</p>
              </div>
              <div className="pt-2 border-t border-[rgba(180,255,210,0.12)]">
                <a href="https://wa.me/254712052104?text=Hi%2C%20I%20want%20to%20inquire%20about%20car%20hire%20services" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" fullWidth className="font-extrabold">
                    Inquire Hire Availability
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-[#00251B]/90 backdrop-blur-md rounded-3xl p-8 border border-[rgba(180,255,210,0.12)] shadow-xl max-w-4xl mx-auto space-y-6">
          <h2 className="text-xl font-black text-[#F2F7F3] text-center">Why Hire Through Yardly Automotives?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1">
              <div className="font-extrabold text-[#F2F7F3] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00E878]" /> Fully Insured Vehicles
              </div>
              <p className="text-[#8EA79C]">Comprehensive PSV & commercial car hire insurance included.</p>
            </div>
            <div className="space-y-1">
              <div className="font-extrabold text-[#F2F7F3] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00E878]" /> GPS Tracked Fleet
              </div>
              <p className="text-[#8EA79C]">24/7 roadside assistance & GPS monitoring for total peace of mind.</p>
            </div>
            <div className="space-y-1">
              <div className="font-extrabold text-[#F2F7F3] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00E878]" /> Easy M-Pesa Booking
              </div>
              <p className="text-[#8EA79C]">Reserve with transparent deposit via secure M-Pesa STK push.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
