import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { RefreshCw, CheckCircle2, ShieldCheck, Car, DollarSign, Upload, AlertCircle, ArrowRight, FileText, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TradeInService, AuthService, AuthUser } from '../lib/supabase/client';
import { FuelType, TransmissionType } from '../types/database';

export const TradeIn: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('0712052104');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(2019);
  const [mileage, setMileage] = useState<number>(60000);
  const [registrationStatus, setRegistrationStatus] = useState('locally_registered');
  const [transmission, setTransmission] = useState<TransmissionType>('Automatic');
  const [fuelType, setFuelType] = useState<FuelType>('Petrol');
  const [condition, setCondition] = useState('Foreign Used');
  const [location, setLocation] = useState('Nairobi');
  const [expectedValue, setExpectedValue] = useState<number>(2500000);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [logbookFileName, setLogbookFileName] = useState('');
  const [logbookUrl, setLogbookUrl] = useState('');

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
    setErrorMsg('');
    setLoading(true);

    try {
      if (!make || !model || !year || !expectedValue || !phone) {
        setErrorMsg('Please fill in all mandatory fields before submitting.');
        setLoading(false);
        return;
      }

      const res = await TradeInService.create({
        user_id: user?.id,
        full_name: fullName,
        email,
        phone,
        make,
        model,
        year,
        mileage,
        registration_status: registrationStatus,
        transmission,
        fuel_type: fuelType,
        condition,
        location,
        expected_value: expectedValue,
        description: description || `Trade-in evaluation request for ${year} ${make} ${model}.`,
        images
      });

      setSubmittedRef(res.reference_id);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to submit trade-in request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#001A13] text-[#F2F7F3] flex flex-col font-sans selection:bg-[#00E878] selection:text-[#001A13]">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#00140F] via-[#00251B] to-[#001F17] border-b border-[rgba(180,255,210,0.12)] text-[#F2F7F3] py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00E878]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00E878]/10 border border-[#00E878]/30 text-xs font-extrabold uppercase tracking-wider text-[#00E878]">
            <RefreshCw className="w-4 h-4 text-[#00E878]" />
            <span>INSTANT VEHICLE TRADE-IN & VALUATION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F2F7F3]">
            Trade In Your Vehicle with Yardly Automotives
          </h1>
          <p className="text-sm sm:text-base text-[#8EA79C] max-w-2xl mx-auto">
            Upgrade your ride effortlessly. Submit your vehicle details to get a fair market valuation from verified Kenyan car yards and apply the value directly towards your next car.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-12 w-full flex-grow">
        {submittedRef ? (
          <div className="bg-[#00251B]/90 backdrop-blur-md rounded-3xl border border-[rgba(180,255,210,0.15)] p-8 sm:p-12 shadow-glass text-center space-y-6">
            <div className="w-20 h-20 bg-[#00E878]/15 text-[#00E878] border border-[#00E878]/30 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#F2F7F3]">Trade-In Request Submitted!</h2>
              <p className="text-sm text-[#8EA79C] max-w-md mx-auto">
                Thank you, <strong>{fullName}</strong>. Your trade-in valuation request has been logged into our system.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#001F17] border border-[rgba(180,255,210,0.15)] inline-block w-full max-w-md text-left space-y-2">
              <div className="text-xs font-bold text-[#8EA79C] uppercase">Reference Tracking ID</div>
              <div className="text-2xl font-black font-mono text-[#00E878]">{submittedRef}</div>
              <div className="text-xs text-[#8EA79C] pt-2 border-t border-[rgba(180,255,210,0.12)]">
                Vehicle: <strong className="text-[#F2F7F3]">{year} {make} {model}</strong>
              </div>
            </div>

            <p className="text-xs text-[#8EA79C] max-w-lg mx-auto">
              Our appraisal team will inspect your details and contact you via phone ({phone}) or email ({email}) within 24 hours with an official trade-in quote.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button onClick={() => setSubmittedRef(null)} variant="outline">
                Submit Another Trade-In
              </Button>
              <a href="/buy">
                <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                  Browse Cars to Upgrade To
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-[#00251B]/90 backdrop-blur-md rounded-3xl border border-[rgba(180,255,210,0.15)] p-6 sm:p-10 shadow-glass space-y-8">
            <div className="border-b border-[rgba(180,255,210,0.12)] pb-6">
              <h2 className="text-2xl font-black text-[#F2F7F3]">Vehicle Valuation & Trade-In Form</h2>
              <p className="text-xs sm:text-sm text-[#8EA79C] mt-1">
                Provide accurate details of your current vehicle to receive a fast, reliable trade-in offer.
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-xs font-semibold text-red-300 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#00E878] mb-4">
                  1. Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Full Name *"
                    placeholder="e.g. Daniel Kiprop"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="dkiprop@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    label="Phone Number *"
                    placeholder="+254 722 000 111"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Vehicle Specifications */}
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#00E878] mb-4">
                  2. Vehicle Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Make *"
                    placeholder="e.g. Toyota"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    required
                  />
                  <Input
                    label="Model *"
                    placeholder="e.g. Harrier / Prado"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                  />
                  <Input
                    label="Year of Manufacture *"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value) || 2020)}
                    required
                  />
                  <Input
                    label="Mileage (KM) *"
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(parseInt(e.target.value) || 0)}
                    required
                  />
                  <div>
                    <label className="block text-xs font-bold text-[#8EA79C] mb-1.5">Transmission *</label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[rgba(180,255,210,0.2)] text-xs font-bold text-[#F2F7F3] bg-[#001F17] focus:outline-none focus:ring-2 focus:ring-[#00E878]"
                    >
                      <option value="Automatic" className="bg-[#001F17] text-[#F2F7F3]">Automatic</option>
                      <option value="Manual" className="bg-[#001F17] text-[#F2F7F3]">Manual</option>
                      <option value="CVT" className="bg-[#001F17] text-[#F2F7F3]">CVT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#8EA79C] mb-1.5">Fuel Type *</label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value as FuelType)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[rgba(180,255,210,0.2)] text-xs font-bold text-[#F2F7F3] bg-[#001F17] focus:outline-none focus:ring-2 focus:ring-[#00E878]"
                    >
                      <option value="Petrol" className="bg-[#001F17] text-[#F2F7F3]">Petrol</option>
                      <option value="Diesel" className="bg-[#001F17] text-[#F2F7F3]">Diesel</option>
                      <option value="Hybrid" className="bg-[#001F17] text-[#F2F7F3]">Hybrid</option>
                      <option value="Electric" className="bg-[#001F17] text-[#F2F7F3]">Electric</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Condition & Pricing */}
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#00E878] mb-4">
                  3. Vehicle Condition & Expected Valuation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#8EA79C] mb-1.5">Vehicle Condition *</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[rgba(180,255,210,0.2)] text-xs font-bold text-[#F2F7F3] bg-[#001F17] focus:outline-none focus:ring-2 focus:ring-[#00E878]"
                    >
                      <option value="Foreign Used" className="bg-[#001F17] text-[#F2F7F3]">Foreign Used (Imported)</option>
                      <option value="Locally Used" className="bg-[#001F17] text-[#F2F7F3]">Locally Used</option>
                      <option value="Brand New" className="bg-[#001F17] text-[#F2F7F3]">Brand New</option>
                    </select>
                  </div>
                  <Input
                    label="Current Location *"
                    placeholder="e.g. Nairobi / Mombasa"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                  <Input
                    label="Expected Trade-In Value (KES) *"
                    type="number"
                    value={expectedValue}
                    onChange={(e) => setExpectedValue(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              {/* Description & Images */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#8EA79C] mb-1.5">Description / Additional Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Describe extras, service history, current status, or preferred car you want to trade into..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 rounded-xl border border-[rgba(180,255,210,0.2)] text-xs text-[#F2F7F3] bg-[#001F17] focus:outline-none focus:ring-2 focus:ring-[#00E878]"
                  />
                </div>

                {/* Photo JPG Upload Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#8EA79C] uppercase tracking-wider">
                    Upload Vehicle Photos (.jpg / .png) *
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00E878] text-[#001A13] text-xs font-extrabold shadow hover:bg-[#55FF78] transition-all">
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
                    <span className="text-xs text-[#8EA79C] font-medium">
                      {images.length} photo(s) attached
                    </span>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {images.map((url, idx) => (
                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-[#001711] group border border-[rgba(180,255,210,0.15)] shadow-sm">
                          <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white hover:bg-red-700 shadow"
                            aria-label="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Logbook PDF/DOC Upload Input */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-[#8EA79C] uppercase tracking-wider">
                    Upload Logbook / Registration Document (.pdf / .doc)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#003D2D] text-[#00E878] border border-[#00E878]/30 text-xs font-extrabold shadow hover:bg-[#002B1F] transition-all">
                      <FileText className="w-4 h-4 text-[#00E878]" />
                      <span>Select Document (.pdf / .doc)</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleLogbookFileUpload}
                        className="hidden"
                      />
                    </label>
                    {logbookFileName && (
                      <div className="flex items-center gap-2 bg-[#001F17] border border-[#00E878]/30 text-[#00E878] px-3 py-1.5 rounded-lg text-xs font-bold">
                        <FileText className="w-4 h-4" />
                        <span className="truncate max-w-[200px]">{logbookFileName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(180,255,210,0.12)]">
                <Button type="submit" fullWidth loading={loading} className="py-3.5 text-sm font-extrabold btn-glow">
                  Submit Trade-In Request
                </Button>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
};
