import { supabase, isSupabaseConfigured } from '../supabase/client';
import { UserRole, SellerType } from '../../types/database';
import { AuthUser, setCachedUser, getCachedUser, clearCachedUser } from './session';
import { isAdminRole } from './permissions';
import { SignUpSchema, SignInSchema, ProfileUpdateSchema } from '../validation/schemas';
import { AuditLogService } from '../audit/audit.service';

export const AuthService = {
  /**
   * Retrieves the currently authenticated Supabase Auth user and their verified database profile.
   * Supabase Auth JWT is the authoritative source of identity.
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    if (!isSupabaseConfigured || !supabase) {
      return getCachedUser();
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        clearCachedUser();
        return null;
      }

      let role: UserRole = (user.user_metadata?.role as UserRole) || 'buyer';
      let fullName = user.user_metadata?.full_name || 'Yardly User';
      let phone = user.user_metadata?.phone;
      let sellerType = user.user_metadata?.seller_type as SellerType | undefined;
      let businessName = user.user_metadata?.business_name;
      let avatarUrl = user.user_metadata?.avatar_url;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email, full_name, phone, role, seller_type, business_name, avatar_url, is_active')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          role = (profile.role as UserRole) || role;
          fullName = profile.full_name || fullName;
          phone = profile.phone || phone;
          sellerType = profile.seller_type || sellerType;
          businessName = profile.business_name || businessName;
          avatarUrl = profile.avatar_url || avatarUrl;
        }
      } catch (profileErr) {
        // Fallback to JWT user metadata if profile table query is restricted
      }

      const authUser: AuthUser = {
        id: user.id,
        email: user.email || '',
        full_name: fullName,
        phone,
        role,
        seller_type: sellerType,
        business_name: businessName,
        avatar_url: avatarUrl
      };

      setCachedUser(authUser);
      return authUser;
    } catch (err) {
      console.warn('AuthService.getCurrentUser error:', err);
      return null;
    }
  },

  /**
   * Returns the active Supabase Auth session.
   */
  async getSession() {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  /**
   * Signs in a user using Supabase Auth with email & password.
   */
  async signIn(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    const validation = SignInSchema.safeParse({ email: email.trim(), password });
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0]?.message || 'Invalid email or password format.' };
    }

    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Authentication service is currently offline. Please configure Supabase credentials.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error || !data.user) {
        return { success: false, error: error?.message || 'Invalid email or password. Please check your credentials.' };
      }

      const authUser = await this.getCurrentUser();
      if (!authUser) {
        return { success: false, error: 'Failed to retrieve authenticated user profile.' };
      }

      return { success: true, user: authUser };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during sign in.';
      return { success: false, error: msg };
    }
  },

  /**
   * Registers a new user account via Supabase Auth.
   * CRITICAL SECURITY: Public registration is strictly restricted to 'buyer' or 'seller' roles.
   * Client-side self-assignment of administrative roles is rejected.
   */
  async signUp(
    email: string,
    password: string,
    fullName: string,
    requestedRole: UserRole = 'buyer',
    phone?: string,
    sellerType?: SellerType,
    businessName?: string
  ): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    // Sanitization: Public signups can only ever be buyer or seller
    const sanitizedRole: UserRole = requestedRole === 'seller' ? 'seller' : 'buyer';

    const validation = SignUpSchema.safeParse({
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      phone: phone?.trim(),
      role: sanitizedRole,
      sellerType,
      businessName: businessName?.trim()
    });

    if (!validation.success) {
      return { success: false, error: validation.error.errors[0]?.message || 'Validation error in signup form.' };
    }

    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Authentication service is offline. Please configure Supabase credentials.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone?.trim(),
            role: sanitizedRole,
            seller_type: sellerType,
            business_name: businessName?.trim()
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Sync profile record into public.profiles
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: data.user.email || email.trim(),
            full_name: fullName.trim(),
            phone: phone?.trim() || null,
            role: sanitizedRole,
            seller_type: sellerType || null,
            business_name: businessName?.trim() || null,
            is_active: true
          });
        } catch (profileSyncErr) {
          // Trigger handle_new_user will also create the profile on the database side
        }

        const user: AuthUser = {
          id: data.user.id,
          email: data.user.email || email.trim(),
          full_name: fullName.trim(),
          phone: phone?.trim(),
          role: sanitizedRole,
          seller_type: sellerType,
          business_name: businessName?.trim()
        };

        setCachedUser(user);
        return { success: true, user };
      }

      return { success: false, error: 'Registration completed but user object was not returned. Please check confirmation email.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during registration.';
      return { success: false, error: msg };
    }
  },

  /**
   * Dedicated Yard Admin Portal authentication.
   * Verifies credentials against Supabase Auth and validates that the authenticated
   * user holds an administrative role (admin, yard_admin, super_admin).
   */
  async adminSignIn(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    const res = await this.signIn(email, password);
    if (!res.success || !res.user) {
      return { success: false, error: res.error || 'Invalid administrator email or password.' };
    }

    if (!isAdminRole(res.user.role)) {
      await this.signOut();
      return { success: false, error: 'Access denied: Account does not have administrator privileges.' };
    }

    await AuditLogService.logAction(
      'admin_login',
      `Administrator ${res.user.email} (${res.user.role}) logged in successfully.`,
      res.user.id,
      'profiles'
    );

    return { success: true, user: res.user };
  },

  /**
   * Signs out the current user session from Supabase Auth and clears session cache.
   */
  async signOut(): Promise<void> {
    clearCachedUser();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out notice:', err);
      }
    }
  },

  /**
   * Updates profile fields for the authenticated user (excludes role modifications).
   */
  async updateProfile(updates: {
    full_name?: string;
    phone?: string;
    business_name?: string;
    seller_type?: SellerType;
    avatar_url?: string;
  }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'User must be signed in to update profile.' };
    }

    const validation = ProfileUpdateSchema.safeParse(updates);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0]?.message || 'Invalid profile update values.' };
    }

    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Authentication service is offline.' };
    }

    try {
      // 1. Update Auth metadata
      await supabase.auth.updateUser({
        data: updates
      });

      // 2. Update profiles table
      const { error: dbError } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);

      if (dbError) {
        return { success: false, error: dbError.message };
      }

      const updatedUser: AuthUser = {
        ...currentUser,
        ...updates
      };

      setCachedUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.';
      return { success: false, error: msg };
    }
  },

  /**
   * Changes the authenticated user's password.
   */
  async changePassword(password: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Authentication service is offline.' };
    }

    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update password.';
      return { success: false, error: msg };
    }
  },

  /**
   * Subscribes to Supabase Auth state changes.
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    if (!isSupabaseConfigured || !supabase) {
      callback(getCachedUser());
      return () => {};
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        clearCachedUser();
        callback(null);
      } else {
        const user = await AuthService.getCurrentUser();
        callback(user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }
};

/**
 * Server/Guard Level Admin Authorization Helper
 */
export async function requireAdminRole(): Promise<AuthUser> {
  const user = await AuthService.getCurrentUser();
  if (!user || !isAdminRole(user.role)) {
    throw new Error('Access denied: Administrator privileges required.');
  }
  return user;
}
