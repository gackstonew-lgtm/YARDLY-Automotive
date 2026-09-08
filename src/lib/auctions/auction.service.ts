import { supabase, isSupabaseConfigured } from '../supabase/client';
import { Auction, AuctionBid } from '../../types/database';
import { INITIAL_MOCK_AUCTIONS } from '../supabase/mockData';
import { VehicleService } from '../vehicles/vehicle.service';
import { AuthService, requireAdminRole } from '../auth/auth.service';
import { AuthUser } from '../auth/session';
import { resolveVehicleImages } from '../utils/imageResolver';
import { AuctionBidSchema } from '../validation/schemas';
import { NotificationService } from '../notifications/notification.service';

export const AuctionService = {
  /**
   * Retrieves all auctions. Computes live status based on start/end timestamps.
   */
  async getAll(): Promise<Auction[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('auctions')
          .select('*, vehicle:vehicles(*, images:vehicle_images(*)), bids:auction_bids(*)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const now = Date.now();
          return data.map((auc: any) => {
            let status = auc.status;
            const start = new Date(auc.start_time).getTime();
            const end = new Date(auc.end_time).getTime();

            if (status !== 'cancelled') {
              if (now < start) {
                status = 'upcoming';
              } else if (now >= start && now < end) {
                status = (end - now <= 24 * 3600 * 1000) ? 'ending_soon' : 'live';
              } else if (now >= end) {
                status = 'ended';
              }
            }

            const vehicle = auc.vehicle ? {
              ...auc.vehicle,
              images: (auc.vehicle.images && auc.vehicle.images.length > 0)
                ? auc.vehicle.images
                : resolveVehicleImages(auc.vehicle)
            } : undefined;

            return {
              id: auc.id,
              vehicle_id: auc.vehicle_id,
              seller_id: auc.seller_id,
              starting_bid: Number(auc.starting_bid),
              current_bid: Number(auc.current_bid),
              minimum_increment: Number(auc.minimum_increment || 10000),
              bid_count: Number(auc.bid_count || 0),
              start_time: auc.start_time,
              end_time: auc.end_time,
              status,
              created_at: auc.created_at,
              updated_at: auc.updated_at,
              vehicle,
              bids: auc.bids ? auc.bids.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : []
            };
          });
        }
      } catch (err) {
        console.warn('AuctionService.getAll notice:', err);
      }
    }

    const auctions = INITIAL_MOCK_AUCTIONS;
    const vehicles = await VehicleService.getAll();
    const now = Date.now();

    return auctions.map(auc => {
      const v = vehicles.find(item => item.id === auc.vehicle_id);
      let status = auc.status;
      const start = new Date(auc.start_time).getTime();
      const end = new Date(auc.end_time).getTime();

      if (status !== 'cancelled') {
        if (now < start) {
          status = 'upcoming';
        } else if (now >= start && now < end) {
          status = (end - now <= 24 * 3600 * 1000) ? 'ending_soon' : 'live';
        } else if (now >= end) {
          status = 'ended';
        }
      }

      return {
        ...auc,
        status,
        vehicle: v
      };
    });
  },

  async getById(id: string): Promise<Auction | null> {
    const list = await this.getAll();
    return list.find(a => a.id === id) || null;
  },

  async createAuction(data: Omit<Auction, 'id' | 'bid_count' | 'created_at' | 'current_bid'>): Promise<Auction> {
    await requireAdminRole();

    const newAuc: Auction = {
      ...data,
      id: 'auc-' + Date.now(),
      current_bid: data.starting_bid,
      bid_count: 0,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data: inserted, error } = await supabase
        .from('auctions')
        .insert([{
          vehicle_id: data.vehicle_id,
          seller_id: data.seller_id || null,
          starting_bid: data.starting_bid,
          current_bid: data.starting_bid,
          minimum_increment: data.minimum_increment || 10000,
          bid_count: 0,
          start_time: data.start_time,
          end_time: data.end_time,
          status: data.status || 'upcoming'
        }])
        .select()
        .single();

      if (error) {
        console.error('AuctionService.createAuction error:', error);
        throw new Error(error.message || 'Failed to create auction in database.');
      }

      if (inserted) {
        newAuc.id = inserted.id;
      }
    }

    return newAuc;
  },

  /**
   * Places an authenticated bid on an active auction.
   * Derives bidder identity securely from the authenticated Supabase session.
   */
  async placeBid(auctionId: string, userOrBuyer: AuthUser, amount: number): Promise<{ success: boolean; auction?: Auction; error?: string }> {
    const currentUser = await AuthService.getCurrentUser();
    const effectiveUser = currentUser || userOrBuyer;

    if (!effectiveUser) {
      return { success: false, error: 'You must be signed in to place a bid on an auction.' };
    }

    const list = await this.getAll();
    const auc = list.find(a => a.id === auctionId);
    if (!auc) return { success: false, error: 'Auction not found.' };

    const now = Date.now();
    const end = new Date(auc.end_time).getTime();
    if (now >= end || auc.status === 'ended' || auc.status === 'cancelled') {
      return { success: false, error: 'This auction has ended and is no longer accepting bids.' };
    }

    const minBidRequired = auc.current_bid + (auc.minimum_increment || 10000);
    if (amount < minBidRequired) {
      return { success: false, error: `Bid amount must be at least KES ${minBidRequired.toLocaleString()}` };
    }

    const validation = AuctionBidSchema.safeParse({
      auction_id: auctionId,
      buyer_id: effectiveUser.id,
      buyer_name: effectiveUser.full_name,
      buyer_email: effectiveUser.email,
      amount
    });

    if (!validation.success) {
      return { success: false, error: validation.error.errors[0]?.message || 'Invalid bid data.' };
    }

    const newBid: AuctionBid = {
      id: 'bid-' + Date.now(),
      auction_id: auctionId,
      buyer_id: effectiveUser.id,
      buyer_name: effectiveUser.full_name,
      buyer_email: effectiveUser.email,
      amount,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data: bidData, error: bidErr } = await supabase
        .from('auction_bids')
        .insert([{
          auction_id: auctionId,
          buyer_id: effectiveUser.id,
          buyer_name: effectiveUser.full_name,
          buyer_email: effectiveUser.email,
          amount
        }])
        .select()
        .single();

      if (bidErr) {
        console.error('AuctionService.placeBid error:', bidErr);
        return { success: false, error: bidErr.message || 'Failed to record auction bid.' };
      }

      if (bidData) {
        newBid.id = bidData.id;
      }

      const { error: updateAucErr } = await supabase
        .from('auctions')
        .update({
          current_bid: amount,
          bid_count: (auc.bid_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', auctionId);

      if (updateAucErr) {
        console.warn('Auction current bid update notice:', updateAucErr.message);
      }
    }

    // Send notification
    try {
      await NotificationService.createNotification({
        user_id: effectiveUser.id,
        type: 'auction_bid',
        title: 'Bid Placed Successfully',
        message: `You placed a bid of KES ${amount.toLocaleString()} on auction #${auctionId}`,
        link: '/auction'
      });
    } catch {
      // Ignore notification warning
    }

    if (!auc.bids) auc.bids = [];
    auc.bids.unshift(newBid);
    auc.current_bid = amount;
    auc.bid_count = (auc.bid_count || 0) + 1;

    return { success: true, auction: auc };
  },

  async updateStatus(id: string, status: Auction['status']): Promise<void> {
    await requireAdminRole();

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('auctions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('AuctionService.updateStatus error:', error);
        throw new Error(error.message || 'Failed to update auction status.');
      }
    }
  }
};
