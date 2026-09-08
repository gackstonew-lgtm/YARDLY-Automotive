import { supabase, isSupabaseConfigured } from '../supabase/client';
import { SellerListingSubmission } from '../../types/database';
import { INITIAL_MOCK_SUBMISSIONS } from '../supabase/mockData';
import { StorageService } from '../storage/storage.service';
import { VehicleService } from '../vehicles/vehicle.service';
import { requireAdminRole } from '../auth/auth.service';
import { AuditLogService } from '../audit/audit.service';

export const SellerSubmissionService = {
  async getAll(): Promise<SellerListingSubmission[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('seller_listings')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map(item => ({
            id: item.id,
            seller_name: item.seller_name,
            seller_phone: item.seller_phone,
            seller_email: item.seller_email,
            seller_type: item.seller_type || 'private',
            make: item.make,
            model: item.model,
            year: item.year,
            registration_number: item.registration_number,
            mileage: item.mileage,
            engine_cc: item.engine_cc,
            transmission: item.transmission,
            fuel_type: item.fuel_type,
            body_type: item.body_type,
            location: item.location,
            asking_price: Number(item.asking_price),
            description: item.description,
            condition: item.condition || 'Foreign Used',
            images: Array.isArray(item.images) ? item.images : [],
            logbook_document_url: item.logbook_document_url,
            status: item.status || 'pending_review',
            rejection_reason: item.rejection_reason,
            created_at: item.created_at
          }));
        }
      } catch (err) {
        console.warn('SellerSubmissionService.getAll notice:', err);
      }
    }
    return INITIAL_MOCK_SUBMISSIONS;
  },

  async create(submission: Omit<SellerListingSubmission, 'id' | 'status' | 'created_at'>): Promise<SellerListingSubmission> {
    const submissionId = 'sub-' + Date.now();

    // Process & upload any base64 images
    let uploadedImages: string[] = [];
    if (submission.images && submission.images.length > 0) {
      uploadedImages = await Promise.all(
        submission.images.map(img => StorageService.uploadVehicleImage(`submission-${Date.now()}`, img))
      );
    }

    let uploadedLogbook = submission.logbook_document_url;
    if (uploadedLogbook && uploadedLogbook.startsWith('data:')) {
      uploadedLogbook = await StorageService.uploadVehicleImage(`logbook-${Date.now()}`, uploadedLogbook);
    }

    const record: SellerListingSubmission = {
      ...submission,
      id: submissionId,
      images: uploadedImages.length > 0 ? uploadedImages : (submission.images || []),
      logbook_document_url: uploadedLogbook,
      status: 'pending_review',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('seller_listings')
        .insert([{
          seller_name: record.seller_name,
          seller_phone: record.seller_phone,
          seller_email: record.seller_email,
          seller_type: record.seller_type || 'private',
          make: record.make,
          model: record.model,
          year: record.year,
          registration_number: record.registration_number,
          mileage: record.mileage,
          engine_cc: record.engine_cc,
          transmission: record.transmission,
          fuel_type: record.fuel_type,
          body_type: record.body_type,
          location: record.location,
          asking_price: record.asking_price,
          description: record.description,
          condition: record.condition || 'Foreign Used',
          images: record.images,
          logbook_document_url: record.logbook_document_url || null,
          status: 'pending_review'
        }])
        .select()
        .single();

      if (error) {
        console.error('SellerSubmissionService.create error:', error);
        throw new Error(error.message || 'Failed to submit seller listing.');
      }

      if (data) {
        record.id = data.id;
      }
    }

    return record;
  },

  async updateStatus(id: string, status: SellerListingSubmission['status'], rejection_reason?: string): Promise<void> {
    const admin = await requireAdminRole();

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('seller_listings')
        .update({
          status,
          rejection_reason: rejection_reason || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('SellerSubmissionService.updateStatus error:', error);
        throw new Error(error.message || 'Failed to update submission status.');
      }
    }

    await AuditLogService.logAction(
      status === 'approved' ? 'submission_approved' : 'submission_rejected',
      `Admin ${admin.email} ${status === 'approved' ? 'approved' : 'rejected'} listing submission #${id}`,
      id,
      'seller_listings'
    );
  }
};
