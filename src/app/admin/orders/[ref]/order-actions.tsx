'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RevealedCard {
  pan: string;
  cvc: string;
  exp_month: number;
  exp_year: number;
  cardholder: string;
}

interface Props {
  orderRef: string;
  status: 'awaiting_fulfillment' | 'fulfilled' | 'cancelled';
  cardPurged: boolean;
  purgedAt: string | null;
  fulfilledAt: string | null;
}

const REVEAL_SECONDS = 60;

function formatPan(pan: string): string {
  return pan.replace(/(.{4})/g, '$1 ').trim();
}

export function OrderActions({ orderRef, status, cardPurged, purgedAt, fulfilledAt }: Props) {
  const router = useRouter();
  const [revealLoading, setRevealLoading] = useState(false);
  const [revealError, setRevealError] = useState<string | null>(null);
  const [card, setCard] = useState<RevealedCard | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const [fulfilling, setFulfilling] = useState(false);
  const [fulfillError, setFulfillError] = useState<string | null>(null);

  // Countdown — auto-hide after REVEAL_SECONDS.
  useEffect(() => {
    if (!card) return;
    setSecondsLeft(REVEAL_SECONDS);
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setCard(null);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [card]);

  async function onReveal() {
    setRevealError(null);
    setRevealLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderRef}/reveal`, { method: 'POST' });
      if (res.status === 410) {
        setRevealError('Card has been purged and cannot be revealed.');
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setRevealError(data.error || `Reveal failed (${res.status}).`);
        return;
      }
      const data = (await res.json()) as { card: RevealedCard };
      setCard(data.card);
      // Refresh server data so the access log shows the new row.
      router.refresh();
    } catch {
      setRevealError('Network error while revealing card.');
    } finally {
      setRevealLoading(false);
    }
  }

  function hideNow() {
    setCard(null);
    setSecondsLeft(0);
  }

  async function onFulfill() {
    if (!confirm('Mark this order as fulfilled? This will permanently delete the encrypted card.')) {
      return;
    }
    setFulfillError(null);
    setFulfilling(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderRef}/fulfill`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFulfillError(data.error || `Fulfill failed (${res.status}).`);
        return;
      }
      // Clear any revealed card from local memory.
      setCard(null);
      router.refresh();
    } catch {
      setFulfillError('Network error while fulfilling order.');
    } finally {
      setFulfilling(false);
    }
  }

  if (cardPurged) {
    return (
      <div className="border border-cream-dim/20 bg-obsidian/40 px-4 py-3 text-sm text-cream-dim">
        <span className="text-emerald font-jetbrains text-[0.6rem] tracking-widest uppercase mr-2">Purged</span>
        Card was purged after fulfillment{purgedAt ? ` on ${new Date(purgedAt).toLocaleString()}` : ''}.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Reveal */}
      {!card ? (
        <button
          type="button"
          onClick={onReveal}
          disabled={revealLoading}
          className="px-5 py-2.5 bg-gold/15 hover:bg-gold/25 disabled:opacity-50 border border-gold/40 text-gold font-jetbrains text-[0.65rem] tracking-widest uppercase transition-colors"
        >
          {revealLoading ? 'Decrypting…' : 'Reveal full card details'}
        </button>
      ) : (
        <div className="border border-gold/40 bg-gold/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-jetbrains text-[0.6rem] tracking-widest uppercase text-gold">
              Card revealed · auto-hides in {secondsLeft}s
            </div>
            <button
              type="button"
              onClick={hideNow}
              className="font-jetbrains text-[0.6rem] tracking-widest uppercase text-cream-dim hover:text-cream"
            >
              Hide now
            </button>
          </div>
          <dl className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 font-jetbrains">
            <div className="sm:col-span-2">
              <dt className="text-cream-dim text-xs">Card number</dt>
              <dd className="text-cream text-base tracking-wider select-all">{formatPan(card.pan)}</dd>
            </div>
            <div>
              <dt className="text-cream-dim text-xs">Cardholder</dt>
              <dd className="text-cream select-all">{card.cardholder}</dd>
            </div>
            <div>
              <dt className="text-cream-dim text-xs">Expiry</dt>
              <dd className="text-cream select-all">
                {String(card.exp_month).padStart(2, '0')}/{String(card.exp_year).slice(-2)}
              </dd>
            </div>
            <div>
              <dt className="text-cream-dim text-xs">CVC</dt>
              <dd className="text-cream select-all">{card.cvc}</dd>
            </div>
          </dl>
        </div>
      )}

      {revealError && (
        <div className="border border-rose-500/40 bg-rose-900/20 text-rose-200 px-3 py-2 text-xs">
          {revealError}
        </div>
      )}

      {/* Fulfill */}
      <div className="pt-3 border-t border-cream-dim/10">
        {status === 'fulfilled' ? (
          <div className="text-sm text-cream-dim">
            <span className="text-emerald font-jetbrains text-[0.6rem] tracking-widest uppercase mr-2">Fulfilled</span>
            {fulfilledAt ? new Date(fulfilledAt).toLocaleString() : ''}
          </div>
        ) : (
          <button
            type="button"
            onClick={onFulfill}
            disabled={fulfilling}
            className="px-5 py-2.5 bg-emerald hover:bg-emerald-light disabled:opacity-50 text-obsidian font-jetbrains text-[0.65rem] tracking-widest uppercase transition-colors"
          >
            {fulfilling ? 'Marking…' : 'Mark as fulfilled (purges card)'}
          </button>
        )}
        {fulfillError && (
          <div className="mt-2 border border-rose-500/40 bg-rose-900/20 text-rose-200 px-3 py-2 text-xs">
            {fulfillError}
          </div>
        )}
      </div>
    </div>
  );
}
