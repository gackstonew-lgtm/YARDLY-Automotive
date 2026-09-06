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
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md bg-[#00251B] text-[#F2F7F3] p-4 rounded-2xl shadow-2xl border border-[rgba(0,232,120,0.3)] z-50 animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00E878] to-[#00B85E] flex items-center justify-center text-[#001A13] shrink-0 shadow-md">
          <Smartphone className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-[#F2F7F3]">Install Yardly Automotives App</h4>
            <span className="bg-[#00E878]/20 text-[#00E878] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#00E878]/30">PWA Ready</span>
          </div>
          <p className="text-xs text-[#A7BDB3] mt-1 leading-relaxed">
            {isIOS 
              ? 'Install Yardly Automotives on your iPhone: tap Share in Safari, then select "Add to Home Screen".'
              : 'Add Yardly Automotives to your home screen for fast offline browsing and direct access.'}
          </p>
        </div>

        <button 
          onClick={handleDismiss} 
          className="text-[#8EA79C] hover:text-[#F2F7F3] p-1 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {!isIOS && deferredPrompt && (
        <div className="mt-3 flex items-center gap-2 pt-3 border-t border-[rgba(180,255,210,0.12)]">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-gradient-to-r from-[#00E878] to-[#55FF78] hover:from-[#55FF78] hover:to-[#00E878] text-[#001A13] text-xs font-extrabold py-2 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Install App Now
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-xs font-medium text-[#8EA79C] hover:text-[#F2F7F3] transition-colors"
          >
            Later
          </button>
        </div>
      )}
    </div>
  );
};
