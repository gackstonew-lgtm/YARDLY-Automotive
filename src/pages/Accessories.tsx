import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Package, Wrench, ShieldCheck, Search, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const AccessoriesPage: React.FC = () => {
  const categories = [
    { title: 'Body Parts & Bumper Guards', desc: 'Grilles, side steps, bull bars, roof racks, and OEM body trims.' },
    { title: 'Engine & Performance Spares', desc: 'Air filters, brake pads, spark plugs, timing belts, and oil filters.' },
    { title: 'Electronics & Audio', desc: 'Android infotainment screens, dashcams, sound systems, and LED headlights.' },
    { title: 'Wheels & Tyres', desc: 'Alloy rims, all-terrain tyres, run-flat tyres, and wheel alignment accessories.' },
    { title: 'Interior Accessories', desc: 'Custom leather seat covers, 7D floor mats, steering covers, and sunshades.' },
    { title: 'Fluids & Care Products', desc: 'Synthetic engine oils, ceramic coating kits, car shampoos, and detailing polishes.' }
  ];

  return (
    <div className="min-h-screen bg-[#001A13] text-[#F2F7F3] flex flex-col pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-8 font-sans">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-[#00251B] via-[#001F17] to-[#001A13] border-b border-[rgba(180,255,210,0.12)] text-[#F2F7F3] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002B1F]/90 border border-[#00E878]/30 text-xs font-extrabold uppercase tracking-wider text-[#00E878]">
            <Wrench className="w-4 h-4 text-[#00E878]" />
            <span>OEM & AFTERMARKET AUTO SPARES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F2F7F3]">
            Car Accessories & Spare Parts
          </h1>
          <p className="text-sm sm:text-base text-[#8EA79C] max-w-2xl mx-auto">
            Source genuine Japanese, European, and American auto spare parts, accessories, and performance upgrades verified by Yardly Automotives partner car yards across Kenya.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow space-y-10">
        
        {/* Search Bar */}
        <div className="bg-[#00251B]/90 backdrop-blur-md rounded-3xl p-6 border border-[rgba(180,255,210,0.12)] shadow-xl max-w-3xl mx-auto space-y-4">
          <h3 className="text-base font-extrabold text-[#F2F7F3]">Search Parts & Accessories</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input placeholder="e.g. Prado TX Brake Pads, RAV4 Headlight, 7D Mats" className="flex-grow" />
            <Button variant="primary" className="font-extrabold" icon={<Search className="w-4 h-4" />}>
              Search Catalog
            </Button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-[#F2F7F3]">Parts Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-[#00251B]/90 backdrop-blur-md rounded-3xl p-6 border border-[rgba(180,255,210,0.12)] shadow-xl hover:border-[#00E878]/40 hover:shadow-[0_12px_40px_-8px_rgba(0,232,120,0.15)] transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#003D2D]/60 border border-[rgba(180,255,210,0.15)] text-[#00E878] flex items-center justify-center font-black">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-[#F2F7F3]">{cat.title}</h3>
                  <p className="text-xs text-[#8EA79C] leading-relaxed">{cat.desc}</p>
                </div>
                <div className="pt-2 border-t border-[rgba(180,255,210,0.12)]">
                  <a href="tel:0712052104" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#00E878] hover:text-[#55FF78] transition-colors">
                    <span>Inquire Part Stock</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact/Inquiry Box */}
        <div className="bg-[#00251B]/90 backdrop-blur-md rounded-3xl p-8 border border-[rgba(180,255,210,0.12)] shadow-2xl max-w-3xl mx-auto space-y-4 text-center">
          <ShieldCheck className="w-10 h-10 text-[#00E878] mx-auto" />
          <h3 className="text-xl font-black text-[#F2F7F3]">Need Specific OEM Parts?</h3>
          <p className="text-xs text-[#8EA79C] max-w-md mx-auto">
            Our Nairobi and Mombasa car-yard logistics teams source rare mechanical, body, and electrical spare parts directly from verified suppliers.
          </p>
          <div className="pt-2">
            <a href="https://wa.me/254712052104?text=Hi%2C%20I%20am%20looking%20for%20car%20accessories%20and%20spares" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="font-extrabold">
                Chat with Parts Specialist
              </Button>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
