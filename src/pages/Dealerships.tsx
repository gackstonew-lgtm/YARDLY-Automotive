import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Building, MapPin, ShieldCheck, Phone, Mail, Car, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';

export const DealershipsPage: React.FC = () => {
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
    <div className="min-h-screen bg-[#001A13] text-[#F2F7F3] flex flex-col pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-8 font-sans">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-[#00251B] via-[#001F17] to-[#001A13] border-b border-[rgba(180,255,210,0.12)] text-[#F2F7F3] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002B1F]/90 border border-[#00E878]/30 text-xs font-extrabold uppercase tracking-wider text-[#00E878]">
            <Building className="w-4 h-4 text-[#00E878]" />
            <span>VERIFIED KENYAN CAR YARD DIRECTORY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F2F7F3]">
            Partner Dealerships & Car Yards
          </h1>
          <p className="text-sm sm:text-base text-[#8EA79C] max-w-2xl mx-auto">
            Explore verified car yards and licensed auto dealers across Nairobi, Mombasa, and Nakuru. Every listed dealer is logbook-audited and background-verified by Yardly Automotives.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow space-y-8">
        
        {/* Dealership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {yards.map((yard, idx) => (
            <div key={idx} className="bg-[#00251B]/90 backdrop-blur-md rounded-3xl p-6 border border-[rgba(180,255,210,0.12)] shadow-xl hover:border-[#00E878]/40 hover:shadow-[0_12px_40px_-8px_rgba(0,232,120,0.15)] transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="verified" size="sm">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Logbook Verified Yard
                  </Badge>
                  <span className="text-xs font-bold text-[#00E878]">{yard.inventoryCount}</span>
                </div>
                <h3 className="text-xl font-extrabold text-[#F2F7F3]">{yard.name}</h3>
                <div className="text-xs text-[#8EA79C] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#00E878]" />
                    <span>{yard.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-[#00E878]" />
                    <span>Specialties: {yard.specialty}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(180,255,210,0.12)] flex items-center justify-between gap-3">
                <a href={`tel:${yard.phone}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F2F7F3] hover:text-[#00E878]">
                  <Phone className="w-3.5 h-3.5 text-[#00E878]" />
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
