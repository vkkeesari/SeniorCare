'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function LeadModal() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const openModal = () => setOpen(true);
    window.addEventListener('open-lead-modal', openModal);
    return () => window.removeEventListener('open-lead-modal', openModal);
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
    if (endpoint) {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
    }
    setLoading(false);
    setSent(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-cream p-7 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow">A helpful next step</p>
            <h2 className="mt-2 font-serif text-4xl">Let&apos;s find your fit.</h2>
          </div>
          <button onClick={() => { setOpen(false); setSent(false); }} aria-label="Close">
            <X />
          </button>
        </div>
        {sent ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="mx-auto text-moss" size={44} />
            <h3 className="mt-5 text-xl font-extrabold">You&apos;re on Gabe&apos;s list.</h3>
            <p className="mt-2 text-sm text-slate-500">We&apos;ll be in touch soon with a thoughtful next step.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-7 grid gap-4">
            <input name="name" required placeholder="Your name" className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-moss" />
            <input name="phone" required placeholder="Best phone number" className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-moss" />
            <input name="email" type="email" required placeholder="Email address" className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-moss" />
            <input name="zip" required placeholder="ZIP code" className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-moss" />
            <button disabled={loading} className="rounded-full bg-ink px-5 py-4 font-bold text-white disabled:opacity-50">
              {loading ? 'Sending...' : 'Talk with a local advisor'}
            </button>
            <p className="text-center text-xs text-slate-500">No pressure. No cost to your family.</p>
          </form>
        )}
      </div>
    </div>
  );
}
