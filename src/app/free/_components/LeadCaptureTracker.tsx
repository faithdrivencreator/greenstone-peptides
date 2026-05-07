'use client';

import { useEffect, useRef } from 'react';
import { trackLeadCapture } from '@/lib/gtag';

interface LeadCaptureTrackerProps {
  ebook: 'made-easy' | 'unlocked';
}

/**
 * Fires the GA4 `generate_lead` event once when a thank-you page mounts.
 * Idempotent within a single browser tab — guards against React strict-mode
 * double-invocation in development.
 */
export function LeadCaptureTracker({ ebook }: LeadCaptureTrackerProps) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackLeadCapture({ ebook, method: 'thank_you_page' });
  }, [ebook]);
  return null;
}

export default LeadCaptureTracker;
