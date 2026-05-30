-- Orders table — out-of-state order capture with encrypted card-at-rest.
-- Card PAN/CVC are NEVER stored in plaintext. The card_ciphertext + card_iv +
-- card_tag columns hold an AES-256-GCM encrypted JSON blob of the full card
-- payload; the key lives only in the server env (ORDER_CARD_ENCRYPTION_KEY).
-- After Pete fulfills the order in Bloom, the encrypted blob is purged.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,                                            -- e.g. 'OOS-A4F2C8'
  user_id uuid references public.users(id) on delete set null,
  status text not null default 'awaiting_fulfillment',                 -- awaiting_fulfillment | fulfilled | cancelled

  -- Customer details (plaintext, non-sensitive)
  full_name text not null,
  email text not null,
  phone text not null,
  dob date not null,

  -- Ship-to address (where Pete will ultimately re-ship from FL)
  ship_street text not null,
  ship_apt text,
  ship_city text not null,
  ship_state char(2) not null,
  ship_zip text not null,

  -- Health screening (denormalized JSON for simplicity)
  screening jsonb not null,

  -- Product context
  product text,
  dose text,
  size text,

  -- Money (integers, cents)
  subtotal_cents integer not null,
  shipping_cents integer not null default 2500,
  total_cents integer not null,

  -- Consents (all four must be true at order time; stored for audit)
  consents jsonb not null,

  -- ENCRYPTED card blob — AES-256-GCM ciphertext, IV, and auth tag, all base64.
  card_ciphertext text,
  card_iv text,
  card_tag text,
  card_brand text,           -- 'Visa' | 'Mastercard' | ... (plaintext, derived from BIN)
  card_last4 char(4),        -- plaintext, display only
  card_exp_month smallint,
  card_exp_year smallint,

  -- Audit
  created_at timestamptz not null default now(),
  fulfilled_at timestamptz,
  card_purged_at timestamptz,
  notes text
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- Audit log for every card-reveal event. Required for HIPAA/PCI conversations
-- and to give Pete a clean trail of who saw what, when, from where.
create table if not exists public.card_access_log (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  accessed_by_email text not null,
  accessed_at timestamptz not null default now(),
  user_agent text,
  ip text
);

create index if not exists card_access_log_order_id_idx on public.card_access_log (order_id);
