/**
 * Production-safe lightweight Analytics and Telemetry helper.
 * Safely dispatches standard events without leaking PII or sensitive form data.
 */

// Global type declarations for Google Analytics & Tag Manager
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEventName = 
  | 'page_view'
  | 'view_item'
  | 'view_item_list'
  | 'whatsapp_click'
  | 'phone_call_click'
  | 'email_click'
  | 'inquiry_submit'
  | 'tradein_submit'
  | 'listing_submit'
  | 'filter_change'
  | 'cta_click';

export interface AnalyticsEventParams {
  page_path?: string;
  page_title?: string;
  item_id?: string;
  item_name?: string;
  item_category?: string;
  price?: number;
  currency?: string;
  source_location?: string;
  filter_type?: string;
  filter_value?: string;
  [key: string]: unknown;
}

export const Analytics = {
  /**
   * Tracks a custom user interaction event.
   */
  trackEvent(eventName: AnalyticsEventName, params: AnalyticsEventParams = {}): void {
    try {
      // 1. Google Analytics gtag.js integration
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
      }

      // 2. Google Tag Manager dataLayer integration
      if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: eventName,
          ...params,
          timestamp: new Date().toISOString()
        });
      }

      // 3. Optional development debug logging
      if (process.env.NODE_ENV === 'development') {
        // Safe debug log for verification
        // console.debug(`[Analytics Event] ${eventName}:`, params);
      }
    } catch {
      // Fail silently in production
    }
  },

  /**
   * Tracks page views when navigating between client-side routes.
   */
  trackPageView(path: string, title?: string): void {
    this.trackEvent('page_view', {
      page_path: path,
      page_title: title || (typeof document !== 'undefined' ? document.title : '')
    });
  },

  /**
   * Tracks vehicle detail views.
   */
  trackVehicleView(vehicleId: string, vehicleName: string, price: number): void {
    this.trackEvent('view_item', {
      item_id: vehicleId,
      item_name: vehicleName,
      item_category: 'Automotive',
      price,
      currency: 'KES'
    });
  },

  /**
   * Tracks direct WhatsApp inquiries.
   */
  trackWhatsAppClick(source: string, vehicleDetails?: string): void {
    this.trackEvent('whatsapp_click', {
      source_location: source,
      item_name: vehicleDetails || 'General Inquiry'
    });
  },

  /**
   * Tracks direct phone call inquiries.
   */
  trackPhoneClick(source: string): void {
    this.trackEvent('phone_call_click', {
      source_location: source
    });
  }
};
