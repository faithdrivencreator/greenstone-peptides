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
  shipping_state: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  zip: string | null;
  accepted_age_21_at: string;
  accepted_ruo_at: string;
  accepted_liability_at: string;
  signup_ip: string | null;
  signup_user_agent: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderStatus = 'awaiting_fulfillment' | 'fulfilled' | 'cancelled';

export type OrderRow = {
  id: string;
  ref: string;
  user_id: string | null;
  status: OrderStatus;
  full_name: string;
  email: string;
  phone: string;
  dob: string;
  ship_street: string;
  ship_apt: string | null;
  ship_city: string;
  ship_state: string;
  ship_zip: string;
  screening: Record<string, unknown>;
  product: string | null;
  dose: string | null;
  size: string | null;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  consents: Record<string, boolean>;
  card_ciphertext: string | null;
  card_iv: string | null;
  card_tag: string | null;
  card_brand: string | null;
  card_last4: string | null;
  card_exp_month: number | null;
  card_exp_year: number | null;
  created_at: string;
  fulfilled_at: string | null;
  card_purged_at: string | null;
  notes: string | null;
};

export type CardAccessLogRow = {
  id: string;
  order_id: string;
  accessed_by_email: string;
  accessed_at: string;
  user_agent: string | null;
  ip: string | null;
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
