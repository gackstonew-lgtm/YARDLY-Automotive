import { supabase, isSupabaseConfigured } from '../supabase/client';

export const RealtimeService = {
  /**
   * Subscribes to Supabase Realtime postgres_changes on the specified table.
   * Returns an unsubscribe handler function.
   */
  subscribeToTable(table: string, onUpdate: (payload: any) => void): () => void {
    if (!isSupabaseConfigured || !supabase) {
      return () => {};
    }

    try {
      const client = supabase;
      const channel = client
        .channel(`public:${table}:${Date.now()}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table },
          (payload) => {
            onUpdate(payload);
          }
        )
        .subscribe();

      return () => {
        if (client) {
          client.removeChannel(channel);
        }
      };
    } catch (err) {
      console.warn(`RealtimeService.subscribeToTable (${table}) notice:`, err);
      return () => {};
    }
  },

  /**
   * Compatibility broadcast hook.
   */
  broadcastLocalEvent(_table: string, _data: any): void {
    // No-op in pure Supabase Realtime mode
  }
};
