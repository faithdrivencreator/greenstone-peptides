'use client';

import { useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { trackLeadCapture } from '@/lib/gtag';

type Ebook = 'made-easy' | 'unlocked';
type Status = 'idle' | 'submitting' | 'success' | 'error';

interface EbookCaptureFormProps {
  ebook: Ebook;
  source?: string;
  redirectUrl: string;
  /** Optional override for the submit button label */
  ctaLabel?: string;
}

export function EbookCaptureForm({ ebook, source, redirectUrl, ctaLabel }: EbookCaptureFormProps) {
  const router = useRouter();
  const emailId = useId();
  const firstNameId = useId();
  const statusId = useId();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const submitting = useRef(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/subscribe-ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          ebook,
          firstName: firstName.trim() || undefined,
          source,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      // Fire GA4 lead event before redirecting.
      trackLeadCapture({ ebook, method: source || 'ebook_landing' });

      setStatus('success');
      router.push(redirectUrl);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      submitting.current = false;
    }
  }

  const isSubmitting = status === 'submitting';
  const buttonLabel = ctaLabel || 'Send me the guide';

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor={firstNameId}
          className="block font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-cream-dim mb-2"
        >
          First name <span className="text-cream-dim/50 normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id={firstNameId}
          type="text"
          name="firstName"
          autoComplete="given-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          maxLength={80}
          className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 focus:ring-2 focus:ring-gold/30 px-4 py-3 text-cream outline-none transition-colors font-dm-sans"
          placeholder="Alex"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          htmlFor={emailId}
          className="block font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-cream-dim mb-2"
        >
          Email address
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 focus:ring-2 focus:ring-gold/30 px-4 py-3 text-cream outline-none transition-colors font-dm-sans"
          placeholder="you@example.com"
          disabled={isSubmitting}
          aria-describedby={statusId}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full justify-center disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" aria-hidden />
            Sending your guide…
          </span>
        ) : (
          buttonLabel
        )}
      </button>

      <p
        id={statusId}
        role="status"
        aria-live="polite"
        className="min-h-[1.25rem] text-[0.7rem] font-jetbrains tracking-wide"
      >
        {status === 'error' && (
          <span className="text-red-300">{errorMessage}</span>
        )}
        {status === 'success' && (
          <span className="text-emerald">Sent — redirecting you now…</span>
        )}
      </p>
    </form>
  );
}

export default EbookCaptureForm;
