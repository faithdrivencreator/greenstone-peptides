import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/db';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

type AuthUserRow = {
  id: string;
  email: string;
  password_hash: string;
};

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
    async jwt({ token, user }) {
      if (user) {
        (token as { id?: string }).id = (user as { id: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      const id = (token as { id?: string }).id;
      if (session.user && id) {
        session.user.id = id;
      }
      return session;
    },
  },
});
