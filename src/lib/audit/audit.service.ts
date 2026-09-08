import { supabase, isSupabaseConfigured } from '../supabase/client';

export interface AuditLogEntry {
  id: string;
  user_id?: string;
  user_email?: string;
  action: string;
  details: string;
  table_name?: string;
  record_id?: string;
  created_at: string;
}

export const AuditLogService = {
  /**
   * Retrieves security and administrative audit logs from Supabase.
   * Access is protected by PostgreSQL RLS (Admin & Super Admin only).
   */
  async getLogs(): Promise<AuditLogEntry[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error || !data) {
        console.warn('Supabase audit log query notice:', error?.message);
        return [];
      }

      return data.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        user_email: item.new_data?.user_email || 'system',
        action: item.action,
        details: item.new_data?.details || item.action,
        table_name: item.table_name,
        record_id: item.record_id,
        created_at: item.created_at
      }));
    } catch (err) {
      console.warn('AuditLogService.getLogs error:', err);
      return [];
    }
  },

  /**
   * Records an administrative or security audit event in Supabase.
   * Does NOT record sensitive data such as passwords, tokens, or payment card numbers.
   */
  async logAction(action: string, details: string, recordId?: string, tableName?: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('audit_logs').insert([{
        user_id: user?.id || null,
        action,
        table_name: tableName || null,
        record_id: recordId || null,
        new_data: {
          details,
          user_email: user?.email || 'system',
          timestamp: new Date().toISOString()
        }
      }]);
    } catch (err) {
      console.warn('AuditLogService.logAction notice:', err);
    }
  }
};
