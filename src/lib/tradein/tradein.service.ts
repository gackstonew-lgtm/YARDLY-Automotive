import { supabase, isSupabaseConfigured } from '../supabase/client';
import { TradeInRequest } from '../../types/database';
import { INITIAL_MOCK_TRADE_INS } from '../supabase/mockData';
import { requireAdminRole } from '../auth/auth.service';

export const TradeInService = {
  async getAll(): Promise<TradeInRequest[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('trade_in_requests')
          .select('*, target_vehicle:vehicles(make, model, year, price)')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) return data as TradeInRequest[];
      } catch (err) {
        console.warn('TradeInService.getAll notice:', err);
      }
    }
    return INITIAL_MOCK_TRADE_INS;
  },

  async create(req: Omit<TradeInRequest, 'id' | 'created_at' | 'status' | 'reference_id'> & { reference_id?: string }): Promise<TradeInRequest> {
    const reference_id = req.reference_id || `TI-${Date.now().toString().slice(-6)}`;
    const record: TradeInRequest = {
      ...req,
      id: 'trade-' + Date.now(),
      reference_id,
      status: 'new',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('trade_in_requests')
        .insert([{
          user_id: req.user_id || null,
          user_name: req.full_name,
          user_phone: req.phone,
          user_email: req.email,
          current_vehicle_make: req.make,
          current_vehicle_model: req.model,
          current_vehicle_year: req.year,
          current_vehicle_mileage: req.mileage,
          current_vehicle_condition: req.condition,
          estimated_value: req.expected_value || null,
          notes: req.description || null,
          status: 'new'
        }])
        .select()
        .single();

      if (error) {
        console.error('TradeInService.create error:', error);
        throw new Error(error.message || 'Failed to submit trade-in request.');
      }

      if (data) {
        record.id = data.id;
      }
    }

    return record;
  },

  async updateStatus(id: string, status: TradeInRequest['status'], valuationOffer?: number): Promise<void> {
    await requireAdminRole();

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('trade_in_requests')
        .update({
          status,
          valuation_offer: valuationOffer || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('TradeInService.updateStatus error:', error);
        throw new Error(error.message || 'Failed to update trade-in status.');
      }
    }
  }
};
