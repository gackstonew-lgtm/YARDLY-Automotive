import { supabase, isSupabaseConfigured } from '../supabase/client';
import { NotificationItem } from '../../types/database';
import { INITIAL_MOCK_NOTIFICATIONS } from '../supabase/mockData';

export const NotificationService = {
  async getAll(userId?: string): Promise<NotificationItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query;
        if (!error && data) return data as NotificationItem[];
      } catch (err) {
        console.warn('NotificationService.getAll notice:', err);
      }
    }
    return INITIAL_MOCK_NOTIFICATIONS;
  },

  async getByUserId(userId: string): Promise<NotificationItem[]> {
    return this.getAll(userId);
  },

  async createNotification(notif: Omit<NotificationItem, 'id' | 'created_at' | 'read'>): Promise<NotificationItem> {
    const record: NotificationItem = {
      ...notif,
      id: 'notif-' + Date.now(),
      read: false,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .insert([{
            user_id: notif.user_id,
            type: notif.type,
            title: notif.title,
            message: notif.message,
            link: notif.link || null,
            read: false
          }])
          .select()
          .single();

        if (!error && data) {
          record.id = data.id;
        }
      } catch (err) {
        console.warn('NotificationService.create notice:', err);
      }
    }

    return record;
  },

  async markAsRead(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', id);
      } catch (err) {
        console.warn('NotificationService.markAsRead notice:', err);
      }
    }
  }
};
