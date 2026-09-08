import React, { useState } from 'react';
import { ShieldCheck, Upload, Trash2, CheckCircle2, Car, AlertCircle, ArrowRight, FileText } from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SellerSubmissionService } from '../lib/submissions/submission.service';
import { EmailService } from '../lib/email/resend';
import { siteConfig } from '../config/site';
import { useSEO } from '../lib/hooks/useSEO';
import { Analytics } from '../lib/analytics';

export const SellCar: React.FC = () => {
  useSEO({
    title: 'Sell Your Car | Direct to Verified Buyers in Kenya',
    description: 'Sell your car quickly and safely in Kenya. Connect with verified buyers and car yards across the country with Yardly Automotives.',
    canonical: `${siteConfig.url}/sell`
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [sellerType, setSellerType] = useState<'private' | 'dealer'>('private');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('0712052104');
  const [sellerEmail, setSellerEmail] = useState('');
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2019');
  const [regNum, setRegNum] = useState('');
  const [mileage, setMileage] = useState('');
  const [engineCc, setEngineCc] = useState('');
  const [transmission, setTransmission] = useState('Automatic');
  const [fuelType, setFuelType] = useState('Petrol');
  const [bodyType, setBodyType] = useState('SUV');
  const [location, setLocation] = useState('Nairobi');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<'Brand New' | 'Foreign Used' | 'Locally Used'>('Foreign Used');
  const [images, setImages] = useState<string[]>([]);
  const [logbookUrl, setLogbookUrl] = useState('');
  const [logbookFileName, setLogbookFileName] = useState('');

  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImages(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleLogbookFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogbookFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogbookUrl(reader.result as string || file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName || !sellerPhone || !sellerEmail || !model || !price || !regNum) {
      setErrorMsg('Please fill in all required fields including seller info, vehicle model, registration number, and asking price.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const submission = await SellerSubmissionService.create({
        seller_name: sellerName,
        seller_phone: sellerPhone,
        seller_email: sellerEmail,
        seller_type: sellerType,
        make,
        model,
        year: Number(year),
        registration_number: regNum,
        mileage: Number(mileage) || 0,
        engine_cc: Number(engineCc) || 2000,
        transmission: transmission as any,
        fuel_type: fuelType as any,
        body_type: bodyType as any,
        location,
        asking_price: Number(price),
        description,
        condition,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
        logbook_document_url: logbookUrl || undefined
      });

      // Dispatch confirmation email
      const html = EmailService.generateSellerSubmissionEmailHtml(sellerName, `${year} ${make} ${model}`);
      await EmailService.sendEmail({
        to: sellerEmail,
        subject: `Vehicle Listing Submitted — ${siteConfig.name}`,
        html
      });

      Analytics.trackEvent('listing_submit', {
        item_name: `${year} ${make} ${model}`,
        item_category: 'Automotive Listing',
        price: Number(price)
      });

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#050505] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col font-sans selection:bg-[#0251B8] dark:selection:bg-[#2D7DFF] selection:text-[#050505]">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-[#EDF5F1] via-[#E4EFEA] to-[#DBE9E2] dark:from-[#000000] dark:via-[#121212] dark:to-[#0A0A0A] border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] text-[#0F241C] dark:text-[#F2F7F3] py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2D7DFF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0251B8]/10 dark:bg-[#2D7DFF]/10 border border-[#0251B8]/20 dark:border-[#2D7DFF]/30 text-xs font-bold uppercase tracking-wider text-[#0251B8] dark:text-[#2D7DFF]">
            <ShieldCheck className="w-4 h-4 text-[#0251B8] dark:text-[#2D7DFF]" />
            DIRECT TO VERIFIED BUYERS
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F241C] dark:text-[#F2F7F3]">
            Sell Your Car Without the Hassle
          </h1>
          <p className="text-base sm:text-lg text-[#355347] dark:text-[#8EA79C] max-w-xl mx-auto">
            List your vehicle with Yardly Automotives and reach serious, verified buyers and car yards across Kenya.
          </p>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-12 w-full flex-grow">
        {submitted ? (
          <div className="bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] p-8 sm:p-12 text-center space-y-6 shadow-sm dark:shadow-glass">
            <div className="w-20 h-20 rounded-full bg-[#EBF2FC] dark:bg-[#2D7DFF]/15 text-[#0251B8] dark:text-[#2D7DFF] border border-[#0251B8]/30 dark:border-[#2D7DFF]/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">Listing Submitted Successfully!</h2>
            <p className="text-sm text-[#355347] dark:text-[#8EA79C] max-w-md mx-auto leading-relaxed">
              Your vehicle listing for <strong>{year} {make} {model}</strong> has been submitted. Our car-yard administration team will review your logbook and specifications within 24 hours.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={() => setSubmitted(false)} variant="outline" className="font-bold">
                Submit Another Vehicle
              </Button>
              <a href="/buy">
                <Button variant="primary" className="font-bold">
                  Browse Marketplace
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] p-6 sm:p-10 shadow-sm dark:shadow-glass space-y-8">
            
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: Seller Details */}
            <div className="space-y-4">
              <div className="border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] pb-3">
                <h3 className="text-lg font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">1. Seller Information</h3>
                <p className="text-xs text-[#355347] dark:text-[#8EA79C]">Provide your contact information for buyer inquiries.</p>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <label className="text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase tracking-wider">I am a:</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSellerType('private')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      sellerType === 'private'
                        ? 'bg-[#0251B8] dark:bg-[#2D7DFF] text-white dark:text-[#050505] shadow-md'
                        : 'bg-[#F4F8F6] dark:bg-[#0A0A0A] text-[#355347] dark:text-[#8EA79C] border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] hover:border-[#0251B8] dark:hover:border-[#2D7DFF]'
                    }`}
                  >
                    Private Seller
                  </button>
                  <button
                    type="button"
                    onClick={() => setSellerType('dealer')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      sellerType === 'dealer'
                        ? 'bg-[#0251B8] dark:bg-[#2D7DFF] text-white dark:text-[#050505] shadow-md'
                        : 'bg-[#F4F8F6] dark:bg-[#0A0A0A] text-[#355347] dark:text-[#8EA79C] border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] hover:border-[#0251B8] dark:hover:border-[#2D7DFF]'
                    }`}
                  >
                    Car Yard / Dealer
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Baraka Mwangi"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  required
                />
                <Input
                  label="Phone Number (M-Pesa) *"
                  placeholder="e.g. 0712345678"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  required
                />
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="e.g. name@example.com"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* STEP 2: Vehicle Specs */}
            <div className="space-y-4">
              <div className="border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] pb-3">
                <h3 className="text-lg font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">2. Vehicle Specifications</h3>
                <p className="text-xs text-[#355347] dark:text-[#8EA79C]">Accurate specs increase buyer inquiry conversion rates.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase tracking-wider mb-1.5">
                    Make *
                  </label>
                  <select
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] bg-[#F4F8F6] dark:bg-[#0A0A0A] px-4 py-3 text-sm font-semibold text-[#0F241C] dark:text-[#F2F7F3] focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF]"
                  >
                    <option value="Toyota" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Toyota</option>
                    <option value="Mazda" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Mazda</option>
                    <option value="Subaru" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Subaru</option>
                    <option value="Nissan" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Nissan</option>
                    <option value="Mercedes-Benz" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Mercedes-Benz</option>
                    <option value="BMW" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">BMW</option>
                    <option value="Isuzu" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Isuzu</option>
                    <option value="Volkswagen" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Volkswagen</option>
                    <option value="Land Rover" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Land Rover</option>
                    <option value="Ford" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Ford</option>
                  </select>
                </div>

                <Input
                  label="Model *"
                  placeholder="e.g. Harrier, Prado, CX-5"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />

                <Input
                  label="Year of Manufacture *"
                  type="number"
                  placeholder="e.g. 2019"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Registration Number (Hidden) *"
                  placeholder="e.g. KDH 452X"
                  value={regNum}
                  onChange={(e) => setRegNum(e.target.value)}
                  helperText="Used strictly for admin logbook audit"
                  required
                />

                <Input
                  label="Mileage (KM) *"
                  type="number"
                  placeholder="e.g. 62000"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  required
                />

                <Input
                  label="Engine Capacity (CC) *"
                  type="number"
                  placeholder="e.g. 2000"
                  value={engineCc}
                  onChange={(e) => setEngineCc(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase tracking-wider mb-1.5">
                    Transmission *
                  </label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] bg-[#F4F8F6] dark:bg-[#0A0A0A] px-4 py-3 text-sm font-semibold text-[#0F241C] dark:text-[#F2F7F3] focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF]"
                  >
                    <option value="Automatic" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Automatic</option>
                    <option value="Manual" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Manual</option>
                    <option value="CVT" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">CVT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase tracking-wider mb-1.5">
                    Fuel Type *
                  </label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] bg-[#F4F8F6] dark:bg-[#0A0A0A] px-4 py-3 text-sm font-semibold text-[#0F241C] dark:text-[#F2F7F3] focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF]"
                  >
                    <option value="Petrol" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Petrol</option>
                    <option value="Diesel" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Diesel</option>
                    <option value="Hybrid" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Hybrid</option>
                    <option value="Electric" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase tracking-wider mb-1.5">
                    Body Type *
                  </label>
                  <select
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value)}
                    className="w-full rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] bg-[#F4F8F6] dark:bg-[#0A0A0A] px-4 py-3 text-sm font-semibold text-[#0F241C] dark:text-[#F2F7F3] focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF]"
                  >
                    <option value="SUV" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">SUV</option>
                    <option value="Sedan" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Sedan</option>
                    <option value="Hatchback" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Hatchback</option>
                    <option value="Station Wagon" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Station Wagon</option>
                    <option value="Pickup / Truck" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Pickup / Truck</option>
                    <option value="Van / Minibus" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Van / Minibus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase tracking-wider mb-1.5">
                    Location *
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] bg-[#F4F8F6] dark:bg-[#0A0A0A] px-4 py-3 text-sm font-semibold text-[#0F241C] dark:text-[#F2F7F3] focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF]"
                  >
                    <option value="Nairobi" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Nairobi</option>
                    <option value="Mombasa" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Mombasa</option>
                    <option value="Nakuru" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Nakuru</option>
                    <option value="Eldoret" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Eldoret</option>
                    <option value="Kisumu" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Kisumu</option>
                  </select>
                </div>

                <Input
                  label="Asking Price (KES) *"
                  type="number"
                  placeholder="e.g. 3850000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />

                <div>
                  <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase tracking-wider mb-1.5">
                    Vehicle Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] bg-[#F4F8F6] dark:bg-[#0A0A0A] px-4 py-3 text-sm font-semibold text-[#0F241C] dark:text-[#F2F7F3] focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF]"
                  >
                    <option value="Foreign Used" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Foreign Used (Import)</option>
                    <option value="Locally Used" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Locally Used (Kenyan)</option>
                    <option value="Brand New" className="bg-white dark:bg-[#0A0A0A] text-[#0F241C] dark:text-[#F2F7F3]">Brand New</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase tracking-wider mb-1.5">
                  Detailed Vehicle Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Highlight key features, sunroof, leather seats, service history..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.2)] bg-[#F4F8F6] dark:bg-[#0A0A0A] p-4 text-sm text-[#0F241C] dark:text-[#F2F7F3] focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF]"
                />
              </div>
            </div>

            {/* STEP 3: Photos & Documentation */}
            <div className="space-y-4">
              <div className="border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] pb-3">
                <h3 className="text-lg font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">3. Photos & Logbook Verification</h3>
                <p className="text-xs text-[#355347] dark:text-[#8EA79C]">Upload vehicle photographs (.jpg, .png) and logbook documents (.pdf, .doc).</p>
              </div>

              {/* Photo Upload (.jpg) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase tracking-wider">
                  Upload Vehicle Photographs (JPG / PNG / WebP) *
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0251B8] dark:bg-[#2D7DFF] text-white dark:text-[#050505] text-xs font-extrabold shadow hover:bg-[#0150B5] dark:hover:bg-[#FF3B4E] transition-all">
                    <Upload className="w-4 h-4" />
                    <span>Select Photo Files (.jpg)</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      multiple
                      onChange={handlePhotoFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-[#355347] dark:text-[#8EA79C] font-medium">
                    {images.length} photo(s) attached
                  </span>
                </div>
              </div>

              {/* Photo Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-[#EDF5F1] dark:bg-[#0A0A0A] group border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] shadow-sm">
                      <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md transition-all"
                        aria-label="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Logbook Upload (.pdf/.doc) */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase tracking-wider">
                  Upload Logbook / Registration Document (.pdf / .doc) *
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#EBF2FC] dark:bg-[#1A1A1A] text-[#0251B8] dark:text-[#2D7DFF] border border-[#0251B8]/30 dark:border-[#2D7DFF]/30 text-xs font-extrabold shadow hover:bg-[#DCE9FB] dark:hover:bg-[#121212] transition-all">
                    <FileText className="w-4 h-4 text-[#0251B8] dark:text-[#2D7DFF]" />
                    <span>Select Document (.pdf / .doc)</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleLogbookFileUpload}
                      className="hidden"
                    />
                  </label>
                  {logbookFileName && (
                    <div className="flex items-center gap-2 bg-[#F4F8F6] dark:bg-[#0A0A0A] border border-[#0251B8]/30 dark:border-[#2D7DFF]/30 text-[#0251B8] dark:text-[#2D7DFF] px-3 py-1.5 rounded-lg text-xs font-bold">
                      <FileText className="w-4 h-4" />
                      <span className="truncate max-w-[200px]">{logbookFileName}</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-[#355347] dark:text-[#8EA79C]">Restricted logbook audit document. Encrypted for verified admin inspection only.</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={loading}
                className="font-bold text-base btn-glow"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Submit Listing for Verification
              </Button>
            </div>

          </form>
        )}
      </div>

    </div>
  );
};
