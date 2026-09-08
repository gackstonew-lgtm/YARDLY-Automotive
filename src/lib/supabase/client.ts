import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables configuration (Client-safe anon key only)
const supabaseUrl: string = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_URL || process.env?.SUPABASE_URL)) || 
  'https://pwfrrlpijkgfsbxubvqr.supabase.co';

const supabaseAnonKey: string = 
  (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY)) || 
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.VITE_SUPABASE_PUBLISHABLE_KEY)) || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3ZnJybHBpamtnZnNieHVidnFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3ODY2NjAsImV4cCI6MjEwNDM2MjY2MH0.2X3wxdVX9qwquNVLPVE4H4TVpQoDI3SO4L1BEQrvmak';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseUrl.includes('supabase.co') && 
  supabaseAnonKey && 
  !supabaseAnonKey.includes('dummy')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Re-export modular domain services for backwards compatibility and clean architecture
export { AuthService, requireAdminRole } from '../auth/auth.service';
export type { AuthUser } from '../auth/session';
export { hasRequiredRole, isAdminRole, isStaffRole, isSellerRole } from '../auth/permissions';
export { AuditLogService } from '../audit/audit.service';
export type { AuditLogEntry } from '../audit/audit.service';
export { AdminRoleService, BuyerService, SellerService } from '../users/user.service';
export { VehicleService } from '../vehicles/vehicle.service';
export { SellerSubmissionService } from '../submissions/submission.service';
export { AuctionService } from '../auctions/auction.service';
export { TradeInService } from '../tradein/tradein.service';
export { ImportService } from '../import/import.service';
export { FavoriteService } from '../favorites/favorite.service';
export { NotificationService } from '../notifications/notification.service';
export { ReservationService, PaymentService } from '../payments/payment.service';
export { InquiryService, InspectionService } from '../inquiries/inquiry.service';
export { RealtimeService } from '../realtime/realtime.service';
export { StorageService, uploadVehicleImageToSupabase } from '../storage/storage.service';
