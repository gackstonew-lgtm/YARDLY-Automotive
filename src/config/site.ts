import { ImportEligibility, MarketStatus } from '../types/database';

export const siteConfig = {
  name: "Yardly Automotives",
  legalName: "Yardly Automotives Technologies Ltd",
  tagline: "Find Your Next Drive",
  secondaryTagline: "Explore quality vehicles, compare your options, and find the right car for your lifestyle with Yardly Automotives.",
  description: "Explore quality vehicles and discover your next drive with Yardly Automotives.",
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
  ogImage: '/logo.jpeg',
  contact: {
    phone: "0712052104",
    whatsapp: "254712052104",
    email: "support@yardlyautomotives.co.ke",
    address: "Kenyatta Avenue, Nakuru, Kenya",
    hours: "Mon - Sat: 8:00 AM - 6:00 PM"
  },
  socials: {
    facebook: "https://facebook.com/yardlyautomotives",
    twitter: "https://x.com/yardlyautomotives",
    instagram: "https://instagram.com/yardlyautomotives",
    linkedin: "https://linkedin.com/company/yardlyautomotives"
  },
  reservation: {
    defaultDepositKES: 50000,
    currency: "KES",
    holdingPeriodDays: 3,
  },
  financing: {
    defaultInterestRate: 14.0, // 14% p.a. standard Kenyan auto loan rate
    defaultTenureMonths: 48,
    minDepositPercent: 20
  },

  // 2026 Kenyan Import Regulation Rules (Max 8 Years Rule)
  importRules: {
    USED_IMPORT_MAX_AGE_YEARS: 8,
    CURRENT_YEAR: 2026,
    STANDARD_STEERING: 'RHD',
  }
};

/**
 * Calculates Kenyan Import Eligibility dynamically for 2026 regulations.
 * Rule: Vehicle age must be <= 8 years (e.g., Year >= 2018 for 2026 context) and RHD.
 */
export function calculateImportEligibility(year: number, steering: 'RHD' | 'LHD' | 'unknown' = 'RHD'): {
  eligibility: ImportEligibility;
  marketStatus: MarketStatus;
} {
  const currentYear = siteConfig.importRules.CURRENT_YEAR;
  const maxAge = siteConfig.importRules.USED_IMPORT_MAX_AGE_YEARS;
  const minImportYear = currentYear - maxAge;

  if (steering === 'LHD') {
    return {
      eligibility: 'special_case',
      marketStatus: 'specialty_import'
    };
  }

  if (year >= minImportYear && steering === 'RHD') {
    return {
      eligibility: 'eligible',
      marketStatus: 'importable_subject_to_requirements'
    };
  }

  if (year < minImportYear) {
    return {
      eligibility: 'not_applicable', // Too old for new import, available only as locally used
      marketStatus: 'locally_available'
    };
  }

  return {
    eligibility: 'subject_to_verification',
    marketStatus: 'kenya_market'
  };
}
