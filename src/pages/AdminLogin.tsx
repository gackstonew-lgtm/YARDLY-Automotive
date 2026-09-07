import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle, CheckCircle2, ArrowLeft, LogOut } from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AuthService, AuthUser } from '../lib/supabase/client';
import { useSEO } from '../lib/hooks/useSEO';

export const AdminLogin: React.FC = () => {
  useSEO({
    title: 'Admin Console Login | Yardly Automotives',
    description: 'Secure management portal authentication for Yardly Automotives yard administrators.',
    schema: undefined
  });

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    AuthService.getCurrentUser().then(user => {
      setCurrentUser(user);
      if (user && (user.role === 'admin' || user.role === 'yard_admin')) {
        navigate('/admin', { replace: true });
      }
    }).catch(() => setCurrentUser(null));
  }, [navigate]);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await AuthService.adminSignIn(email.trim(), password);
      if (!res.success || !res.user) {
        setErrorMsg(res.error || 'Invalid administrator credentials. Access denied.');
        setLoading(false);
        return;
      }

      setSuccessMsg('Administrator authentication successful! Launching Admin Console...');
      setTimeout(() => {
        setLoading(false);
        navigate('/admin', { replace: true });
      }, 600);
    } catch (err) {
      console.error('Admin login exception:', err);
      setErrorMsg('A secure server authorization failure occurred. Access denied.');
      setLoading(false);
    }
  };

  const handleSignOutNonAdmin = async () => {
    await AuthService.signOut();
    setCurrentUser(null);
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#001A13] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col font-sans selection:bg-[#009E52] selection:text-white dark:selection:bg-[#00E878] dark:selection:text-[#001A13]">
      <Navbar />

      <div className="max-w-md mx-auto my-auto px-4 pt-10 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-12 w-full">
        
        {/* Admin Login Card Container */}
        <div className="bg-white dark:bg-[#00251B]/95 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.18)] p-6 sm:p-8 shadow-xl dark:shadow-glow space-y-6 relative overflow-hidden">
          
          {/* Top Decorative Emerald Brand Stripe */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#009E52] dark:bg-[#00E878]" />

          {/* Logo & Header */}
          <div className="text-center space-y-3 pt-2">
            <div className="w-16 h-16 rounded-2xl bg-[#F4F8F6] dark:bg-[#001711] border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.2)] p-2 shadow-xs mx-auto flex items-center justify-center">
              <ShieldCheck className="w-9 h-9 text-[#009E52] dark:text-[#00E878]" />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#009E52]/10 dark:bg-[#00E878]/10 border border-[#009E52]/30 dark:border-[#00E878]/30 text-[10px] font-black uppercase tracking-wider text-[#009E52] dark:text-[#00E878]">
              <ShieldCheck className="w-3 h-3" />
              <span>Restricted Access Portal</span>
            </div>

            <h1 className="text-2xl font-black text-[#0F241C] dark:text-[#F2F7F3] tracking-tight">
              Yard Admin Portal
            </h1>
            <p className="text-xs text-[#355347] dark:text-[#8EA79C] font-medium leading-relaxed max-w-xs mx-auto">
              Secure administrator authentication & privilege control for Yardly Automotives operations.
            </p>
          </div>

          {/* Authenticated as non-admin warning banner */}
          {currentUser && currentUser.role !== 'admin' && currentUser.role !== 'yard_admin' && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 space-y-2 text-left">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>LoggedIn Account Not Authorized ({currentUser.email})</span>
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-200/90 leading-snug">
                Your account is currently registered as <strong>{currentUser.role.toUpperCase()}</strong>. Administrator privileges are required to access this portal.
              </p>
              <div className="pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={handleSignOutNonAdmin}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-extrabold hover:bg-amber-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out & Log In as Admin</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2.5">
              <AlertCircle className="w-4.5 h-4.5 text-rose-500 dark:text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message Alert */}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-[#009E52]/10 dark:bg-[#00E878]/15 border border-[#009E52]/30 dark:border-[#00E878]/30 text-xs font-bold text-[#009E52] dark:text-[#00E878] flex items-center gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-[#009E52] dark:text-[#00E878] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleAdminSignIn} className="space-y-4">
            <Input
              label="Yard Administrator Email *"
              type="email"
              placeholder="yardlyauto@admin.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-[#5F7E71] dark:text-[#8EA79C]" />}
              required
              autoComplete="username"
            />

            <Input
              label="Administrator Password *"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-[#5F7E71] dark:text-[#8EA79C]" />}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              className="py-3 font-black text-xs uppercase tracking-wider btn-glow"
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              {loading ? 'Authenticating Privileges...' : 'Authenticate Admin Session'}
            </Button>
          </form>

          {/* Footer Back Link */}
          <div className="pt-3 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] flex items-center justify-between text-xs text-[#355347] dark:text-[#8EA79C]">
            <Link to="/" className="font-bold text-[#009E52] dark:text-[#00E878] hover:underline flex items-center gap-1 hover:text-[#007A3E] dark:hover:text-[#55FF78]">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Marketplace</span>
            </Link>
            <Link to="/login" className="font-bold text-[#355347] hover:text-[#0F241C] dark:text-[#8EA79C] dark:hover:text-[#F2F7F3]">
              Standard Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
