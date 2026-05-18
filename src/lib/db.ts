import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}
if (!serviceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type UserProfileRow = {
  user_id: string;
  full_name: string | null;
  date_of_birth: string;
  phone: string | null;
  accepted_age_21_at: string;
  accepted_ruo_at: string;
  accepted_liability_at: string;
  signup_ip: string | null;
  signup_user_agent: string | null;
  created_at: string;
  updated_at: string;
};

export type ShippingAddressRow = {
  id: string;
  user_id: string;
  label: string | null;
  recipient_name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};
