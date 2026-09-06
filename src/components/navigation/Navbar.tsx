import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, ShieldCheck, Menu, X, PhoneCall, User, RefreshCw, Gavel, Globe, Wrench, Navigation, Key, Building, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '../../config/site';
import { AuthService, AuthUser } from '../../lib/supabase/client';
import { ThemeToggle } from '../ui/ThemeToggle';
import { ThemeSelector } from '../ui/ThemeSelector';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const location = useLocation();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    AuthService.getCurrentUser().then(setUser).catch(() => setUser(null));
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    if (mobileMenuOpen) {
      document.body.classList.add('menu-open');
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Buy', path: '/buy', icon: Search },
    { name: 'Sell', path: '/sell', icon: PlusCircle },
    { name: 'Trade In', path: '/trade-in', icon: RefreshCw },
    { name: 'Auction', path: '/auction', icon: Gavel },
    { name: 'Import', path: '/import', icon: Globe },
  ];

  const mobileMenuItems = [
    {
      name: user ? 'My Account Dashboard' : 'Sign in / Register Account',
      path: user ? ((user.role === 'admin' || user.role === 'yard_admin') ? '/admin' : '/account') : '/login',
      icon: User
    },
    ...(user?.role === 'admin' || user?.role === 'yard_admin' ? [{
      name: 'Yard Admin Portal',
      path: '/admin',
      icon: ShieldCheck
    }] : []),
    {
      name: 'Car Accessories & Spares',
      path: '/accessories',
      icon: Wrench
    },
    {
      name: 'Tracker Installations',
      path: '/trackers',
      icon: Navigation
    },
    {
      name: 'Car Hire Services',
      path: '/car-hire',
      icon: Key
    },
    {
      name: 'Dealerships',
      path: '/dealerships',
      icon: Building
    },
    {
      name: 'About Us',
      path: '/about',
      icon: Info
    }
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#001A13]/95 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/40 py-2.5 border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)]'
          : 'bg-white/95 dark:bg-[#001A13] py-3.5 border-b border-[rgba(0,60,40,0.06)] dark:border-[rgba(180,255,210,0.08)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Official Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#009E52] dark:focus:ring-[#00E878] rounded-xl p-1 shrink-0">
          <div className="h-10 w-10 rounded-xl overflow-hidden bg-[#EBF2EE] dark:bg-[#002B1F] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(180,255,210,0.18)] p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-300 flex items-center justify-center shrink-0">
            <img
              src="/logo.jpeg"
              alt="Yardly Automotives Logo"
              className="h-full w-full object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col justify-center text-left min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-black tracking-tight text-[#0F241C] dark:text-[#F2F7F3] leading-none group-hover:text-[#009E52] dark:group-hover:text-[#00E878] transition-colors font-sans truncate">
                {siteConfig.name}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#009E52] dark:text-[#00E878] tracking-wide mt-0.5 font-sans truncate">
              {siteConfig.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links - Exclusively Buy, Sell, Trade In, Auction, Import */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5 xl:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#009E52] dark:focus:ring-[#00E878] ${
                  isActive
                    ? 'bg-[#009E52] dark:bg-[#00E878] text-white dark:text-[#001A13] font-black shadow-md shadow-[#009E52]/20 dark:shadow-[#00E878]/25'
                    : 'text-[#355347] dark:text-[#A7BDB3] hover:bg-[#EBF2EE] dark:hover:bg-[#002B1F]/60 hover:text-[#009E52] dark:hover:text-[#00E878]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white dark:text-[#001A13]' : 'text-[#009E52] dark:text-[#00E878]'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Theme Switcher Button */}
          <ThemeToggle />

          <Link to={user ? ((user.role === 'admin' || user.role === 'yard_admin') ? '/admin' : '/account') : '/login'} className="hidden sm:block">
            <button className="px-4 py-2 rounded-xl bg-[#EBF2EE] dark:bg-[#002B1F] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(180,255,210,0.18)] text-[#0F241C] dark:text-[#F2F7F3] text-xs font-extrabold flex items-center gap-1.5 hover:border-[#009E52] dark:hover:border-[#00E878] hover:bg-white dark:hover:bg-[#003D2D] hover:text-[#009E52] dark:hover:text-[#00E878] transition-all duration-200 shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#009E52] dark:focus:ring-[#00E878]">
              <User className="w-3.5 h-3.5 text-[#009E52] dark:text-[#00E878]" />
              <span>{user ? 'My Account' : 'Sign In'}</span>
            </button>
          </Link>

          {/* Menu Toggle Button - Available on Mobile, Tablet & Desktop */}
          <button
            ref={menuButtonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="navigation-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="min-w-[44px] sm:min-w-[48px] min-h-[44px] sm:min-h-[48px] px-3 py-2 rounded-xl bg-[#EBF2EE] dark:bg-[#002B1F] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(180,255,210,0.18)] text-[#0F241C] dark:text-[#F2F7F3] hover:text-[#009E52] dark:hover:text-[#00E878] hover:bg-white dark:hover:bg-[#003D2D] hover:border-[#009E52] dark:hover:border-[#00E878] active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#009E52] dark:focus:ring-[#00E878] cursor-pointer shadow-sm"
          >
            {mobileMenuOpen ? (
              <>
                <X className="w-5 h-5 text-[#0F241C] dark:text-[#F2F7F3]" />
                <span className="text-xs font-bold text-[#0F241C] dark:text-[#F2F7F3]">Close</span>
              </>
            ) : (
              <>
                <Menu className="w-5 h-5 text-[#009E52] dark:text-[#00E878]" />
                <span className="text-xs font-bold text-[#0F241C] dark:text-[#F2F7F3]">Menu</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Backdrop & Navigation Drawer for Mobile, Tablet & Desktop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setMobileMenuOpen(false);
                menuButtonRef.current?.focus();
              }}
              className="fixed inset-0 top-[65px] sm:top-[70px] bg-black/60 dark:bg-black/75 backdrop-blur-md z-40"
              aria-hidden="true"
            />

            <motion.div
              id="navigation-drawer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-0 right-0 z-50 bg-white/98 dark:bg-[#001A13]/98 backdrop-blur-xl border-b border-[rgba(0,60,40,0.12)] dark:border-[rgba(180,255,210,0.18)] px-4 sm:px-6 lg:px-8 py-5 sm:py-6 shadow-2xl overflow-y-auto max-h-[calc(100vh-75px)] pb-safe text-[#0F241C] dark:text-[#F2F7F3]"
            >
              <div className="max-w-lg mx-auto space-y-4 sm:space-y-5">

                {/* Appearance Theme Selector */}
                <ThemeSelector className="p-3.5 rounded-2xl bg-[#F4F8F6] dark:bg-[#00251B] border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] shadow-sm" />

                {/* Quick Services Grid */}
                <div className="bg-[#F4F8F6] dark:bg-[#00251B] p-3.5 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] shadow-sm">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#5F7E71] dark:text-[#8EA79C] mb-2.5 px-1 flex items-center justify-between">
                    <span>Quick Services</span>
                    <span className="text-[#009E52] dark:text-[#00E878] text-[10px] font-bold">Yardly Automotives</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 bg-white dark:bg-[#001F17] p-2 rounded-xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.08)]">
                    <Link
                      to="/buy"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center justify-center p-2.5 rounded-lg hover:bg-[#EBF2EE] dark:hover:bg-[#002B1F] text-center transition-colors group"
                    >
                      <Search className="w-4 h-4 text-[#009E52] dark:text-[#00E878] mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-black text-[#009E52] dark:text-[#00E878]">BUY</span>
                    </Link>
                    <Link
                      to="/sell"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center justify-center p-2.5 rounded-lg hover:bg-[#EBF2EE] dark:hover:bg-[#002B1F] text-center transition-colors group"
                    >
                      <PlusCircle className="w-4 h-4 text-rose-500 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-black text-rose-500">SELL</span>
                    </Link>
                    <Link
                      to="/trade-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center justify-center p-2.5 rounded-lg hover:bg-[#EBF2EE] dark:hover:bg-[#002B1F] text-center transition-colors group"
                    >
                      <RefreshCw className="w-4 h-4 text-[#009E52] dark:text-[#55FF78] mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-black text-[#009E52] dark:text-[#55FF78]">TRADE IN</span>
                    </Link>
                  </div>
                </div>

                {/* Main 7 Menu Items */}
                <div className="space-y-2">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#5F7E71] dark:text-[#8EA79C] px-2 mb-1">
                    Menu & Services
                  </div>
                  {mobileMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-4 sm:px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all duration-200 ${
                          isActive
                            ? 'bg-[#009E52] dark:bg-[#00E878] text-white dark:text-[#001A13] shadow-md shadow-[#009E52]/20 dark:shadow-[#00E878]/25 font-black'
                            : 'bg-[#F4F8F6] dark:bg-[#00251B] text-[#0F241C] dark:text-[#F2F7F3] hover:bg-white dark:hover:bg-[#003D2D] hover:border-[#009E52]/50 dark:hover:border-[#00E878]/50 border border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.12)] shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white dark:text-[#001A13]' : 'text-[#009E52] dark:text-[#00E878]'}`} />
                          <span className="tracking-tight">{item.name}</span>
                        </div>
                        {isActive ? (
                          <span className="text-[10px] font-extrabold uppercase bg-white/20 dark:bg-black/20 text-white dark:text-[#001A13] px-2.5 py-0.5 rounded-full">Active</span>
                        ) : (
                          <span className="text-xs text-[#5F7E71] dark:text-[#8EA79C] opacity-60">→</span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Hotline & Help Footer */}
                <div className="pt-3 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(180,255,210,0.1)] flex items-center justify-between text-xs text-[#5F7E71] dark:text-[#8EA79C] px-1">
                  <span>Customer Support:</span>
                  <a href={`tel:${siteConfig.contact.phone}`} className="font-bold text-[#009E52] dark:text-[#00E878] hover:underline flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{siteConfig.contact.phone}</span>
                  </a>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
