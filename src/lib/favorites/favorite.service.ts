import { supabase, isSupabaseConfigured } from '../supabase/client';
import { Favorite } from '../../types/database';
import { INITIAL_MOCK_FAVORITES } from '../supabase/mockData';

export const FavoriteService = {
  async getAll(userId?: string): Promise<Favorite[]> {
    if (isSupabaseConfigured && supabase && userId) {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('*, vehicle:vehicles(*, images:vehicle_images(*))')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) return data as Favorite[];
      } catch (err) {
        console.warn('FavoriteService.getAll notice:', err);
      }
    }
    return INITIAL_MOCK_FAVORITES;
  },

  async getByUserId(userId: string): Promise<Favorite[]> {
    return this.getAll(userId);
  },

  async addFavorite(userId: string, vehicleId: string): Promise<Favorite> {
    const fav: Favorite = {
      id: 'fav-' + Date.now(),
      user_id: userId,
      vehicle_id: vehicleId,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .insert([{ user_id: userId, vehicle_id: vehicleId }])
          .select()
          .single();

        if (!error && data) {
          fav.id = data.id;
        }
      } catch (err) {
        console.warn('FavoriteService.addFavorite notice:', err);
      }
    }

    return fav;
  },

  async removeFavorite(userId: string, vehicleId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('vehicle_id', vehicleId);
      } catch (err) {
        console.warn('FavoriteService.removeFavorite notice:', err);
      }
    }
  }
};
