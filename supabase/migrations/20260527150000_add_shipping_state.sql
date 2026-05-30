-- Add shipping_state to user_profiles.
-- Nullable for backward compatibility with existing accounts.
-- CHECK constraint restricts to the 50 US states + DC.
-- Index supports fast filtering (e.g. FL vs out-of-state segmentation).

alter table public.user_profiles
  add column if not exists shipping_state char(2);

alter table public.user_profiles
  drop constraint if exists user_profiles_shipping_state_check;

alter table public.user_profiles
  add constraint user_profiles_shipping_state_check
  check (
    shipping_state is null
    or shipping_state in (
      'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL',
      'GA','HI','ID','IL','IN','IA','KS','KY','LA','ME',
      'MD','MA','MI','MN','MS','MO','MT','NE','NV','NH',
      'NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI',
      'SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
    )
  );

create index if not exists user_profiles_shipping_state_idx
  on public.user_profiles (shipping_state);
