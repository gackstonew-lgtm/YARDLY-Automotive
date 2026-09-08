import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIPhoneOrIPad = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

    if (isIPhoneOrIPad && !isStandalone) {
      setIsIOS(true);
      // Show iOS prompt after 3 seconds if not dismissed
      const dismissed = localStorage.getItem('yardly_pwa_ios_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setShowBanner(true), 3000);
        return () => clearTimeout(timer);
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    if (isIOS) {
      localStorage.setItem('yardly_pwa_ios_dismissed', 'true');
    }
  };

  if (!showBanner || installed) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md bg-white dark:bg-[#121212] text-[#0F241C] dark:text-[#F2F7F3] p-4 rounded-2xl shadow-2xl border border-[rgba(0,60,40,0.12)] dark:border-[rgba(45, 125, 255,0.3)] z-50 animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0251B8] to-[#2D7DFF] flex items-center justify-center text-white dark:text-[#050505] shrink-0 shadow-md">
          <Smartphone className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-[#0F241C] dark:text-[#F2F7F3]">Install Yardly Automotives App</h4>
            <span className="bg-[#0251B8]/10 dark:bg-[#2D7DFF]/20 text-[#0251B8] dark:text-[#2D7DFF] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#0251B8]/20 dark:border-[#2D7DFF]/30">PWA Ready</span>
          </div>
          <p className="text-xs text-[#355347] dark:text-[#A7BDB3] mt-1 leading-relaxed">
            {isIOS 
              ? 'Install Yardly Automotives on your iPhone: tap Share in Safari, then select "Add to Home Screen".'
              : 'Add Yardly Automotives to your home screen for fast offline browsing and direct access.'}
          </p>
        </div>

        <button 
          onClick={handleDismiss} 
          className="text-[#355347] dark:text-[#8EA79C] hover:text-[#0F241C] dark:hover:text-[#F2F7F3] p-1 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {!isIOS && deferredPrompt && (
        <div className="mt-3 flex items-center gap-2 pt-3 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)]">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-gradient-to-r from-[#0251B8] to-[#2D7DFF] hover:from-[#0150B5] hover:to-[#FF3B4E] text-white dark:text-[#050505] text-xs font-extrabold py-2 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Install App Now
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-xs font-medium text-[#355347] dark:text-[#8EA79C] hover:text-[#0F241C] dark:hover:text-[#F2F7F3] transition-colors"
          >
            Later
          </button>
        </div>
      )}
    </div>
  );
};
