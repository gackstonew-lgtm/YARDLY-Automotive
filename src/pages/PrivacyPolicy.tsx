import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { useSEO } from '../lib/hooks/useSEO';
import { siteConfig } from '../config/site';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  useSEO({
    title: 'Privacy Policy | Yardly Automotives',
    description: 'Learn how Yardly Automotives collects, handles, and protects your automotive inquiry, vehicle listing, and contact information.',
    canonical: `${siteConfig.url}/privacy`
  });

  return (
    <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#001A13] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col font-sans selection:bg-[#00E878] selection:text-[#001A13] pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-12">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#EDF5F1] via-[#E4EFEA] to-[#DBE9E2] dark:from-[#00251B] dark:via-[#001F17] dark:to-[#001A13] border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-3 text-center sm:text-left">
          <Link to="/" className="inline-flex items-center gap-1 text-xs font-bold text-[#009E52] dark:text-[#00E878] hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#009E52]/10 dark:bg-[#00E878]/10 border border-[#009E52]/20 dark:border-[#00E878]/30 text-xs font-bold uppercase tracking-wider text-[#009E52] dark:text-[#00E878]">
            <ShieldCheck className="w-4 h-4" />
            <span>TRANSPARENCY & DATA PROTECTION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F241C] dark:text-[#F2F7F3]">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#355347] dark:text-[#8EA79C]">
            Effective Date: September 2026 • Last Updated: September 7, 2026
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 flex-1">
        <div className="bg-white dark:bg-[#00251B]/80 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] p-6 sm:p-10 space-y-8 shadow-sm text-sm text-[#355347] dark:text-[#A7BDB3] leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0F241C] dark:text-[#F2F7F3] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#009E52] dark:text-[#00E878]" />
              1. Overview & Commitment
            </h2>
            <p>
              {siteConfig.legalName} ("{siteConfig.name}", "we", "us", or "our") is dedicated to protecting your privacy. This Privacy Policy details how we collect, use, disclose, and safeguard information when you use our automotive marketplace, request vehicle inspections, submit listings, or communicate with our team.
            </p>
          </section>

          <section className="space-y-3 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.1)] pt-6">
            <h2 className="text-xl font-bold text-[#0F241C] dark:text-[#F2F7F3] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#009E52] dark:text-[#00E878]" />
              2. Information We Collect
            </h2>
            <p>We only collect information necessary to facilitate automotive transactions and customer inquiries:</p>
            <ul className="list-disc pl-5 space-y-1.5 pt-1">
              <li><strong>Contact Inquiries:</strong> Full name, phone number, email address, and inquiry messages submitted for specific vehicles.</li>
              <li><strong>Seller Submissions:</strong> Vehicle specifications (make, model, year, registration number, mileage, condition) and ownership documentation (logbook photos) submitted for verification.</li>
              <li><strong>Inspection & Reservation Requests:</strong> Preferred inspection dates, viewing yard locations, and reservation reference numbers.</li>
              <li><strong>Local Device Storage:</strong> We use browser localStorage to maintain your selected theme preferences (light/dark mode) and user session state.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.1)] pt-6">
            <h2 className="text-xl font-bold text-[#0F241C] dark:text-[#F2F7F3] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#009E52] dark:text-[#00E878]" />
              3. How We Use Your Information
            </h2>
            <p>Your data is used strictly for legitimate automotive business operations:</p>
            <ul className="list-disc pl-5 space-y-1.5 pt-1">
              <li>Connecting prospective buyers with verified vehicle listings and certified car yards.</li>
              <li>Validating vehicle logbooks, ownership credentials, and NTSA registration authenticity.</li>
              <li>Processing vehicle reservation holding guarantees and dispatching confirmation notifications.</li>
              <li>Responding directly to inquiries via WhatsApp, email, or telephone.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.1)] pt-6">
            <h2 className="text-xl font-bold text-[#0F241C] dark:text-[#F2F7F3] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#009E52] dark:text-[#00E878]" />
              4. Data Sharing & Security
            </h2>
            <p>
              We do not sell, rent, or trade your personal information. Relevant vehicle specifications and contact details are shared only with designated yard administrators or verified inspection partners to facilitate viewing schedules. All stored data is protected by industry-standard encryption protocols.
            </p>
          </section>

          <section className="space-y-3 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.1)] pt-6">
            <h2 className="text-xl font-bold text-[#0F241C] dark:text-[#F2F7F3]">
              5. Contact Us Regarding Your Data
            </h2>
            <p>
              If you have any questions, requests for data correction, or privacy inquiries, please contact our data governance team:
            </p>
            <div className="p-4 rounded-2xl bg-[#F4F8F6] dark:bg-[#001F17] text-xs text-[#0F241C] dark:text-[#F2F7F3] space-y-1 font-medium">
              <div><strong>Company:</strong> {siteConfig.legalName}</div>
              <div><strong>Email:</strong> {siteConfig.contact.email}</div>
              <div><strong>Phone:</strong> {siteConfig.contact.phone}</div>
              <div><strong>Location:</strong> {siteConfig.contact.address}</div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
