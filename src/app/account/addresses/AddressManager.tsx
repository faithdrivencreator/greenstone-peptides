'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus } from 'lucide-react';
import type { ShippingAddressRow } from '@/lib/db';

type FormState = {
  label: string;
  recipient_name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
};

const EMPTY: FormState = {
  label: '',
  recipient_name: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'US',
  phone: '',
  is_default: false,
};

export function AddressManager({ initialAddresses }: { initialAddresses: ShippingAddressRow[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(initialAddresses.length === 0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...form,
          label: form.label || null,
          line2: form.line2 || null,
          phone: form.phone || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ? `Could not save: ${data.error}` : 'Could not save address.');
        setSubmitting(false);
        return;
      }
      setForm(EMPTY);
      setShowForm(false);
      window.scrollTo({ top: 0, behavior: 'auto' });
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Network error.');
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this address?')) return;
    const res = await fetch(`/api/addresses?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) router.refresh();
  }

  return (
    <div className="space-y-8">
      {initialAddresses.length > 0 && (
        <ul className="space-y-3">
          {initialAddresses.map((a) => (
            <li key={a.id} className="bg-obsidian/40 border border-cream-dim/10 p-5 flex items-start justify-between gap-4">
              <div className="text-sm text-cream space-y-0.5">
                {a.label && (
                  <p className="font-jetbrains text-[0.6rem] tracking-widest uppercase text-emerald mb-1">
                    {a.label}
                    {a.is_default && <span className="ml-2 text-gold">· Default</span>}
                  </p>
                )}
                <p className="font-medium">{a.recipient_name}</p>
                <p className="text-cream-dim">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
                <p className="text-cream-dim">
                  {a.city}, {a.state} {a.postal_code} · {a.country}
                </p>
                {a.phone && <p className="text-cream-dim text-xs">{a.phone}</p>}
              </div>
              <button
                onClick={() => onDelete(a.id)}
                className="p-2 text-cream-dim hover:text-rose-300 transition-colors"
                aria-label="Delete address"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-emerald/40 text-emerald hover:bg-emerald/10 font-jetbrains text-[0.65rem] tracking-widest uppercase transition-colors"
        >
          <Plus size={12} /> Add new address
        </button>
      )}

      {showForm && (
        <form onSubmit={onSubmit} className="bg-obsidian-mid border border-gold/20 p-6 space-y-4">
          <h2 className="font-cormorant text-2xl text-cream" style={{ fontWeight: 400 }}>
            New address
          </h2>

          <Field label="Label (e.g. Home)" value={form.label} onChange={(v) => update('label', v)} />
          <Field label="Recipient name" required value={form.recipient_name} onChange={(v) => update('recipient_name', v)} />
          <Field label="Street address" required value={form.line1} onChange={(v) => update('line1', v)} />
          <Field label="Apt / suite (optional)" value={form.line2} onChange={(v) => update('line2', v)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" required value={form.city} onChange={(v) => update('city', v)} />
            <Field label="State" required value={form.state} onChange={(v) => update('state', v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ZIP" required value={form.postal_code} onChange={(v) => update('postal_code', v)} />
            <Field label="Country" required value={form.country} onChange={(v) => update('country', v.toUpperCase().slice(0, 2))} />
          </div>
          <Field label="Phone (optional)" value={form.phone} onChange={(v) => update('phone', v)} />

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => update('is_default', e.target.checked)}
              className="w-4 h-4 accent-emerald"
            />
            <span className="text-sm text-cream-dim">Set as default address</span>
          </label>

          {error && (
            <div className="bg-rose-900/20 border border-rose-500/30 text-rose-200 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-emerald hover:bg-emerald-light text-white font-jetbrains text-[0.65rem] tracking-widest uppercase transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save address'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setForm(EMPTY);
                setError(null);
              }}
              className="px-5 py-2.5 border border-cream-dim/30 text-cream-dim hover:text-cream font-jetbrains text-[0.65rem] tracking-widest uppercase transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="font-jetbrains text-[0.6rem] tracking-widest uppercase text-cream-dim block mb-1.5">
        {label} {required && <span className="text-rose-300">*</span>}
      </label>
      <input
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-obsidian/60 border border-cream-dim/20 focus:border-emerald/60 outline-none px-3 py-2 text-cream text-sm transition-colors"
      />
    </div>
  );
}
