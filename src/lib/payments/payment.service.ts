import { supabase, isSupabaseConfigured } from '../supabase/client';
import { Reservation, PaymentRecord } from '../../types/database';
import { INITIAL_MOCK_RESERVATIONS, INITIAL_MOCK_PAYMENTS } from '../supabase/mockData';
import { VehicleService } from '../vehicles/vehicle.service';
import { requireAdminRole } from '../auth/auth.service';
import { PaymentInitiateSchema } from '../validation/schemas';

export const ReservationService = {
  async getAll(): Promise<Reservation[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*, vehicle:vehicles(make, model, year, price)')
          .order('created_at', { ascending: false });

        if (!error && data) return data as Reservation[];
      } catch (err) {
        console.warn('ReservationService.getAll notice:', err);
      }
    }
    return INITIAL_MOCK_RESERVATIONS;
  },

  async create(res: Omit<Reservation, 'id' | 'created_at' | 'status'>): Promise<Reservation> {
    const record: Reservation = {
      ...res,
      id: 'res-' + Date.now(),
      status: 'pending',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('reservations')
        .insert([{
          vehicle_id: res.vehicle_id,
          user_id: res.user_id || null,
          buyer_name: res.buyer_name,
          buyer_phone: res.buyer_phone,
          buyer_email: res.buyer_email,
          amount: res.amount,
          currency: res.currency || 'KES',
          status: 'pending',
          expires_at: res.expires_at
        }])
        .select()
        .single();

      if (error) {
        console.error('ReservationService.create error:', error);
        throw new Error(error.message || 'Failed to create vehicle reservation.');
      }

      if (data) {
        record.id = data.id;
      }
    }

    try {
      await VehicleService.updateStatus(res.vehicle_id, 'reserved');
    } catch {
      // Best-effort status update
    }

    return record;
  },

  async updateStatus(id: string, status: Reservation['status']): Promise<void> {
    await requireAdminRole();

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('ReservationService.updateStatus error:', error);
        throw new Error(error.message || 'Failed to update reservation status.');
      }
    }
  }
};

export const PaymentService = {
  async getAll(): Promise<PaymentRecord[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) return data as PaymentRecord[];
      } catch (err) {
        console.warn('PaymentService.getAll notice:', err);
      }
    }
    return INITIAL_MOCK_PAYMENTS;
  },

  async record(payment: Omit<PaymentRecord, 'id' | 'created_at' | 'updated_at'>): Promise<PaymentRecord> {
    const record: PaymentRecord = {
      ...payment,
      id: 'pay-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          reservation_id: payment.reservation_id || null,
          vehicle_id: payment.vehicle_id,
          user_id: payment.user_id || null,
          amount: payment.amount,
          currency: payment.currency || 'KES',
          provider: payment.provider || 'test',
          checkout_request_id: payment.checkout_request_id || null,
          merchant_request_id: payment.merchant_request_id || null,
          mpesa_receipt_number: payment.mpesa_receipt_number || null,
          phone_number: payment.phone_number || '',
          status: payment.status || 'pending',
          idempotency_key: payment.idempotency_key || `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          raw_response: payment.raw_response || null
        }])
        .select()
        .single();

      if (error) {
        console.error('PaymentService.record error:', error);
        throw new Error(error.message || 'Failed to record payment in database.');
      }

      if (data) {
        record.id = data.id;
      }
    }

    return record;
  }
};
