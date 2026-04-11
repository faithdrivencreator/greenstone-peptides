'use client';

import { useState } from 'react';

export function ProviderSignupForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="card-glass text-center">
        <p className="mono">Received</p>
        <h3 className="font-cormorant text-2xl text-gold mt-2">Thank you, doctor.</h3>
        <p className="text-cream-dim mt-3">
          A member of our provider team will reach out within one business day to verify your
          credentials and activate portal access.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: POST to /api/provider-signup (Phase 2)
        setSubmitted(true);
      }}
      className="card-glass space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First Name" name="firstName" required />
        <Field label="Last Name" name="lastName" required />
      </div>
      <Field label="Email" name="email" type="email" required />
      <Field label="Phone" name="phone" type="tel" required />
      <Field label="Practice Name" name="practice" required />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="NPI Number" name="npi" required />
        <Field label="State License #" name="license" required />
      </div>
      <label className="block">
        <span className="mono block mb-2">Notes</span>
        <textarea
          name="notes"
          rows={4}
          className="w-full bg-obsidian-light border border-gold/20 px-4 py-3 text-cream rounded focus:border-gold outline-none"
        />
      </label>
      <button type="submit" className="btn btn-primary w-full">
        Request Access
      </button>
    </form>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}

function Field({ label, name, type = 'text', required }: FieldProps) {
  return (
    <label className="block">
      <span className="mono block mb-2">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full bg-obsidian-light border border-gold/20 px-4 py-3 text-cream rounded focus:border-gold outline-none"
      />
    </label>
  );
}
