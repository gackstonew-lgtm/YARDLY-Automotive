import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Package, Wrench, ShieldCheck, Search, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useSEO } from '../lib/hooks/useSEO';
import { siteConfig } from '../config/site';

export const AccessoriesPage: React.FC = () => {
  useSEO({
    title: 'Genuine Car Spares & Auto Accessories in Kenya',
    description: 'Shop genuine OEM car spare parts, body kits, android screens, batteries, filters, and accessories with nationwide delivery in Kenya.',
    canonical: `${siteConfig.url}/accessories`
  });

  const categories = [
    { 
      title: 'Custom 7D Floor Mats & Interior', 
      desc: 'All-weather custom diamond-stitched mats, executive leather seat covers, steering wraps, and sunshades.',
      image: '/Car Images/Custom Diamond-Stitched Mats.jpeg'
    },
    { 
      title: 'Alloy Wheels & Performance Tyres', 
      desc: 'Diamond-cut OEM alloy rims, all-terrain SUV tyres, run-flat tyres, and hubcentric wheel spacers.',
      image: '/Car Images/Diamond-Cut Alloy Wheels.jpeg'
    },
    { 
      title: 'Engine Filters & Iridium Plugs', 
      desc: 'OEM air filters, oil filters, cabin filters, and high-performance platinum/iridium spark plugs.',
      image: '/Car Images/Engine Filters & Spark Plugs.jpeg'
    },
    { 
      title: 'Brake Rotors & Ceramic Pads', 
      desc: 'Low-dust ceramic brake pads, slotted performance rotors, brake calipers, and hydraulic fluid.',
      image: '/Car Images/brake rotors & ceramic pads.jpeg'
    },
    { 
      title: 'LED Headlights & Lighting Units', 
      desc: 'Bi-LED projector headlight assemblies, sequential DRLs, fog lamps, and LED taillight upgrades.',
      image: '/Car Images/LED Projector Headlight Units.jpeg'
    },
    { 
      title: '12V Sealed AGM Heavy Duty Batteries', 
      desc: 'Maintenance-free start-stop AGM batteries, heavy-duty lead-acid, and hybrid auxiliary battery units.',
      image: '/Car Images/12V Sealed AGM Batteries.jpeg'
    },
    { 
      title: 'OEM Body Parts & Spares', 
      desc: 'Grilles, bumpers, side mirrors, fenders, suspension bushings, and genuine Japanese/European replacement body parts.',
      image: '/Car Images/car parts and accessories.jpeg'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#050505] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-8 font-sans">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-[#EBF2FC] via-[#EDF7F2] to-[#F4F8F6] dark:from-[#121212] dark:via-[#0A0A0A] dark:to-[#050505] border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] text-[#0F241C] dark:text-[#F2F7F3] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#121212]/90 border border-[#0251B8]/30 dark:border-[#2D7DFF]/30 text-xs font-extrabold uppercase tracking-wider text-[#0251B8] dark:text-[#2D7DFF] shadow-xs">
            <Wrench className="w-4 h-4 text-[#0251B8] dark:text-[#2D7DFF]" />
            <span>OEM & AFTERMARKET AUTO SPARES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0F241C] dark:text-[#F2F7F3]">
            Car Accessories & Spare Parts
          </h1>
          <p className="text-sm sm:text-base text-[#355347] dark:text-[#8EA79C] max-w-2xl mx-auto">
            Source genuine Japanese, European, and American auto spare parts, accessories, and performance upgrades verified by Yardly Automotives partner car yards across Kenya.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow space-y-10">
        
        {/* Search Bar */}
        <div className="bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl p-6 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] shadow-sm dark:shadow-xl max-w-3xl mx-auto space-y-4">
          <h3 className="text-base font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">Search Parts & Accessories</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input placeholder="e.g. Prado TX Brake Pads, RAV4 Headlight, 7D Mats" className="flex-grow" />
            <Button variant="primary" className="font-extrabold btn-glow" icon={<Search className="w-4 h-4" />}>
              Search Catalog
            </Button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#0F241C] dark:text-[#F2F7F3]">Featured Parts & Accessories</h2>
              <p className="text-xs text-[#355347] dark:text-[#8EA79C] mt-0.5">Authentic Kenyan market vehicle upgrades and OEM spares.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div key={idx} className="group bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] shadow-sm dark:shadow-xl hover:border-[#0251B8]/40 dark:hover:border-[#2D7DFF]/40 hover:shadow-md dark:hover:shadow-[0_12px_40px_-8px_rgba(45, 125, 255,0.15)] transition-all flex flex-col justify-between overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0A0A]">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#050505]/85 backdrop-blur-md border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] text-[10px] font-black uppercase text-[#0251B8] dark:text-[#2D7DFF]">
                    OEM Certified
                  </div>
                </div>
                <div className="p-5 flex flex-col justify-between flex-grow space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold text-[#0F241C] dark:text-[#F2F7F3] group-hover:text-[#0251B8] dark:group-hover:text-[#2D7DFF] transition-colors">{cat.title}</h3>
                    <p className="text-xs text-[#355347] dark:text-[#8EA79C] leading-relaxed line-clamp-2">{cat.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)]">
                    <a 
                      href={`https://wa.me/254712052104?text=Hi%2C%20I%20am%20inquiring%20about%20${encodeURIComponent(cat.title)}%20at%20Yardly%20Automotives.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0251B8] hover:text-[#014196] dark:text-[#2D7DFF] dark:hover:text-[#FF3B4E] transition-colors"
                    >
                      <span>Inquire Stock & Pricing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact/Inquiry Box */}
        <div className="bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl p-8 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] shadow-lg dark:shadow-2xl max-w-3xl mx-auto space-y-4 text-center">
          <ShieldCheck className="w-10 h-10 text-[#0251B8] dark:text-[#2D7DFF] mx-auto" />
          <h3 className="text-xl font-black text-[#0F241C] dark:text-[#F2F7F3]">Need Specific OEM Parts?</h3>
          <p className="text-xs text-[#355347] dark:text-[#8EA79C] max-w-md mx-auto">
            Our Nairobi and Mombasa car-yard logistics teams source rare mechanical, body, and electrical spare parts directly from verified suppliers.
          </p>
          <div className="pt-2">
            <a href="https://wa.me/254712052104?text=Hi%2C%20I%20am%20looking%20for%20car%20accessories%20and%20spares" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="font-extrabold btn-glow">
                Chat with Parts Specialist
              </Button>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
