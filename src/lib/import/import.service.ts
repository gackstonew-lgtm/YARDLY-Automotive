import { supabase, isSupabaseConfigured } from '../supabase/client';
import { ImportRequest } from '../../types/database';
import { INITIAL_MOCK_IMPORTS } from '../supabase/mockData';
import { requireAdminRole } from '../auth/auth.service';

export const ImportService = {
  async getAll(): Promise<ImportRequest[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('import_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) return data as ImportRequest[];
      } catch (err) {
        console.warn('ImportService.getAll notice:', err);
      }
    }
    return INITIAL_MOCK_IMPORTS;
  },

  async create(req: Omit<ImportRequest, 'id' | 'created_at' | 'status' | 'reference_number'> & { reference_number?: string }): Promise<ImportRequest> {
    const reference_number = req.reference_number || `IMP-${Date.now().toString().slice(-6)}`;
    const record: ImportRequest = {
      ...req,
      id: 'imp-' + Date.now(),
      reference_number,
      status: 'new',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('import_requests')
        .insert([{
          user_id: req.user_id || null,
          user_name: req.full_name,
          user_phone: req.phone,
          user_email: req.email,
          preferred_make: req.make,
          preferred_model: req.model,
          preferred_year_min: req.year_min || null,
          budget_kes: req.budget || null,
          sourcing_country: req.preferred_source_country || req.country || 'Japan',
          notes: req.additional_requirements || req.preferred_specs || null,
          status: 'new'
        }])
        .select()
        .single();

      if (error) {
        console.error('ImportService.create error:', error);
        throw new Error(error.message || 'Failed to submit import request.');
      }

      if (data) {
        record.id = data.id;
      }
    }

    return record;
  },

  async updateStatus(id: string, status: ImportRequest['status'], adminNotes?: string): Promise<void> {
    await requireAdminRole();

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('import_requests')
        .update({
          status,
          admin_notes: adminNotes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('ImportService.updateStatus error:', error);
        throw new Error(error.message || 'Failed to update import request status.');
      }
    }
  }
};
