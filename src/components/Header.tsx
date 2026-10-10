'use client';

import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  ['About Us', '/about'],
  ['Home', '/'],
];

function openCompanion() {
  window.dispatchEvent(new Event('open-care-chat'));
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#d9d2c8] bg-[#F4F0E7]/95 backdrop-blur-md">
      <div className="container-shell flex h-[76px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="NextHaven home">
          <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-[#304E43] shadow-sm">
            <svg viewBox="0 0 64 64" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 11L22 22H27L18 31H25L16 41H28V50H36V41H48L39 31H46L37 22H42L32 11Z" fill="#C3A46F"/>
              <path d="M30 41H34V50H30V41Z" fill="#C3A46F"/>
            </svg>
          </span>
          <span className="leading-none">
            <span className="block font-serif text-[1.55rem] tracking-tight text-[#304E43]">NextHaven</span>
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#878E7A]">Senior Living Referral Services</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-semibold text-[#3A3530] transition hover:text-[#304E43]">
              {label}
            </Link>
          ))}
          <button
            onClick={openCompanion}
            className="flex min-h-12 items-center gap-2 rounded-full bg-[#304E43] px-5 text-sm font-bold text-white transition hover:bg-[#263f38]"
          >
            Get Advisory <ArrowRight size={16} />
          </button>
        </nav>

        <button
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen(!open)}
          className="grid h-12 w-12 place-items-center rounded-full hover:bg-[#e0dbc8] md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-[#d9d2c8] bg-[#F4F0E7] px-5 py-4 md:hidden">
          {links.map(([label, href]) => (
            <Link
              onClick={() => setOpen(false)}
              key={href}
              href={href}
              className="block min-h-14 border-b border-[#e4ddd4] py-4 text-base font-semibold text-[#3A3530]"
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              openCompanion();
            }}
            className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#304E43] px-5 font-bold text-white"
          >
            Get Advisory <ArrowRight size={17} />
          </button>
        </nav>
      )}
    </header>
  );
}
