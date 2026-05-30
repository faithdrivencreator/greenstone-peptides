import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/db';
import type { ShippingAddress } from '@/types/next-auth';

// Module augmentation lives in src/types/next-auth.d.ts so the same
// declarations are picked up by every consumer (client + server).

type AuthUserRow = {
  id: string;
  email: string;
  password_hash: string;
};

type ProfileFetch = {
  full_name: string | null;
  shipping_state: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  zip: string | null;
  phone: string | null;
  date_of_birth: string | null;
};

async function loadProfile(userId: string): Promise<{
  shippingState: string | null;
  shippingAddress: ShippingAddress | null;
  phone: string | null;
  dateOfBirth: string | null;
}> {
  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('full_name, shipping_state, address_line1, address_line2, city, zip, phone, date_of_birth')
    .eq('user_id', userId)
    .maybeSingle<ProfileFetch>();

  if (!profile) {
    return { shippingState: null, shippingAddress: null, phone: null, dateOfBirth: null };
  }

  return {
    shippingState: profile.shipping_state ?? null,
    shippingAddress: {
      line1: profile.address_line1 ?? null,
      line2: profile.address_line2 ?? null,
      city: profile.city ?? null,
      state: profile.shipping_state ?? null,
      zip: profile.zip ?? null,
    },
    phone: profile.phone ?? null,
    dateOfBirth: profile.date_of_birth ?? null,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'Email & password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === 'string' ? credentials.email.toLowerCase().trim() : '';
        const password = typeof credentials?.password === 'string' ? credentials.password : '';

        if (!email || !password) return null;

        const { data, error } = await supabaseAdmin
          .from('users')
          .select('id, email, password_hash')
          .eq('email', email)
          .maybeSingle<AuthUserRow>();

        if (error || !data?.password_hash) return null;

        const valid = await bcrypt.compare(password, data.password_hash);
        if (!valid) return null;

        // Fetch display name from profile (optional)
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('full_name')
          .eq('user_id', data.id)
          .maybeSingle<{ full_name: string | null }>();

        return {
          id: data.id,
          email: data.email,
          name: profile?.full_name ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // First sign-in — copy the user.id into the token and fetch profile.
      if (user) {
        token.id = (user as { id: string }).id;
        const p = await loadProfile(token.id);
        token.shippingState = p.shippingState;
        token.shippingAddress = p.shippingAddress;
        token.phone = p.phone;
        token.dateOfBirth = p.dateOfBirth;
      }

      // Allow callers (e.g. /api/account/shipping) to force a refresh via
      // `update()` from useSession — re-read everything from user_profiles.
      if (trigger === 'update' && token.id) {
        const p = await loadProfile(token.id);
        token.shippingState = p.shippingState;
        token.shippingAddress = p.shippingAddress;
        token.phone = p.phone;
        token.dateOfBirth = p.dateOfBirth;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.shippingState = token.shippingState ?? null;
        session.user.shippingAddress = token.shippingAddress ?? null;
        session.user.phone = token.phone ?? null;
        session.user.dateOfBirth = token.dateOfBirth ?? null;
      }
      return session;
    },
  },
});
