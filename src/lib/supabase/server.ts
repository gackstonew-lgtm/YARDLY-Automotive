import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase Admin Client.
 * 
 * SECURITY NOTICE:
 * This client utilizes the high-privilege `SUPABASE_SERVICE_ROLE_KEY` to perform administrative
 * database tasks and server-side operations that bypass Row Level Security.
 * 
 * ABSOLUTE RULE:
 * This module MUST NEVER be imported or executed in client-side / browser code.
 */

if (typeof window !== 'undefined') {
  throw new Error('CRITICAL SECURITY ERROR: supabase/server.ts must never be executed in a browser environment.');
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let serverAdminClientInstance: SupabaseClient | null = null;

export function getSupabaseServerAdmin(): SupabaseClient {
  if (serverAdminClientInstance) {
    return serverAdminClientInstance;
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing server-side Supabase credentials. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are defined on the server.'
    );
  }

  serverAdminClientInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return serverAdminClientInstance;
}
