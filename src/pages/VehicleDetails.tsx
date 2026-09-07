import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Gauge, 
  Fuel, 
  Cog, 
  Calendar, 
  Phone, 
  MessageSquare, 
  Calculator, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Heart,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { VehicleService, InquiryService, InspectionService, RealtimeService } from '../lib/supabase/client';
import { Vehicle, VehicleImage } from '../types/database';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CheckoutModal } from '../components/payment/CheckoutModal';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { VehicleGallery } from '../components/vehicle/VehicleGallery';
import { resolveVehicleImages } from '../lib/utils/imageResolver';
import { siteConfig } from '../config/site';
import { useSEO } from '../lib/hooks/useSEO';
import { Analytics } from '../lib/analytics';

export const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [inspectionOpen, setInspectionOpen] = useState(false);

  // Inquiry Form state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('I would like to schedule a physical viewing of this vehicle.');
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  // Financing Calculator state
  const [depositPercent, setDepositPercent] = useState(20); // 20%
  const [tenureMonths, setTenureMonths] = useState(48); // 4 years
  const interestRatePAnnum = siteConfig.financing.defaultInterestRate;

  const vehicleTitle = vehicle 
    ? `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ''} for Sale in Kenya`
    : 'Vehicle Details';
  
  const vehicleDescription = vehicle
    ? `Buy verified ${vehicle.year} ${vehicle.make} ${vehicle.model} in Kenya. Price: KES ${vehicle.price.toLocaleString()}, Mileage: ${vehicle.mileage?.toLocaleString() || 'N/A'} km, Engine: ${vehicle.engine_cc || 'N/A'}cc, Transmission: ${vehicle.transmission}. Inspected by Yardly Automotives.`
    : siteConfig.description;

  const vehicleImages = vehicle ? resolveVehicleImages(vehicle) : [];
  const primaryVehicleImage = vehicleImages[0]?.image_url || '/logo.jpeg';

  useSEO({
    title: vehicleTitle,
    description: vehicleDescription,
    canonical: vehicle ? `${siteConfig.url}/vehicles/${vehicle.id}` : undefined,
    ogTitle: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} — KES ${vehicle.price.toLocaleString()}` : undefined,
    ogDescription: vehicleDescription,
    ogImage: primaryVehicleImage,
    ogType: 'product',
    schema: vehicle ? {
      '@context': 'https://schema.org',
      '@type': 'Car',
      name: `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ''}`.trim(),
      image: primaryVehicleImage.startsWith('http') ? primaryVehicleImage : `${siteConfig.url}${primaryVehicleImage}`,
      description: vehicle.description || vehicleDescription,
      brand: {
        '@type': 'Brand',
        name: vehicle.make
      },
      model: vehicle.model,
      vehicleModelDate: vehicle.year.toString(),
      itemCondition: vehicle.registration_status === 'new' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
      mileageFromOdometer: {
        '@type': 'QuantitativeValue',
        value: vehicle.mileage,
        unitCode: 'KMT'
      },
      fuelType: vehicle.fuel_type,
      vehicleTransmission: vehicle.transmission,
      driveWheelConfiguration: vehicle.drive_type,
      color: vehicle.color,
      offers: {
        '@type': 'Offer',
        price: vehicle.price,
        priceCurrency: 'KES',
        priceValidUntil: '2026-12-31',
        itemCondition: 'https://schema.org/UsedCondition',
        availability: vehicle.status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'AutoDealer',
          name: vehicle.dealer_name || siteConfig.name,
          telephone: siteConfig.contact.phone
        }
      }
    } : undefined
  });

  useEffect(() => {
    async function loadVehicle() {
      if (!id) return;
      try {
        const item = await VehicleService.getById(id);
        setVehicle(item);
        if (item) {
          Analytics.trackVehicleView(item.id, `${item.year} ${item.make} ${item.model}`, item.price);
        }
      } catch (err) {
        console.error('Failed to load vehicle details', err);
      } finally {
        setLoading(false);
      }
    }
    loadVehicle();

    const unsub = RealtimeService.subscribeToTable('vehicles', () => {
      loadVehicle();
    });

    return () => {
      unsub();
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#001A13] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto p-8 w-full animate-pulse space-y-6">
          <div className="h-8 bg-white/70 dark:bg-[#00251B]/60 rounded-xl w-1/4" />
          <div className="h-96 bg-white/70 dark:bg-[#00251B]/60 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#001A13] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto p-12 text-center space-y-4">
          <h2 className="text-2xl font-bold text-[#0F241C] dark:text-[#F2F7F3]">Vehicle Not Found</h2>
          <p className="text-xs text-[#355347] dark:text-[#8EA79C]">The vehicle you requested could not be located or has been sold.</p>
          <Link to="/buy">
            <Button variant="primary">Return to Buy Cars</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Pre-filled WhatsApp message URL generator
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} listed at KES ${vehicle.price.toLocaleString()} on Yardly Automotives.`
  );
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappMessage}`;

  // Financing Calculator Calculation
  const depositAmount = (vehicle.price * depositPercent) / 100;
  const loanPrincipal = vehicle.price - depositAmount;
  const monthlyInterestRate = interestRatePAnnum / 100 / 12;
  const estimatedMonthlyPayment = Math.round(
    (loanPrincipal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) /
    (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1)
  );

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim() || !inquiryEmail.trim()) {
      setInquiryError('Please fill in all required fields (Full Name, Phone Number, and Email).');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inquiryEmail.trim())) {
      setInquiryError('Please provide a valid email address.');
      return;
    }

    setInquiryLoading(true);
    setInquiryError('');
    try {
      await InquiryService.create({
        vehicle_id: vehicle.id,
        name: inquiryName.trim(),
        phone: inquiryPhone.trim(),
        email: inquiryEmail.trim(),
        message: inquiryMsg.trim(),
        source: 'inspection_request'
      });
      await InspectionService.create({
        vehicle_id: vehicle.id,
        seller_id: vehicle.seller_id,
        buyer_name: inquiryName.trim(),
        buyer_phone: inquiryPhone.trim(),
        buyer_email: inquiryEmail.trim(),
        preferred_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        preferred_time: '10:00 AM',
        location: vehicle.location || 'Nairobi',
        notes: inquiryMsg.trim()
      });

      Analytics.trackEvent('inquiry_submit', {
        item_id: vehicle.id,
        item_name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`
      });

      setInquirySuccess(true);
    } catch (err: unknown) {
      console.error('Inspection submission error:', err);
      const msg = err instanceof Error ? err.message : 'Unable to submit inspection request right now. Please try again or chat via WhatsApp.';
      setInquiryError(msg);
    } finally {
      setInquiryLoading(false);
    }
  };

  const imagesList: VehicleImage[] = resolveVehicleImages(vehicle);

  return (
    <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#001A13] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col pb-24 lg:pb-12 selection:bg-[#00E878] selection:text-[#001A13]">
      <Navbar />

      {/* Breadcrumb Header */}
      <div className="bg-[#EDF5F1] dark:bg-[#001711] border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/buy" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#009E52] dark:text-[#00E878] hover:text-[#00B85E] dark:hover:text-[#55FF78] hover:underline transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => navigator.clipboard?.writeText(window.location.href)} className="p-2 rounded-xl text-[#355347] dark:text-[#8EA79C] hover:bg-[#E4EFEA] dark:hover:bg-[#00251B] hover:text-[#0F241C] dark:hover:text-[#F2F7F3] transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Gallery & Details */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Unified Responsive Gallery Component */}
            <VehicleGallery
              images={imagesList}
              altTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            />

            {/* Title & Key Spec Chips */}
            <div className="bg-white dark:bg-[#00251B]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.15)] shadow-sm dark:shadow-glass space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-[#009E52] dark:text-[#00E878] mb-1">
                    {vehicle.dealer_name || 'Verified Car Yard'} • {vehicle.location}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h1>
                  <p className="text-xs text-[#355347] dark:text-[#8EA79C] mt-1">{vehicle.variant || `${vehicle.engine_cc}cc Turbo`}</p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] font-bold uppercase text-[#355347] dark:text-[#8EA79C]">Cash Price</div>
                  <div className="text-2xl sm:text-3xl font-black text-[#009E52] dark:text-[#00E878]">
                    KES {vehicle.price.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Specs Pills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F4F8F6] dark:bg-[#001F17] p-4 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)]">
                <div className="flex items-center gap-2.5">
                  <Gauge className="w-5 h-5 text-[#009E52] dark:text-[#00E878]" />
                  <div>
                    <div className="text-[10px] text-[#355347] dark:text-[#8EA79C] font-bold uppercase">Mileage</div>
                    <div className="text-xs font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">{vehicle.mileage.toLocaleString()} KM</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Cog className="w-5 h-5 text-[#009E52] dark:text-[#00E878]" />
                  <div>
                    <div className="text-[10px] text-[#355347] dark:text-[#8EA79C] font-bold uppercase">Transmission</div>
                    <div className="text-xs font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">{vehicle.transmission}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Fuel className="w-5 h-5 text-[#009E52] dark:text-[#00E878]" />
                  <div>
                    <div className="text-[10px] text-[#355347] dark:text-[#8EA79C] font-bold uppercase">Fuel</div>
                    <div className="text-xs font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">{vehicle.fuel_type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-[#009E52] dark:text-[#00E878]" />
                  <div>
                    <div className="text-[10px] text-[#355347] dark:text-[#8EA79C] font-bold uppercase">Year</div>
                    <div className="text-xs font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">{vehicle.year}</div>
                  </div>
                </div>
              </div>

              {/* Estimated Market Reference Card */}
              {vehicle.estimated_market_value && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#EDF5F1] to-[#E4EFEA] dark:from-[#001F17] dark:to-[#002B1F] border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.15)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black text-[#009E52] dark:text-[#00E878] uppercase tracking-wider">
                      <TrendingUp className="w-4 h-4 text-[#009E52] dark:text-[#00E878]" />
                      <span>Estimated Market Reference</span>
                    </div>
                    <Badge variant="verified" size="sm">
                      {vehicle.valuation_confidence || 'High'} Confidence
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="text-[10px] font-bold text-[#355347] dark:text-[#8EA79C] uppercase">Market Range</div>
                      <div className="text-sm font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">
                        KES {(vehicle.market_value_low || vehicle.price * 0.95).toLocaleString()} – KES {(vehicle.market_value_high || vehicle.price * 1.05).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#355347] dark:text-[#8EA79C] uppercase">Estimated Market Value</div>
                      <div className="text-sm font-black text-[#009E52] dark:text-[#00E878]">
                        KES {vehicle.estimated_market_value.toLocaleString()}
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <div className="text-[10px] font-bold text-[#355347] dark:text-[#8EA79C] uppercase">Valuation Source</div>
                      <div className="text-xs font-semibold text-[#355347] dark:text-[#8EA79C]">
                        {vehicle.valuation_source || 'Kenyan Auto Index 2026'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-sm font-extrabold text-[#0F241C] dark:text-[#F2F7F3] uppercase tracking-wider mb-2">Vehicle Overview</h3>
                <p className="text-sm text-[#355347] dark:text-[#8EA79C] leading-relaxed">{vehicle.description}</p>
              </div>

              {/* Features List */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-extrabold text-[#0F241C] dark:text-[#F2F7F3] uppercase tracking-wider mb-3">Key Features</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {vehicle.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#0F241C] dark:text-[#F2F7F3]">
                        <CheckCircle2 className="w-4 h-4 text-[#009E52] dark:text-[#00E878] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle Financing Estimator */}
            <div className="bg-white dark:bg-[#00251B]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.15)] shadow-sm dark:shadow-glass space-y-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#009E52] dark:text-[#00E878]" />
                <h3 className="text-lg font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">Vehicle Financing Estimator</h3>
              </div>
              <p className="text-xs text-[#355347] dark:text-[#8EA79C]">Calculate estimated monthly repayments based on standard Kenyan auto loan terms (14% p.a.).</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase mb-1">Deposit (%): {depositPercent}%</label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={depositPercent}
                    onChange={(e) => setDepositPercent(Number(e.target.value))}
                    className="w-full accent-[#009E52] dark:accent-[#00E878]"
                  />
                  <span className="text-xs text-[#355347] dark:text-[#8EA79C]">KES {depositAmount.toLocaleString()}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase mb-1">Loan Tenure: {tenureMonths} Months</label>
                  <select
                    value={tenureMonths}
                    onChange={(e) => setTenureMonths(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(180,255,210,0.2)] text-xs font-bold bg-[#F4F8F6] dark:bg-[#001F17] text-[#0F241C] dark:text-[#F2F7F3] focus:outline-none focus:ring-2 focus:ring-[#009E52] dark:focus:ring-[#00E878]"
                  >
                    <option value={12} className="bg-white dark:bg-[#001F17] text-[#0F241C] dark:text-[#F2F7F3]">12 Months (1 Year)</option>
                    <option value={24} className="bg-white dark:bg-[#001F17] text-[#0F241C] dark:text-[#F2F7F3]">24 Months (2 Years)</option>
                    <option value={36} className="bg-white dark:bg-[#001F17] text-[#0F241C] dark:text-[#F2F7F3]">36 Months (3 Years)</option>
                    <option value={48} className="bg-white dark:bg-[#001F17] text-[#0F241C] dark:text-[#F2F7F3]">48 Months (4 Years)</option>
                    <option value={60} className="bg-white dark:bg-[#001F17] text-[#0F241C] dark:text-[#F2F7F3]">60 Months (5 Years)</option>
                  </select>
                </div>

                <div className="p-4 bg-[#F4F8F6] dark:bg-[#001F17] rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] text-center">
                  <div className="text-[10px] font-bold uppercase text-[#355347] dark:text-[#8EA79C]">Est. Monthly Repayment</div>
                  <div className="text-xl font-black text-[#009E52] dark:text-[#00E878] mt-0.5">
                    KES {estimatedMonthlyPayment.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#5F7E71] dark:text-[#8EA79C] mt-1">*Subject to bank appraisal</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Action Box & Reservation */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white dark:bg-[#00251B]/95 backdrop-blur-md rounded-3xl p-6 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.18)] shadow-sm dark:shadow-glow sticky top-24 space-y-6">
              <div className="space-y-2">
                <Badge variant="verified">
                  <ShieldCheck className="w-4 h-4 mr-1" />
                  Yardly Verified Vehicle
                </Badge>
                <div className="text-2xl font-black text-[#009E52] dark:text-[#00E878]">
                  KES {vehicle.price.toLocaleString()}
                </div>
                <p className="text-xs text-[#355347] dark:text-[#8EA79C]">
                  Reserve for KES {siteConfig.reservation.defaultDepositKES.toLocaleString()} to lock this vehicle for {siteConfig.reservation.holdingPeriodDays} days.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  fullWidth
                  variant="primary"
                  onClick={() => setCheckoutOpen(true)}
                  className="font-extrabold py-3 text-sm shadow-md"
                  icon={<Lock className="w-4 h-4" />}
                >
                  Reserve Car Now
                </Button>

                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => setInspectionOpen(true)}
                  className="font-extrabold py-2.5 text-xs"
                  icon={<MessageSquare className="w-4 h-4" />}
                >
                  Schedule Yard Inspection
                </Button>

                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block"
                  onClick={() => Analytics.trackWhatsAppClick('vehicle_details_page', `${vehicle.year} ${vehicle.make} ${vehicle.model}`)}
                  aria-label="Chat about this vehicle on WhatsApp"
                >
                  <button className="w-full py-2.5 px-4 rounded-xl bg-[#009E52] dark:bg-[#00E878] hover:bg-[#00B85E] dark:hover:bg-[#55FF78] text-white dark:text-[#001A13] text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    <span>Chat on WhatsApp</span>
                  </button>
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-[#F4F8F6] dark:bg-[#001F17] border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] text-xs text-[#355347] dark:text-[#8EA79C] space-y-2">
                <div className="font-bold text-[#0F241C] dark:text-[#F2F7F3]">Why Reserve via Yardly Automotives?</div>
                <div className="flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#009E52] dark:text-[#00E878] shrink-0" />
                  <span>Logbook & Ownership document verification</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#009E52] dark:text-[#00E878] shrink-0" />
                  <span>3-Day holding guarantee against other buyers</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#009E52] dark:text-[#00E878] shrink-0" />
                  <span>100% Refundable deposit if inspection fails</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Reservation Checkout Modal */}
      {checkoutOpen && (
        <CheckoutModal
          vehicle={vehicle}
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
        />
      )}

      {/* Schedule Inspection Modal */}
      {inspectionOpen && (
        <Modal title="Schedule Yard Inspection" isOpen={inspectionOpen} onClose={() => setInspectionOpen(false)}>
          {inquirySuccess ? (
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-[#E0F8EC] dark:bg-[#00E878]/15 text-[#009E52] dark:text-[#00E878] rounded-full flex items-center justify-center mx-auto border border-[#009E52]/30 dark:border-[#00E878]/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F241C] dark:text-[#F2F7F3]">Inspection Request Received!</h3>
              <p className="text-xs text-[#355347] dark:text-[#8EA79C]">Our sales representative will contact you shortly to confirm your inspection booking.</p>
              <Button onClick={() => setInspectionOpen(false)}>Close</Button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              {inquiryError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 font-medium">
                  {inquiryError}
                </div>
              )}
              <Input
                label="Full Name *"
                placeholder="e.g. Kelvin Mutua"
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
                required
              />
              <Input
                label="Phone Number *"
                placeholder="0712 345 678"
                value={inquiryPhone}
                onChange={(e) => setInquiryPhone(e.target.value)}
                required
              />
              <Input
                label="Email Address *"
                type="email"
                placeholder="kmutua@gmail.com"
                value={inquiryEmail}
                onChange={(e) => setInquiryEmail(e.target.value)}
                required
              />
              <div>
                <label className="block text-xs font-bold text-[#355347] dark:text-[#8EA79C] mb-1">Message</label>
                <textarea
                  rows={3}
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[rgba(0,60,40,0.15)] dark:border-[rgba(180,255,210,0.2)] bg-[#F4F8F6] dark:bg-[#001F17] text-[#0F241C] dark:text-[#F2F7F3] text-xs focus:outline-none focus:ring-2 focus:ring-[#009E52] dark:focus:ring-[#00E878]"
                />
              </div>
              <Button type="submit" fullWidth loading={inquiryLoading} className="font-extrabold">
                Submit Inspection Booking
              </Button>
            </form>
          )}
        </Modal>
      )}

    </div>
  );
};
