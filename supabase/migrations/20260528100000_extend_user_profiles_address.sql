-- Extend user_profiles with full ship-to address fields.
-- These are used to pre-fill the out-of-state order form so customers
-- don't have to retype the address on every order.
-- All nullable for backward compatibility with existing accounts.

alter table public.user_profiles
  add column if not exists address_line1 text,
  add column if not exists address_line2 text,
  add column if not exists city text,
  add column if not exists zip text;
