import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Mail, MapPin, ShieldCheck, MessageSquare } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { Analytics } from '../../lib/analytics';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-[#EBF2EE] dark:bg-[#000000] text-[#0F241C] dark:text-[#F2F7F3] pt-14 pb-10 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl overflow-hidden bg-white dark:bg-[#121212] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.18)] p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
                <img
                  src="/logo.jpeg"
                  alt="Yardly Automotives Logo"
                  className="h-full w-full object-contain rounded-lg"
                />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-[#0F241C] dark:text-[#F2F7F3] group-hover:text-[#0251B8] dark:group-hover:text-[#2D7DFF] transition-colors">
                  {siteConfig.name}
                </span>
                <span className="block text-[11px] font-bold text-[#0251B8] dark:text-[#2D7DFF]">
                  {siteConfig.tagline}
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#355347] dark:text-[#8EA79C] leading-relaxed max-w-sm">
              Yardly Automotives brings vehicle buying, selling, importation, trade-ins, auctions, car hire, spares, accessories, tracking and dealership marketing together in one convenient digital platform.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={`tel:${siteConfig.contact.phone}`}
                onClick={() => Analytics.trackPhoneClick('landing_footer')}
                aria-label={`Call Yardly Automotives at ${siteConfig.contact.phone}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#121212] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.15)] text-xs font-bold text-[#0251B8] dark:text-[#2D7DFF] hover:bg-[#D8E6DE] dark:hover:bg-[#1A1A1A] transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{siteConfig.contact.phone}</span>
              </a>

              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => Analytics.trackWhatsAppClick('landing_footer')}
                aria-label="Chat with Yardly Automotives on WhatsApp"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#121212] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.15)] text-xs font-bold text-[#0251B8] dark:text-[#FF3B4E] hover:bg-[#D8E6DE] dark:hover:bg-[#1A1A1A] transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Column 1: Marketplace */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0251B8] dark:text-[#2D7DFF]">Marketplace</h4>
            <ul className="space-y-2 text-xs text-[#355347] dark:text-[#A7BDB3]">
              <li><Link to="/buy" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors">Explore Vehicles</Link></li>
              <li><Link to="/sell" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors">Sell Your Car</Link></li>
              <li><Link to="/trade-in" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors">Vehicle Trade-In</Link></li>
              <li><Link to="/auction" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors">Vehicle Auctions</Link></li>
              <li><Link to="/import" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors">Direct Importation</Link></li>
            </ul>
          </div>

          {/* Column 2: Mobility & Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0251B8] dark:text-[#2D7DFF]">Services & Spares</h4>
            <ul className="space-y-2 text-xs text-[#355347] dark:text-[#A7BDB3]">
              <li><Link to="/accessories" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors">Car Spares & Accessories</Link></li>
              <li><Link to="/trackers" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors">Tracker Installation</Link></li>
              <li><Link to="/car-hire" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors">Car Hire & Rental</Link></li>
              <li><Link to="/dealerships" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors">Dealership Network</Link></li>
              <li><Link to="/about" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Portals & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0251B8] dark:text-[#2D7DFF]">Portals & Contact</h4>
            <ul className="space-y-2 text-xs text-[#355347] dark:text-[#A7BDB3]">
              <li><Link to="/login" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors">Sign In Portal</Link></li>
              <li><Link to="/register" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors">Create User Account</Link></li>
              <li><Link to="/admin/login" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#0251B8] dark:text-[#2D7DFF]" aria-hidden="true" /> Admin Login</Link></li>
              <li className="pt-2 text-[11px] text-[#5F7E71] dark:text-[#8EA79C] leading-snug">
                <MapPin className="w-3.5 h-3.5 inline mr-1 text-[#0251B8] dark:text-[#2D7DFF]" aria-hidden="true" />
                {siteConfig.contact.address}
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5F7E71] dark:text-[#5B7569]">
          <p>&copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] text-[#5F7E71] dark:text-[#8EA79C]">
            <Link to="/privacy" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-[#0251B8] dark:hover:text-[#2D7DFF] transition-colors">Terms of Service</Link>
            <span>•</span>
            <span>Verified Automotive Partner</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
