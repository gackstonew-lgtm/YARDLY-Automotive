import { supabase, isSupabaseConfigured } from '../supabase/client';
import { Vehicle, VehicleStatus } from '../../types/database';
import { INITIAL_MOCK_VEHICLES } from '../supabase/mockData';
import { resolveVehicleImages } from '../utils/imageResolver';
import { StorageService } from '../storage/storage.service';
import { AuditLogService } from '../audit/audit.service';
import { requireAdminRole } from '../auth/auth.service';
import { VehicleFilterParams } from './vehicle.queries';

const withTimeout = <T>(promise: PromiseLike<T>, ms: number = 2000): Promise<T> => {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Query timeout after ${ms}ms`)), ms))
  ]);
};

export const VehicleService = {
  /**
   * Retrieves all publicly visible vehicles (or all for staff).
   * Seamlessly merges Supabase database entries with verified canonical catalogue.
   */
  async getAll(): Promise<Vehicle[]> {
    const baseList: Vehicle[] = INITIAL_MOCK_VEHICLES.map(v => ({
      ...v,
      images: (v.images && v.images.length > 0) ? v.images : resolveVehicleImages(v)
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        const queryPromise = supabase
          .from('vehicles')
          .select('*, images:vehicle_images(*), features:vehicle_features(feature_name)')
          .order('created_at', { ascending: false });

        const { data, error } = await withTimeout(queryPromise, 2500);

        if (!error && Array.isArray(data) && data.length > 0) {
          const dbVehicles = (data as Vehicle[]).map(v => ({
            ...v,
            images: (v.images && v.images.length > 0) ? v.images : resolveVehicleImages(v)
          }));

          // Merge: DB vehicles take precedence, and any canonical catalogue vehicle not in DB is preserved
          const dbIds = new Set(dbVehicles.map(v => v.id));
          return [
            ...dbVehicles,
            ...baseList.filter(v => !dbIds.has(v.id))
          ];
        }
        if (error) {
          console.warn('VehicleService.getAll Supabase notice:', error.message);
        }
      } catch (err) {
        console.warn('VehicleService.getAll query notice:', err);
      }
    }

    return baseList;
  },

  /**
   * Direct, targeted lookup by ID or SEO slug.
   */
  async getById(idOrSlug: string): Promise<Vehicle | null> {
    if (!idOrSlug) return null;

    if (isSupabaseConfigured && supabase) {
      try {
        const queryPromise = supabase
          .from('vehicles')
          .select('*, images:vehicle_images(*), features:vehicle_features(feature_name)')
          .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
          .maybeSingle();

        const { data, error } = await withTimeout(queryPromise, 2500);

        if (!error && data) {
          const vehicle = data as Vehicle;
          return {
            ...vehicle,
            images: (vehicle.images && vehicle.images.length > 0) ? vehicle.images : resolveVehicleImages(vehicle)
          };
        }
      } catch (err) {
        console.warn('VehicleService.getById query notice:', err);
      }
    }

    // Fallback search in initial dataset
    const found = INITIAL_MOCK_VEHICLES.find(v => v.id === idOrSlug || v.slug === idOrSlug);
    if (found) {
      return {
        ...found,
        images: (found.images && found.images.length > 0) ? found.images : resolveVehicleImages(found)
      };
    }

    return null;
  },

  /**
   * Filter and sort vehicles across full catalogue.
   */
  async filterVehicles(params: VehicleFilterParams): Promise<Vehicle[]> {
    const allVehicles = await this.getAll();
    let list = [...allVehicles];

    const bodyTypeParam = params.bodyType || (params as Record<string, unknown>).body_type as string | undefined;
    const fuelTypeParam = params.fuelType || (params as Record<string, unknown>).fuel_type as string | undefined;

    if (params.status) {
      list = list.filter(v => v.status === params.status);
    } else {
      list = list.filter(v => v.status === 'active' || v.status === 'available' || v.status === 'reserved');
    }

    if (params.make) {
      list = list.filter(v => v.make.toLowerCase() === params.make?.toLowerCase());
    }
    if (params.model) {
      list = list.filter(v => v.model.toLowerCase().includes(params.model?.toLowerCase() || ''));
    }
    if (params.location) {
      list = list.filter(v => v.location.toLowerCase().includes(params.location?.toLowerCase() || ''));
    }
    if (bodyTypeParam) {
      list = list.filter(v => v.body_type === bodyTypeParam);
    }
    if (params.transmission) {
      list = list.filter(v => v.transmission === params.transmission);
    }
    if (fuelTypeParam) {
      list = list.filter(v => v.fuel_type === fuelTypeParam);
    }
    if (params.minPrice !== undefined) {
      list = list.filter(v => v.price >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      list = list.filter(v => v.price <= params.maxPrice!);
    }
    if (params.minYear !== undefined) {
      list = list.filter(v => v.year >= params.minYear!);
    }
    if (params.maxYear !== undefined) {
      list = list.filter(v => v.year <= params.maxYear!);
    }
    if (params.verifiedOnly) {
      list = list.filter(v => v.verification_status === 'verified');
    }
    if (params.featuredOnly) {
      list = list.filter(v => v.featured);
    }

    switch (params.sortBy) {
      case 'price_low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'mileage_low':
        list.sort((a, b) => (a.mileage || 0) - (b.mileage || 0));
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        break;
    }

    if (params.limit) {
      list = list.slice(0, params.limit);
    }

    return list;
  },

  /**
   * Adds a new vehicle listing to Supabase.
   * Requires administrative / staff privileges.
   */
  async addVehicle(vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }): Promise<Vehicle> {
    const admin = await requireAdminRole();

    const vehicleId = `v-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const slug = `${vehicleData.make}-${vehicleData.model}-${vehicleData.year}-${vehicleId.slice(-4)}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Process & upload any base64 images
    let uploadedImages = vehicleData.images || [];
    if (uploadedImages.length > 0) {
      uploadedImages = await Promise.all(
        uploadedImages.map(async (img, idx) => {
          let url = img.image_url;
          if (url.startsWith('data:')) {
            url = await StorageService.uploadVehicleImage(vehicleId, url);
          }
          return {
            ...img,
            id: img.id || `img-${Date.now()}-${idx}`,
            vehicle_id: vehicleId,
            image_url: url,
            display_order: idx + 1,
            is_primary: idx === 0,
            created_at: new Date().toISOString()
          };
        })
      );
    }

    const newVehicle: Vehicle = {
      ...vehicleData,
      id: vehicleId,
      slug,
      images: uploadedImages,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([{
          seller_id: vehicleData.seller_id || admin.id,
          created_by: admin.id,
          make: newVehicle.make,
          model: newVehicle.model,
          variant: newVehicle.variant || null,
          year: newVehicle.year,
          price: newVehicle.price,
          currency: newVehicle.currency || 'KES',
          mileage: newVehicle.mileage,
          engine_cc: newVehicle.engine_cc,
          fuel_type: newVehicle.fuel_type,
          transmission: newVehicle.transmission,
          body_type: newVehicle.body_type,
          drive_type: newVehicle.drive_type || null,
          color: newVehicle.color || 'Silver',
          location: newVehicle.location,
          description: newVehicle.description,
          registration_number: newVehicle.registration_number || null,
          vin: newVehicle.vin || null,
          status: newVehicle.status || 'active',
          verification_status: newVehicle.verification_status || 'verified',
          logbook_verified: Boolean(newVehicle.logbook_verified),
          featured: Boolean(newVehicle.featured),
          seller_type: newVehicle.seller_type || 'dealer',
          dealer_name: newVehicle.dealer_name || 'Yardly Certified',
          slug
        }])
        .select()
        .single();

      if (error) {
        console.error('VehicleService.addVehicle Supabase insert error:', error);
        throw new Error(error.message || 'Failed to insert vehicle into database.');
      }

      if (data) {
        newVehicle.id = data.id;

        // Insert images
        if (uploadedImages.length > 0) {
          const { error: imgError } = await supabase.from('vehicle_images').insert(
            uploadedImages.map(img => ({
              vehicle_id: data.id,
              image_url: img.image_url,
              display_order: img.display_order,
              is_primary: img.is_primary
            }))
          );
          if (imgError) {
            console.warn('Vehicle images insert notice:', imgError.message);
          }
        }
      }
    }

    await AuditLogService.logAction(
      'vehicle_created',
      `Admin ${admin.email} created vehicle listing: ${newVehicle.year} ${newVehicle.make} ${newVehicle.model} (KES ${newVehicle.price.toLocaleString()})`,
      newVehicle.id,
      'vehicles'
    );

    return newVehicle;
  },

  /**
   * Updates an existing vehicle listing.
   */
  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle | null> {
    const admin = await requireAdminRole();

    const { images, features, ...vehicleColumns } = updates;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('vehicles')
        .update({
          ...vehicleColumns,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('VehicleService.updateVehicle error:', error);
        throw new Error(error.message || 'Failed to update vehicle in database.');
      }

      if (images && Array.isArray(images) && images.length > 0) {
        await supabase.from('vehicle_images').delete().eq('vehicle_id', id);
        const { error: imgError } = await supabase.from('vehicle_images').insert(
          images.map((img, idx) => ({
            vehicle_id: id,
            image_url: img.image_url,
            display_order: img.display_order || idx + 1,
            is_primary: img.is_primary ?? idx === 0,
            alt_text: img.alt_text || null
          }))
        );
        if (imgError) {
          console.warn('Vehicle images update notice:', imgError.message);
        }
      }
    }

    await AuditLogService.logAction(
      'vehicle_updated',
      `Admin ${admin.email} updated vehicle #${id}`,
      id,
      'vehicles'
    );

    return this.getById(id);
  },

  /**
   * Updates a vehicle's listing status.
   */
  async updateStatus(id: string, status: VehicleStatus): Promise<void> {
    await requireAdminRole();

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('vehicles')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('VehicleService.updateStatus error:', error);
        throw new Error(error.message || 'Failed to update vehicle status.');
      }
    }

    await AuditLogService.logAction(
      'vehicle_status_changed',
      `Changed vehicle #${id} status to ${status}`,
      id,
      'vehicles'
    );
  },

  /**
   * Deletes a vehicle listing.
   * Requires administrative privileges.
   */
  async deleteVehicle(id: string): Promise<void> {
    const admin = await requireAdminRole();

    if (isSupabaseConfigured && supabase) {
      await supabase.from('vehicle_images').delete().eq('vehicle_id', id);
      const { error } = await supabase.from('vehicles').delete().eq('id', id);
      if (error) {
        console.error('VehicleService.deleteVehicle error:', error);
        throw new Error(error.message || 'Failed to delete vehicle from database.');
      }
    }

    await AuditLogService.logAction(
      'vehicle_deleted',
      `Admin ${admin.email} deleted vehicle listing #${id}`,
      id,
      'vehicles'
    );
  }
};
