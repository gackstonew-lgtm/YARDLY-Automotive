import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { ShieldCheck, Award, CheckCircle2, Zap, Phone, Mail, MapPin } from 'lucide-react';
import { siteConfig } from '../config/site';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#001A13] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-8 font-sans">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-[#E6F4ED] via-[#EDF7F2] to-[#F4F8F6] dark:from-[#00251B] dark:via-[#001F17] dark:to-[#001A13] border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] text-[#0F241C] dark:text-[#F2F7F3] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#002B1F]/90 border border-[#009E52]/30 dark:border-[#00E878]/30 text-xs font-extrabold uppercase tracking-wider text-[#009E52] dark:text-[#00E878] shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#009E52] dark:text-[#00E878]" />
            <span>DRIVEN BY QUALITY. BUILT AROUND YOU.</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0F241C] dark:text-[#F2F7F3]">
            About Yardly Automotives
          </h1>
          <p className="text-sm sm:text-base text-[#355347] dark:text-[#8EA79C] max-w-2xl mx-auto leading-relaxed">
            At Yardly Automotives, we make the vehicle buying experience straightforward, transparent, and customer-focused. Our goal is to connect you with vehicles that match your needs, preferences, and budget while making every step of the journey simple and informed.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow space-y-10">
        
        {/* Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#00251B]/90 backdrop-blur-md rounded-3xl p-6 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] shadow-sm dark:shadow-xl hover:border-[#009E52]/40 dark:hover:border-[#00E878]/40 hover:shadow-md dark:hover:shadow-[0_12px_40px_-8px_rgba(0,232,120,0.15)] transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E6F4ED] dark:bg-[#003D2D]/60 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.15)] text-[#009E52] dark:text-[#00E878] flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5 text-[#009E52] dark:text-[#00E878]" />
            </div>
            <h3 className="text-lg font-black text-[#0F241C] dark:text-[#F2F7F3]">Quality-Focused</h3>
            <p className="text-xs text-[#355347] dark:text-[#8EA79C] leading-relaxed">
              We present vehicles with clear information and verified specifications to help you make confident choices.
            </p>
          </div>

          <div className="bg-white dark:bg-[#00251B]/90 backdrop-blur-md rounded-3xl p-6 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] shadow-sm dark:shadow-xl hover:border-[#009E52]/40 dark:hover:border-[#00E878]/40 hover:shadow-md dark:hover:shadow-[0_12px_40px_-8px_rgba(0,232,120,0.15)] transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E6F4ED] dark:bg-[#003D2D]/60 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.15)] text-[#009E52] dark:text-[#00E878] flex items-center justify-center font-black">
              <Zap className="w-5 h-5 text-[#009E52] dark:text-[#00E878]" />
            </div>
            <h3 className="text-lg font-black text-[#0F241C] dark:text-[#F2F7F3]">Customer-First Service</h3>
            <p className="text-xs text-[#355347] dark:text-[#8EA79C] leading-relaxed">
              Your needs come first, from your first enquiry to your final decision, with dedicated support at every step.
            </p>
          </div>

          <div className="bg-white dark:bg-[#00251B]/90 backdrop-blur-md rounded-3xl p-6 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] shadow-sm dark:shadow-xl hover:border-[#009E52]/40 dark:hover:border-[#00E878]/40 hover:shadow-md dark:hover:shadow-[0_12px_40px_-8px_rgba(0,232,120,0.15)] transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E6F4ED] dark:bg-[#003D2D]/60 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.15)] text-[#009E52] dark:text-[#00E878] flex items-center justify-center font-black">
              <Award className="w-5 h-5 text-[#009E52] dark:text-[#00E878]" />
            </div>
            <h3 className="text-lg font-black text-[#0F241C] dark:text-[#F2F7F3]">Transparent Information</h3>
            <p className="text-xs text-[#355347] dark:text-[#8EA79C] leading-relaxed">
              From exploring available vehicles to making your final choice, we're here to help you move forward with confidence.
            </p>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white dark:bg-[#00251B]/90 backdrop-blur-md rounded-3xl p-8 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] shadow-lg dark:shadow-2xl max-w-3xl mx-auto space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#0F241C] dark:text-[#F2F7F3]">Let's Find the Right Vehicle for You</h2>
            <p className="text-xs text-[#355347] dark:text-[#8EA79C] max-w-md mx-auto">
              Have a question about a vehicle or need help choosing your next car? Get in touch with Yardly Automotives and our team will be happy to assist.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#0F241C] dark:text-[#F2F7F3] pt-2">
            <div className="p-4 rounded-2xl bg-[#F4F8F6] dark:bg-[#001F17] border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] space-y-1">
              <MapPin className="w-5 h-5 text-[#009E52] dark:text-[#00E878] mx-auto mb-1" />
              <div className="font-bold">{siteConfig.contact.address}</div>
            </div>
            <a href={`tel:${siteConfig.contact.phone}`} className="p-4 rounded-2xl bg-[#F4F8F6] dark:bg-[#001F17] border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] space-y-1 hover:border-[#009E52] dark:hover:border-[#00E878] transition-colors">
              <Phone className="w-5 h-5 text-[#009E52] dark:text-[#00E878] mx-auto mb-1" />
              <div className="font-bold text-[#009E52] dark:text-[#00E878]">{siteConfig.contact.phone}</div>
            </a>
            <a href={`mailto:${siteConfig.contact.email}`} className="p-4 rounded-2xl bg-[#F4F8F6] dark:bg-[#001F17] border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] space-y-1 hover:border-[#009E52] dark:hover:border-[#00E878] transition-colors">
              <Mail className="w-5 h-5 text-[#009E52] dark:text-[#00E878] mx-auto mb-1" />
              <div className="font-bold text-[#009E52] dark:text-[#00E878] truncate">{siteConfig.contact.email}</div>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
