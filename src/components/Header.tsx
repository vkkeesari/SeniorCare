'use client';

import Link from 'next/link';
import { ArrowRight, Menu, Phone, X } from 'lucide-react';
import { useState } from 'react';

const links = [['Care options', '/care-options'], ['Care costs', '/care-costs'], ['Our approach', '/about']];

function openCompanion() {
  window.dispatchEvent(new Event('open-care-chat'));
}

export default function Header() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#fafafa]/95 backdrop-blur-md">
    <div className="container-shell flex h-[76px] items-center justify-between">
      <Link href="/" className="flex items-center gap-2" aria-label="Senior Care Advisory home"><span className="grid h-10 w-10 place-items-center rounded-xl bg-ink font-serif text-xl text-white">S</span><span className="text-[15px] font-extrabold tracking-tight">Senior Care <span className="font-normal text-moss">Advisory</span></span></Link>
      <nav className="hidden items-center gap-7 md:flex">{links.map(([label, href]) => <Link key={href} href={href} className="text-sm font-semibold text-slate-600 transition hover:text-ink">{label}</Link>)}<a href="tel:9195550148" className="flex min-h-11 items-center gap-2 text-sm font-bold"><Phone size={16} /> (919) 555-0148</a><button onClick={openCompanion} className="flex min-h-12 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-white transition hover:bg-moss">Talk with an advisor <ArrowRight size={16} /></button></nav>
      <button aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)} className="grid h-12 w-12 place-items-center rounded-full hover:bg-sage md:hidden">{open ? <X /> : <Menu />}</button>
    </div>
    {open && <nav className="border-t border-slate-200 bg-cream px-5 py-4 md:hidden">{links.map(([label, href]) => <Link onClick={() => setOpen(false)} key={href} href={href} className="block min-h-14 border-b border-slate-200 py-4 text-base font-semibold">{label}</Link>)}<a href="tel:9195550148" className="block min-h-14 border-b border-slate-200 py-4 font-semibold">Call (919) 555-0148</a><button onClick={() => { setOpen(false); openCompanion(); }} className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 font-bold text-white">Start a conversation <ArrowRight size={17} /></button></nav>}
  </header>;
}
