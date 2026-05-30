import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';

export const metadata: Metadata = {
  title: 'Admin | Greenstone',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

// Force every admin page to run server-side every request — never cache the
// list of orders, never cache the per-order detail. PHI/PCI-adjacent content.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireAdmin();

  return (
    <div className="min-h-screen bg-obsidian text-cream">
      <header className="border-b border-cream-dim/15 bg-obsidian-mid/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="font-cormorant text-2xl text-cream tracking-tight hover:text-gold transition-colors"
            >
              Greenstone <em className="italic text-gold">admin</em>
            </Link>
            <span className="font-jetbrains text-[0.55rem] tracking-widest uppercase px-2 py-1 bg-emerald/15 text-emerald border border-emerald/30">
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim hover:text-emerald-light transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/orders"
              className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim hover:text-emerald-light transition-colors"
            >
              Orders
            </Link>
            <Link
              href="/admin/customers"
              className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim hover:text-emerald-light transition-colors"
            >
              Customers
            </Link>
            <span className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim/70">
              {email}
            </span>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
