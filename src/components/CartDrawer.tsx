'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, totalItems } = useCart();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Trap focus and close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  async function handleCheckout() {
    setChecking(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Unable to initiate checkout. Please try again.');
        setChecking(false);
      }
    } catch {
      setError('A network error occurred. Please try again.');
      setChecking(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-obsidian/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md bg-obsidian-mid border-l border-gold/15 flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold/10">
          <div>
            <h2 className="font-cormorant text-2xl text-white">Your Cart</h2>
            {totalItems > 0 && (
              <p className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim/60 mt-0.5">
                — {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-cream-dim hover:text-gold transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <ShoppingCart size={40} className="text-gold/30" />
              <p className="font-cormorant text-xl text-cream-dim">Your cart is empty.</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="font-jetbrains text-xs tracking-widest uppercase text-gold hover:text-gold-light transition-colors"
              >
                Browse Catalog →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gold/10">
              {items.map((item) => (
                <li key={item.productId} className="py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={closeCart}
                        className="font-cormorant text-lg text-white hover:text-gold transition-colors leading-tight block"
                      >
                        {item.name}
                      </Link>
                      {(item.strength || item.size) && (
                        <p className="font-jetbrains text-[0.65rem] tracking-wider uppercase text-cream-dim/60 mt-1">
                          {[item.strength, item.size].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-cream-dim/40 hover:text-error transition-colors flex-shrink-0 mt-0.5"
                      aria-label={`Remove ${item.name}`}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty controls */}
                    <div className="flex items-center gap-0">
                      <button
                        onClick={() => updateQty(item.productId, item.qty - 1)}
                        disabled={item.qty <= 1}
                        className="w-7 h-7 flex items-center justify-center border border-gold/20 text-cream-dim hover:text-gold hover:border-gold/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center font-jetbrains text-sm text-cream border-y border-gold/20 h-7 flex items-center justify-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                        className="w-7 h-7 flex items-center justify-center border border-gold/20 text-cream-dim hover:text-gold hover:border-gold/50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    {/* Line price */}
                    <p className="font-cormorant text-xl text-gold">
                      ${(item.price * item.qty).toFixed(0)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gold/10 px-6 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-jetbrains text-xs tracking-widest uppercase text-cream-dim">Subtotal</span>
              <span className="font-cormorant text-3xl text-gold">${subtotal.toFixed(0)}</span>
            </div>

            {error && (
              <p className="text-xs text-error font-jetbrains">{error}</p>
            )}

            <button
              onClick={handleCheckout}
              disabled={checking}
              className="btn btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checking ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <p className="text-[0.65rem] text-cream-dim/50 leading-relaxed text-center font-jetbrains">
              Prescription required. A licensed provider will review your order before fulfillment.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
