import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Plane, CheckCircle2, ShieldCheck, Ship, Globe, FileCheck, ArrowRight, Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ImportService, AuthService, AuthUser } from '../lib/supabase/client';
import { useSEO } from '../lib/hooks/useSEO';
import { siteConfig } from '../config/site';

export const ImportServicePage: React.FC = () => {
  useSEO({
    title: 'Direct Vehicle Importation to Kenya | Japan, UK & Thailand',
    description: 'Custom vehicle import services to Kenya from Japan, UK, South Africa, and Thailand. 2026 8-year age compliant with complete port clearance.',
    canonical: `${siteConfig.url}/import`
  });

  const [user, setUser] = useState<AuthUser | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('0712052104');
  const [country, setCountry] = useState('Kenya');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [yearMin, setYearMin] = useState<number>(2019);
  const [budget, setBudget] = useState<number>(3500000);
  const [preferredSourceCountry, setPreferredSourceCountry] = useState('Japan');
  const [shippingPreference, setShippingPreference] = useState('RoRo');
  const [preferredSpecs, setPreferredSpecs] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [docFileName, setDocFileName] = useState('');
  const [docFileUrl, setDocFileUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    AuthService.getCurrentUser().then(u => {
      if (u) {
        setUser(u);
        setFullName(u.full_name || '');
        setEmail(u.email || '');
        setPhone(u.phone || '0712052104');
      }
    });
  }, []);

  const handleDocFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocFileUrl(reader.result as string || file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (!make || !model || !budget || !phone) {
        setErrorMsg('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      const res = await ImportService.create({
        user_id: user?.id,
        full_name: fullName,
        email,
        phone,
        country,
        preferred_source_country: preferredSourceCountry,
        make,
        model,
        year_min: yearMin,
        budget,
        preferred_specs: preferredSpecs,
        shipping_preference: shippingPreference,
        additional_requirements: additionalRequirements
      });

      setSubmittedRef(res.reference_number);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to submit import request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#001A13] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col font-sans selection:bg-[#00E878] selection:text-[#001A13]">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#EDF5F1] via-[#E4EFEA] to-[#DBE9E2] dark:from-[#00140F] dark:via-[#00251B] dark:to-[#001F17] border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] text-[#0F241C] dark:text-[#F2F7F3] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#009E52]/10 dark:bg-[#002B1F]/90 border border-[#009E52]/20 dark:border-[#00E878]/30 text-xs font-extrabold uppercase tracking-wider text-[#009E52] dark:text-[#00E878]">
            <Globe className="w-4 h-4 text-[#009E52] dark:text-[#00E878]" />
            <span>GLOBAL VEHICLE SOURCING & CUSTOMS CLEARANCE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0F241C] dark:text-[#F2F7F3]">
            Custom Vehicle Import Sourcing
          </h1>
          <p className="text-sm sm:text-base text-[#355347] dark:text-[#8EA79C] max-w-2xl mx-auto">
            Order your dream car directly from Japan, the United Kingdom, Australia, or Dubai. We handle auction bidding, QISJ inspections, ocean freight shipping, and KRA customs clearance to Mombasa.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-12 w-full flex-grow">
        {submittedRef ? (
          <div className="bg-white dark:bg-[#00251B]/90 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.18)] p-8 sm:p-12 shadow-sm dark:shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-[#E0F8EC] dark:bg-[#003D2D] text-[#009E52] dark:text-[#00E878] border border-[#009E52]/30 dark:border-[#00E878]/30 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#0F241C] dark:text-[#F2F7F3]">Import Sourcing Request Registered!</h2>
              <p className="text-sm text-[#355347] dark:text-[#8EA79C] max-w-md mx-auto">
                Thank you, <strong className="text-[#0F241C] dark:text-[#F2F7F3]">{fullName}</strong>. Your custom import request has been dispatched to our international sourcing team.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F4F8F6] dark:bg-[#001F17] border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.15)] inline-block w-full max-w-md text-left space-y-2">
              <div className="text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase tracking-wider">Import Reference Code</div>
              <div className="text-2xl font-black font-mono text-[#009E52] dark:text-[#00E878]">{submittedRef}</div>
              <div className="text-xs text-[#355347] dark:text-[#8EA79C] pt-2 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)]">
                Requested: <strong className="text-[#0F241C] dark:text-[#F2F7F3]">{make} {model} ({preferredSourceCountry})</strong>
              </div>
            </div>

            <p className="text-xs text-[#355347] dark:text-[#8EA79C] max-w-lg mx-auto">
              Our import logistics specialist will contact you via <strong className="text-[#0F241C] dark:text-[#F2F7F3]">{phone}</strong> with verified auction listings and CIF Mombasa quotations.
            </p>

            <div className="flex justify-center gap-4 pt-4">
              <Button onClick={() => setSubmittedRef(null)} variant="outline">
                Submit Another Request
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#00251B]/90 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.18)] p-6 sm:p-10 shadow-sm dark:shadow-2xl space-y-8">
            <div className="border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] pb-6">
              <h2 className="text-2xl font-black text-[#0F241C] dark:text-[#F2F7F3]">Direct Import Sourcing Application</h2>
              <p className="text-xs sm:text-sm text-[#355347] dark:text-[#8EA79C] mt-1">
                Fill in your desired vehicle specifications and budget to begin sourcing.
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-800/50 text-xs font-semibold text-red-700 dark:text-red-300 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500 dark:text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Contact Info */}
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#009E52] dark:text-[#00E878] mb-4">
                  1. Buyer Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Full Name *"
                    placeholder="e.g. Dr. Sarah Odhiambo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="sodhiambo@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    label="Phone Number *"
                    placeholder="+254 733 000 111"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Sourcing Requirements */}
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#009E52] dark:text-[#00E878] mb-4">
                  2. Vehicle Sourcing Requirements
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] mb-1.5">Preferred Source Country *</label>
                    <select
                      value={preferredSourceCountry}
                      onChange={(e) => setPreferredSourceCountry(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(180,255,210,0.18)] text-xs font-bold text-[#0F241C] dark:text-[#F2F7F3] bg-[#F4F8F6] dark:bg-[#001F17] focus:outline-none focus:ring-2 focus:ring-[#009E52] dark:focus:ring-[#00E878]"
                    >
                      <option value="Japan" className="bg-white dark:bg-[#001F17] text-[#0F241C] dark:text-[#F2F7F3]">Japan (JDM / USS Auctions)</option>
                      <option value="United Kingdom" className="bg-white dark:bg-[#001F17] text-[#0F241C] dark:text-[#F2F7F3]">United Kingdom (UK Specs)</option>
                      <option value="Australia" className="bg-white dark:bg-[#001F17] text-[#0F241C] dark:text-[#F2F7F3]">Australia</option>
                      <option value="Dubai" className="bg-white dark:bg-[#001F17] text-[#0F241C] dark:text-[#F2F7F3]">Dubai / UAE</option>
                    </select>
                  </div>
                  <Input
                    label="Vehicle Make *"
                    placeholder="e.g. Lexus / Toyota / BMW"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    required
                  />
                  <Input
                    label="Vehicle Model *"
                    placeholder="e.g. RX450h / Land Cruiser"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                  />
                  <Input
                    label="Minimum Year of Manufacture *"
                    type="number"
                    value={yearMin}
                    onChange={(e) => setYearMin(parseInt(e.target.value) || 2019)}
                    required
                  />
                  <Input
                    label="Target Budget (KES CIF Mombasa) *"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
                    required
                  />
                  <div>
                    <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] mb-1.5">Shipping Method Preference</label>
                    <select
                      value={shippingPreference}
                      onChange={(e) => setShippingPreference(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(180,255,210,0.18)] text-xs font-bold text-[#0F241C] dark:text-[#F2F7F3] bg-[#F4F8F6] dark:bg-[#001F17] focus:outline-none focus:ring-2 focus:ring-[#009E52] dark:focus:ring-[#00E878]"
                    >
                      <option value="RoRo" className="bg-white dark:bg-[#001F17] text-[#0F241C] dark:text-[#F2F7F3]">Roll-on/Roll-off (RoRo)</option>
                      <option value="Container" className="bg-white dark:bg-[#001F17] text-[#0F241C] dark:text-[#F2F7F3]">Dedicated Container Shipping</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Preferred Specs & Additional Notes */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] mb-1.5">Preferred Trim & Options</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Sunroof, Leather interior, 360 camera, White or Black exterior..."
                    value={preferredSpecs}
                    onChange={(e) => setPreferredSpecs(e.target.value)}
                    className="w-full p-4 rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(180,255,210,0.18)] text-xs text-[#0F241C] dark:text-[#F2F7F3] bg-[#F4F8F6] dark:bg-[#001F17] placeholder-[#355347]/50 dark:placeholder-[#8EA79C]/50 focus:outline-none focus:ring-2 focus:ring-[#009E52] dark:focus:ring-[#00E878]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] mb-1.5">Additional Requirements</label>
                  <textarea
                    rows={2}
                    placeholder="Any special inspection certs, delivery destination, financing requests..."
                    value={additionalRequirements}
                    onChange={(e) => setAdditionalRequirements(e.target.value)}
                    className="w-full p-4 rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(180,255,210,0.18)] text-xs text-[#0F241C] dark:text-[#F2F7F3] bg-[#F4F8F6] dark:bg-[#001F17] placeholder-[#355347]/50 dark:placeholder-[#8EA79C]/50 focus:outline-none focus:ring-2 focus:ring-[#009E52] dark:focus:ring-[#00E878]"
                  />
                </div>

                {/* Import Authorization & Logbook PDF/DOC Upload */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase tracking-wider">
                    Upload PIN / Import Authorization Document (.pdf / .doc)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E0F8EC] dark:bg-[#003D2D] text-[#009E52] dark:text-[#00E878] border border-[#009E52]/30 dark:border-[#00E878]/30 text-xs font-extrabold shadow-sm hover:bg-[#D0F2E2] dark:hover:bg-[#004D39] transition-all">
                      <FileText className="w-4 h-4 text-[#009E52] dark:text-[#00E878]" />
                      <span>Select Document (.pdf / .doc)</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleDocFileUpload}
                        className="hidden"
                      />
                    </label>
                    {docFileName && (
                      <div className="flex items-center gap-2 bg-[#F4F8F6] dark:bg-[#003D2D]/80 border border-[#009E52]/30 dark:border-[#00E878]/30 text-[#009E52] dark:text-[#00E878] px-3 py-1.5 rounded-lg text-xs font-bold">
                        <FileText className="w-4 h-4" />
                        <span className="truncate max-w-[200px]">{docFileName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)]">
                <Button type="submit" fullWidth loading={loading} className="py-3.5 text-sm font-extrabold btn-glow">
                  Submit Direct Import Request
                </Button>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
};
