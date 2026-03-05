import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials missing. Database operations will fail.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export function initDb() {
  console.log('📡 Supabase client initialized');
  // Note: Tables must be created manually in Supabase SQL Editor using the provided SQL.
}

export default supabase;
