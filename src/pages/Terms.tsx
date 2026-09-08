import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { useSEO } from '../lib/hooks/useSEO';
import { siteConfig } from '../config/site';
import { ShieldCheck, FileCheck, Scale, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Terms: React.FC = () => {
  useSEO({
    title: 'Terms of Service | Yardly Automotives',
    description: 'Read the Terms and Conditions for vehicle listings, direct imports, trade-ins, and automotive marketplace services on Yardly Automotives.',
    canonical: `${siteConfig.url}/terms`
  });

  return (
    <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#050505] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col font-sans selection:bg-[#0251B8] dark:selection:bg-[#2D7DFF] selection:text-[#050505] pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-12">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#EDF5F1] via-[#E4EFEA] to-[#DBE9E2] dark:from-[#121212] dark:via-[#0A0A0A] dark:to-[#050505] border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-3 text-center sm:text-left">
          <Link to="/" className="inline-flex items-center gap-1 text-xs font-bold text-[#0251B8] dark:text-[#2D7DFF] hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0251B8]/10 dark:bg-[#2D7DFF]/10 border border-[#0251B8]/20 dark:border-[#2D7DFF]/30 text-xs font-bold uppercase tracking-wider text-[#0251B8] dark:text-[#2D7DFF]">
            <Scale className="w-4 h-4" />
            <span>PLATFORM GUIDELINES & USAGE TERMS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F241C] dark:text-[#F2F7F3]">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-[#355347] dark:text-[#8EA79C]">
            Effective Date: September 2026 • Last Updated: September 7, 2026
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 flex-1">
        <div className="bg-white dark:bg-[#121212]/80 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] p-6 sm:p-10 space-y-8 shadow-sm text-sm text-[#355347] dark:text-[#A7BDB3] leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0F241C] dark:text-[#F2F7F3] flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#0251B8] dark:text-[#2D7DFF]" />
              1. Agreement to Terms
            </h2>
            <p>
              By accessing or using {siteConfig.name} ("the Platform", operated by {siteConfig.legalName}), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform or services.
            </p>
          </section>

          <section className="space-y-3 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.1)] pt-6">
            <h2 className="text-xl font-bold text-[#0F241C] dark:text-[#F2F7F3] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0251B8] dark:text-[#2D7DFF]" />
              2. Vehicle Listings & Verification
            </h2>
            <p>
              Yardly Automotives provides marketplace listings for verified automotive dealerships and private sellers. While we make every reasonable effort to verify vehicle logbooks, physical conditions, and NTSA registration records, prospective buyers are encouraged to conduct an in-person yard inspection prior to finalizing purchase agreements.
            </p>
          </section>

          <section className="space-y-3 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.1)] pt-6">
            <h2 className="text-xl font-bold text-[#0F241C] dark:text-[#F2F7F3] flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#0251B8] dark:text-[#2D7DFF]" />
              3. Vehicle Holding & Reservations
            </h2>
            <p>
              Holding deposits placed via the platform (standard KES {siteConfig.reservation.defaultDepositKES.toLocaleString()}) guarantee a temporary {siteConfig.reservation.holdingPeriodDays}-day exclusive viewing reservation. Deposits are held in escrow and are 100% refundable if physical inspection reveals unlisted mechanical or documentation discrepancies.
            </p>
          </section>

          <section className="space-y-3 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.1)] pt-6">
            <h2 className="text-xl font-bold text-[#0F241C] dark:text-[#F2F7F3] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#0251B8] dark:text-[#2D7DFF]" />
              4. Import Regulations & Compliance
            </h2>
            <p>
              All direct vehicle import inquiries are subject to Kenyan 2026 automotive regulations, specifically the max {siteConfig.importRules.USED_IMPORT_MAX_AGE_YEARS}-year age restriction ({siteConfig.importRules.CURRENT_YEAR - siteConfig.importRules.USED_IMPORT_MAX_AGE_YEARS}+ manufacture years) and Right-Hand Drive (RHD) steering compliance.
            </p>
          </section>

          <section className="space-y-3 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.1)] pt-6">
            <h2 className="text-xl font-bold text-[#0F241C] dark:text-[#F2F7F3]">
              5. Governing Law & Contact
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Republic of Kenya.
            </p>
            <div className="p-4 rounded-2xl bg-[#F4F8F6] dark:bg-[#0A0A0A] text-xs text-[#0F241C] dark:text-[#F2F7F3] space-y-1 font-medium">
              <div><strong>Entity:</strong> {siteConfig.legalName}</div>
              <div><strong>Support:</strong> {siteConfig.contact.email}</div>
              <div><strong>Direct Line:</strong> {siteConfig.contact.phone}</div>
              <div><strong>Registered Office:</strong> {siteConfig.contact.address}</div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Terms;
