import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Building, MapPin, ShieldCheck, Phone, Mail, Car, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/hooks/useSEO';
import { siteConfig } from '../config/site';

export const DealershipsPage: React.FC = () => {
  useSEO({
    title: 'Certified Car Dealership Network Kenya | Yardly Automotives',
    description: 'Explore verified car yards and automotive dealership partners across Kenya. Inspect stock in Nairobi, Mombasa, and Nakuru.',
    canonical: `${siteConfig.url}/dealerships`
  });

  const yards = [
    {
      name: 'Nairobi Motors Hub Ltd',
      location: 'Ngong Road, Nairobi',
      inventoryCount: '15+ Vehicles',
      specialty: 'Toyota, Lexus, Land Rover',
      phone: '+254 700 888 999',
      verified: true
    },
    {
      name: 'Yardly Imports Hub',
      location: 'Mombasa Road, Nairobi',
      inventoryCount: '10+ Direct Container Imports',
      specialty: 'Japanese & UK Direct Imports',
      phone: '0712052104',
      verified: true
    },
    {
      name: 'Coastline Auto Yard',
      location: 'Nyali, Mombasa',
      inventoryCount: '8+ Vehicles',
      specialty: 'Nissan, Mazda, Subaru',
      phone: '+254 733 998 877',
      verified: true
    },
    {
      name: 'Rift Valley Commercial Motors',
      location: 'Nakuru Town',
      inventoryCount: '6+ Trucks & Pickups',
      specialty: 'Isuzu, Ford, Toyota Hilux',
      phone: '+254 722 554 433',
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#050505] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-8 font-sans">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-[#EBF2FC] via-[#EDF7F2] to-[#F4F8F6] dark:from-[#121212] dark:via-[#0A0A0A] dark:to-[#050505] border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] text-[#0F241C] dark:text-[#F2F7F3] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#121212]/90 border border-[#0251B8]/30 dark:border-[#2D7DFF]/30 text-xs font-extrabold uppercase tracking-wider text-[#0251B8] dark:text-[#2D7DFF] shadow-xs">
            <Building className="w-4 h-4 text-[#0251B8] dark:text-[#2D7DFF]" />
            <span>VERIFIED KENYAN CAR YARD DIRECTORY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0F241C] dark:text-[#F2F7F3]">
            Partner Dealerships & Car Yards
          </h1>
          <p className="text-sm sm:text-base text-[#355347] dark:text-[#8EA79C] max-w-2xl mx-auto">
            Explore verified car yards and licensed auto dealers across Nairobi, Mombasa, and Nakuru. Every listed dealer is logbook-audited and background-verified by Yardly Automotives.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow space-y-8">
        
        {/* Dealership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {yards.map((yard, idx) => (
            <div key={idx} className="bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl p-6 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] shadow-sm dark:shadow-xl hover:border-[#0251B8]/40 dark:hover:border-[#2D7DFF]/40 hover:shadow-md dark:hover:shadow-[0_12px_40px_-8px_rgba(45, 125, 255,0.15)] transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="verified" size="sm">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Logbook Verified Yard
                  </Badge>
                  <span className="text-xs font-bold text-[#0251B8] dark:text-[#2D7DFF]">{yard.inventoryCount}</span>
                </div>
                <h3 className="text-xl font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">{yard.name}</h3>
                <div className="text-xs text-[#355347] dark:text-[#8EA79C] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0251B8] dark:text-[#2D7DFF]" />
                    <span>{yard.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-[#0251B8] dark:text-[#2D7DFF]" />
                    <span>Specialties: {yard.specialty}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] flex items-center justify-between gap-3">
                <a href={`tel:${yard.phone}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F241C] dark:text-[#F2F7F3] hover:text-[#0251B8] dark:hover:text-[#2D7DFF]">
                  <Phone className="w-3.5 h-3.5 text-[#0251B8] dark:text-[#2D7DFF]" />
                  <span>{yard.phone}</span>
                </a>
                <Link to="/buy">
                  <Button size="sm" variant="outline" className="font-extrabold text-xs">
                    View Yard Inventory
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
