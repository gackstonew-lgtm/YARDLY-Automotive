import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, User, Phone, Building, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AuthService } from '../lib/supabase/client';
import { SellerType, UserRole } from '../types/database';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse redirect & role parameters from search query or location state
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const redirectParam = searchParams.get('redirect') || (location.state as any)?.from?.pathname || '';
  const requestedRoleParam = searchParams.get('role');

  const [isRegister, setIsRegister] = useState(location.pathname === '/register' || requestedRoleParam === 'seller');
  const [registerRole, setRegisterRole] = useState<'buyer' | 'seller'>(
    requestedRoleParam === 'seller' || redirectParam.includes('/sell') ? 'seller' : 'buyer'
  );

  useEffect(() => {
    if (location.pathname === '/register') {
      setIsRegister(true);
    } else if (location.pathname === '/login') {
      setIsRegister(false);
    }
  }, [location.pathname]);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [sellerType, setSellerType] = useState<SellerType>('dealer');
  const [businessName, setBusinessName] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Human-readable feature name for redirect notice
  const destinationFeatureName = useMemo(() => {
    if (redirectParam.includes('/buy')) return 'Vehicle Buying & Inventory';
    if (redirectParam.includes('/sell')) return 'Vehicle Listing & Selling';
    if (redirectParam.includes('/trade-in')) return 'Vehicle Trade-In';
    if (redirectParam.includes('/auction')) return 'Vehicle Auctions';
    if (redirectParam.includes('/import')) return 'Direct Importation';
    if (redirectParam.includes('/account')) return 'User Portal Dashboard';
    if (redirectParam.includes('/admin')) return 'Executive Management Console';
    return null;
  }, [redirectParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      let loggedInRole: UserRole = 'buyer';

      if (isRegister) {
        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match. Please re-enter your password.');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }

        const res = await AuthService.signUp(
          email.trim(),
          password,
          fullName.trim(),
          registerRole === 'seller' ? 'seller' : 'buyer',
          phone.trim(),
          registerRole === 'seller' ? sellerType : undefined,
          registerRole === 'seller' ? businessName.trim() : undefined
        );

        if (!res.success || !res.user) {
          setErrorMsg(res.error || 'Failed to register account. Please try again.');
          setLoading(false);
          return;
        }

        loggedInRole = res.user.role;
        setSuccessMsg(`Account created successfully as ${registerRole.toUpperCase()}! Preparing your experience...`);
      } else {
        const res = await AuthService.signIn(email.trim(), password);
        if (!res.success || !res.user) {
          setErrorMsg(res.error || 'Invalid email or password. Please verify your credentials.');
          setLoading(false);
          return;
        }

        loggedInRole = res.user.role;
        setSuccessMsg('Signed in successfully! Restoring your session...');
      }

      // Determine final redirect destination with Priority Logic
      setTimeout(() => {
        setLoading(false);

        // 1. If an intended destination was preserved and authorized
        if (redirectParam && redirectParam !== '/login' && redirectParam !== '/register' && redirectParam !== '/auth') {
          // If a non-admin attempts to access /admin, safely redirect to /account
          if (redirectParam.startsWith('/admin') && loggedInRole !== 'admin') {
            navigate('/account', { replace: true });
          } else {
            navigate(redirectParam, { replace: true });
          }
          return;
        }

        // 2. Default role-based destinations
        if (loggedInRole === 'admin') {
          navigate('/admin', { replace: true });
        } else if (loggedInRole === 'seller') {
          navigate('/sell', { replace: true });
        } else {
          navigate('/buy', { replace: true });
        }
      }, 600);
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred during authentication.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#001A13] text-[#F2F7F3] flex flex-col font-sans selection:bg-[#00E878] selection:text-[#001A13]">
      <Navbar />

      <div className="max-w-lg mx-auto my-auto px-4 pt-10 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-12 w-full">
        
        {/* Intended Destination Notice Banner */}
        {destinationFeatureName && (
          <div className="mb-4 p-3.5 rounded-2xl bg-[#002B1F] border border-[rgba(180,255,210,0.2)] text-xs text-[#F2F7F3] flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00E878] shrink-0" />
              <span>Authentication required for <strong>{destinationFeatureName}</strong></span>
            </div>
            <span className="text-[10px] font-extrabold uppercase text-[#00E878] bg-[#001711] px-2 py-0.5 rounded-md">
              Protected
            </span>
          </div>
        )}

        <div className="bg-[#00251B]/95 backdrop-blur-md rounded-3xl border border-[rgba(180,255,210,0.18)] p-6 sm:p-8 shadow-glow space-y-6">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#001711] border border-[rgba(180,255,210,0.2)] p-1 shadow-md mx-auto flex items-center justify-center">
              <img
                src="/logo.jpeg"
                alt="Yardly Automotives Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <h2 className="text-2xl font-extrabold text-[#F2F7F3]">
              {isRegister ? `Register as a ${registerRole === 'seller' ? 'Seller / Dealer' : 'Buyer'}` : 'Yardly Partner & Buyer Sign In'}
            </h2>
            <p className="text-xs text-[#8EA79C]">
              {isRegister 
                ? 'Create your Yardly Automotives account to buy, bid, list cars or request imports' 
                : 'Access your vehicle inventory, saved cars, trade-ins & bidding portal'}
            </p>
          </div>

          {/* Registration Role Selector: Buyer vs Seller */}
          {isRegister && (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#8EA79C] px-1">
                Select Your Account Role
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#001F17] p-1.5 rounded-2xl border border-[rgba(180,255,210,0.15)]">
                <button
                  type="button"
                  onClick={() => setRegisterRole('buyer')}
                  className={`py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    registerRole === 'buyer'
                      ? 'bg-[#00E878] text-[#001A13] shadow-md'
                      : 'text-[#8EA79C] hover:text-[#F2F7F3]'
                  }`}
                >
                  Register as Buyer
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterRole('seller')}
                  className={`py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    registerRole === 'seller'
                      ? 'bg-[#00E878] text-[#001A13] shadow-md'
                      : 'text-[#8EA79C] hover:text-[#F2F7F3]'
                  }`}
                >
                  Register as Seller
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs font-semibold text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-[#00E878]/15 border border-[#00E878]/30 text-xs font-semibold text-[#00E878] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00E878]" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegister && (
              <>
                <Input
                  label={registerRole === 'seller' ? 'Full Name / Representative Name *' : 'Full Name *'}
                  placeholder="e.g. Maina Kamau"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  icon={<User className="w-4 h-4 text-[#8EA79C]" />}
                  required
                />

                <Input
                  label="Phone Number *"
                  placeholder="+254 712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={<Phone className="w-4 h-4 text-[#8EA79C]" />}
                  required
                />

                {registerRole === 'seller' && (
                  <>
                    <Input
                      label="Business / Dealership Name"
                      placeholder="e.g. Mwangi Car Yard Ltd"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      icon={<Building className="w-4 h-4 text-[#8EA79C]" />}
                    />

                    <div>
                      <label className="block text-xs font-bold text-[#8EA79C] mb-1.5">Seller Category *</label>
                      <select
                        value={sellerType}
                        onChange={(e) => setSellerType(e.target.value as SellerType)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[rgba(180,255,210,0.2)] text-xs font-bold text-[#F2F7F3] bg-[#001F17] focus:outline-none focus:ring-2 focus:ring-[#00E878]"
                      >
                        <option value="private" className="bg-[#001F17] text-[#F2F7F3]">Individual Private Seller</option>
                        <option value="dealer" className="bg-[#001F17] text-[#F2F7F3]">Car Yard / Commercial Dealer</option>
                        <option value="importer" className="bg-[#001F17] text-[#F2F7F3]">Direct Importer</option>
                        <option value="business" className="bg-[#001F17] text-[#F2F7F3]">Corporate / Business Fleet</option>
                      </select>
                    </div>
                  </>
                )}
              </>
            )}

            <Input
              label="Email Address *"
              type="email"
              placeholder="user@yardly.co.ke"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-[#8EA79C]" />}
              required
            />

            <Input
              label="Password *"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-[#8EA79C]" />}
              required
            />

            {isRegister && (
              <Input
                label="Confirm Password *"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-4 h-4 text-[#8EA79C]" />}
                required
              />
            )}

            <Button type="submit" fullWidth loading={loading} className="font-extrabold py-3 btn-glow">
              {isRegister ? `Create ${registerRole === 'seller' ? 'Seller' : 'Buyer'} Account` : 'Sign In'}
            </Button>
          </form>

          <div className="text-center text-xs text-[#8EA79C] pt-3 border-t border-[rgba(180,255,210,0.12)] space-y-2">
            <div>
              {isRegister ? 'Already registered?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="font-bold text-[#00E878] hover:underline cursor-pointer"
              >
                {isRegister ? 'Sign In Here' : 'Create Account Now'}
              </button>
            </div>

            <div className="pt-2 border-t border-[rgba(180,255,210,0.1)] flex items-center justify-center">
              <Link to="/admin/login" className="inline-flex items-center gap-1.5 font-bold text-[#00E878] hover:underline hover:text-[#55FF78]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Administrator Portal Login</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;
