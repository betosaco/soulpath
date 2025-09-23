import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // During build time, return a mock client if environment variables are not available
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠️  Supabase environment variables not available during build, using mock client');
      return {
        auth: { getUser: () => Promise.resolve({ data: { user: null }, error: null }) },
        from: () => ({ select: () => ({ data: [], error: null }) }),
        storage: { from: () => ({ upload: () => Promise.resolve({ data: null, error: null }) }) }
      } as unknown as SupabaseClient;
    }
  }
  
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  
  if (!supabaseKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }
  
  // Check if the service role key appears to be truncated
  if (supabaseKey.length < 50) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY appears to be truncated. Please check your environment variables.');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // During build time, return a mock client if environment variables are not available
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠️  Supabase environment variables not available during build, using mock client');
      return {
        auth: { getUser: () => Promise.resolve({ data: { user: null }, error: null }) },
        from: () => ({ select: () => ({ data: [], error: null }) }),
        storage: { from: () => ({ upload: () => Promise.resolve({ data: null, error: null }) }) }
      } as unknown as SupabaseClient;
    }
  }
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}
