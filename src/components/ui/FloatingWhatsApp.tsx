import React, { useState } from 'react';
import { siteConfig } from '../../config/site';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  defaultMessage?: string;
  className?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber = siteConfig.contact.whatsapp,
  defaultMessage = 'Hello Yardly Automotives, I would like to make an inquiry regarding your vehicles and services.',
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Clean phone number and encode message for WhatsApp Click-to-Chat API
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  return (
    <aside
      aria-label="Direct WhatsApp Contact"
      className={`fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))] sm:bottom-[calc(6rem+env(safe-area-inset-bottom,0px))] md:bottom-6 right-4 sm:right-6 z-40 flex items-center ${className}`}
    >
      {/* Tooltip on Desktop Hover */}
      <div
        role="tooltip"
        className={`hidden md:flex items-center gap-2 mr-3 px-3.5 py-2 rounded-xl bg-white/95 dark:bg-[#00251B]/95 backdrop-blur-md text-[#0F241C] dark:text-[#F2F7F3] text-xs font-bold shadow-lg border border-[rgba(0,60,40,0.12)] dark:border-[rgba(0,232,120,0.3)] transition-all duration-300 pointer-events-none ${
          isHovered
            ? 'opacity-100 translate-x-0 scale-100'
            : 'opacity-0 translate-x-2 scale-95'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <span>Chat on WhatsApp</span>
        <span className="text-[10px] text-[#5F7E71] dark:text-[#8EA79C] font-semibold border-l border-[rgba(0,60,40,0.12)] dark:border-[rgba(180,255,210,0.15)] pl-2">
          Direct Inquiries
        </span>
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.55)] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        aria-label={`Chat with Yardly Automotives on WhatsApp (+${phoneNumber})`}
        title="Chat with us on WhatsApp"
      >
        {/* Pulsing Outer Presence Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none opacity-40 group-hover:opacity-75 duration-1000" />

        {/* Online Status Badge Dot */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5 z-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#55FF78] opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#00E878] border-2 border-white dark:border-[#001A13]" />
        </span>

        {/* WhatsApp Official Silhouette Icon */}
        <svg
          className="w-7 h-7 fill-current transform group-hover:scale-110 transition-transform duration-200 shrink-0"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.44c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.65 4.2 3.71.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.12-.22-.19-.47-.31z" />
        </svg>
      </a>
    </aside>
  );
};

export default FloatingWhatsApp;
