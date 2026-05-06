type GtagItem = {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
  item_variant?: string;
  item_category?: string;
};

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    dataLayer?: unknown[];
  }
}

function track(eventName: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}

export function trackViewItem(product: {
  _id: string;
  name: string;
  price: number;
  strength?: string;
  format?: string;
}) {
  track('view_item', {
    currency: 'USD',
    value: product.price,
    items: [
      {
        item_id: product._id,
        item_name: product.name,
        price: product.price,
        quantity: 1,
        item_variant: [product.strength, product.format].filter(Boolean).join(' · ') || undefined,
      },
    ],
  });
}

export function trackAddToCart(item: {
  productId: string;
  name: string;
  price: number;
  strength?: string;
  size?: string;
  format?: string;
}) {
  track('add_to_cart', {
    currency: 'USD',
    value: item.price,
    items: [
      {
        item_id: item.productId,
        item_name: item.name,
        price: item.price,
        quantity: 1,
        item_variant: [item.strength, item.size, item.format].filter(Boolean).join(' · ') || undefined,
      },
    ],
  });
}

export function trackBeginCheckout(items: GtagItem[], value: number) {
  track('begin_checkout', {
    currency: 'USD',
    value,
    items,
  });
}

export function trackPurchase(params: {
  transactionId: string;
  value: number;
  items: GtagItem[];
  coupon?: string;
}) {
  track('purchase', {
    transaction_id: params.transactionId,
    currency: 'USD',
    value: params.value,
    coupon: params.coupon,
    items: params.items,
  });
}
