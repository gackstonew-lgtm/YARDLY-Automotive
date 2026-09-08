import { supabase, isSupabaseConfigured } from '../supabase/client';
import { VehicleInquiry } from '../../types/database';
import { INITIAL_MOCK_INQUIRIES } from '../supabase/mockData';
import { InquiryInputSchema, TestDriveInputSchema, InspectionInputSchema } from '../validation/schemas';
import { requireAdminRole } from '../auth/auth.service';

export const InquiryService = {
  async getAll(): Promise<VehicleInquiry[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('vehicle_inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) return data as VehicleInquiry[];
      } catch (err) {
        console.warn('InquiryService.getAll notice:', err);
      }
    }
    return INITIAL_MOCK_INQUIRIES;
  },

  async create(inquiry: Omit<VehicleInquiry, 'id' | 'created_at' | 'status'>): Promise<VehicleInquiry> {
    const validation = InquiryInputSchema.safeParse(inquiry);
    if (!validation.success) {
      throw new Error(validation.error.errors[0]?.message || 'Invalid inquiry form data.');
    }

    const record: VehicleInquiry = {
      ...inquiry,
      id: 'inq-' + Date.now(),
      status: 'new',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('vehicle_inquiries')
        .insert([{
          vehicle_id: inquiry.vehicle_id,
          buyer_id: inquiry.buyer_id || null,
          name: inquiry.name,
          phone: inquiry.phone,
          email: inquiry.email,
          message: inquiry.message,
          source: inquiry.source || 'web',
          status: 'new'
        }])
        .select()
        .single();

      if (error) {
        console.error('InquiryService.create error:', error);
        throw new Error(error.message || 'Failed to submit inquiry.');
      }

      if (data) {
        record.id = data.id;
      }
    }

    return record;
  },

  async updateStatus(id: string, status: VehicleInquiry['status']): Promise<void> {
    await requireAdminRole();

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('vehicle_inquiries')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('InquiryService.updateStatus error:', error);
        throw new Error(error.message || 'Failed to update inquiry status.');
      }
    }
  }
};

export const InspectionService = {
  async getAll(): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('inspection_requests')
          .select('*, vehicle:vehicles(make, model, year, price, location)')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) return data;
      } catch (err) {
        console.warn('InspectionService.getAll notice:', err);
      }
    }
    return [];
  },

  async create(req: {
    vehicle_id: string;
    buyer_id?: string;
    seller_id?: string;
    buyer_name: string;
    buyer_phone: string;
    buyer_email: string;
    preferred_date: string;
    preferred_time: string;
    location?: string;
    notes?: string;
  }): Promise<any> {
    const validation = InspectionInputSchema.safeParse(req);
    if (!validation.success) {
      throw new Error(validation.error.errors[0]?.message || 'Invalid inspection request data.');
    }

    const record = {
      ...req,
      id: 'insp-' + Date.now(),
      location: req.location || 'Nairobi Yard',
      status: 'requested',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('inspection_requests')
        .insert([{
          vehicle_id: req.vehicle_id,
          buyer_id: req.buyer_id || null,
          seller_id: req.seller_id || null,
          buyer_name: req.buyer_name,
          buyer_phone: req.buyer_phone,
          buyer_email: req.buyer_email,
          preferred_date: req.preferred_date,
          preferred_time: req.preferred_time,
          location: req.location || 'Nairobi Yard',
          notes: req.notes,
          status: 'requested'
        }])
        .select()
        .single();

      if (error) {
        console.error('InspectionService.create error:', error);
        throw new Error(error.message || 'Failed to submit inspection request.');
      }

      if (data) {
        record.id = data.id;
      }
    }

    return record;
  },

  async updateStatus(id: string, status: string, sellerNotes?: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('inspection_requests')
        .update({
          status,
          seller_notes: sellerNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('InspectionService.updateStatus error:', error);
        throw new Error(error.message || 'Failed to update inspection status.');
      }
    }
  }
};
