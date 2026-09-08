import { supabase, isSupabaseConfigured } from '../supabase/client';
import { Profile, UserRole } from '../../types/database';
import { requireAdminRole } from '../auth/auth.service';
import { AuditLogService } from '../audit/audit.service';
import { INITIAL_MOCK_BUYERS, INITIAL_MOCK_SELLERS } from '../supabase/mockData';

export const AdminRoleService = {
  /**
   * Updates a user's role in the database.
   * STRICTLY RESTRICTED TO ADMINISTRATORS.
   */
  async updateUserRole(targetUserId: string, newRole: UserRole): Promise<{ success: boolean; error?: string }> {
    const adminUser = await requireAdminRole();

    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Database service is offline.' };
    }

    try {
      const { data: targetUser } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('id', targetUserId)
        .maybeSingle();

      const oldRole = targetUser?.role || 'unknown';

      const { error } = await supabase
        .from('profiles')
        .update({
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', targetUserId);

      if (error) {
        return { success: false, error: error.message };
      }

      await AuditLogService.logAction(
        'user_role_changed',
        `Administrator ${adminUser.email} changed role of user ${targetUser?.email || targetUserId} from ${oldRole} to ${newRole}`,
        targetUserId,
        'profiles'
      );

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update user role.';
      return { success: false, error: msg };
    }
  }
};

export const BuyerService = {
  async getAll(): Promise<Profile[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'buyer')
          .order('created_at', { ascending: false });

        if (!error && data) return data as Profile[];
      } catch (err) {
        console.warn('BuyerService.getAll notice:', err);
      }
    }
    return INITIAL_MOCK_BUYERS;
  },

  async updateStatus(id: string, status: 'active' | 'suspended'): Promise<void> {
    await requireAdminRole();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({
            status,
            is_active: status === 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
      } catch (err) {
        console.warn('BuyerService.updateStatus error:', err);
      }
    }
  }
};

export const SellerService = {
  async getAll(): Promise<Profile[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .in('role', ['seller', 'dealer'])
          .order('created_at', { ascending: false });

        if (!error && data) return data as Profile[];
      } catch (err) {
        console.warn('SellerService.getAll notice:', err);
      }
    }
    return INITIAL_MOCK_SELLERS;
  },

  async updateVerification(id: string, status: 'verified' | 'rejected'): Promise<void> {
    await requireAdminRole();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({
            status: status === 'verified' ? 'active' : 'suspended',
            is_active: status === 'verified',
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
      } catch (err) {
        console.warn('SellerService.updateVerification error:', err);
      }
    }
  }
};
