'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import NextHavenLogo from '@/app/NextHavenLogo.jpg';

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
    <header className="sticky top-0 z-40 border-b border-[#C3A46F]/50 bg-[#304E43] text-[#F4F0E7] shadow-md">
      <div className="container-shell flex h-[76px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="NextHaven home">
          <Image src={NextHavenLogo} alt="" aria-hidden="true" width={72} height={42} className="h-11 w-[72px] rounded-md object-cover" />
          <span className="leading-none">
            <span className="block font-serif text-[1.55rem] tracking-tight text-[#F4F0E7]">NextHaven</span>
            <span className="mt-1 block text-[10px] font-semibold tracking-wide text-[#C3A46F]">Guiding Families to Brighter Tomorrows</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-semibold text-[#F4F0E7] transition hover:text-[#C3A46F]">
              {label}
            </Link>
          ))}
          <button
            onClick={openCompanion}
            className="flex min-h-12 items-center gap-2 rounded-full bg-[#C3A46F] px-5 text-sm font-bold text-[#304E43] transition hover:bg-[#d4b984] active:bg-[#b18f58]"
          >
            Get Advisory <ArrowRight size={16} />
          </button>
        </nav>

        <button
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen(!open)}
          className="grid h-12 w-12 place-items-center rounded-full text-[#F4F0E7] hover:bg-white/10 md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-[#C3A46F]/40 bg-[#304E43] px-5 py-4 md:hidden">
          {links.map(([label, href]) => (
            <Link
              onClick={() => setOpen(false)}
              key={href}
              href={href}
              className="block min-h-14 border-b border-white/15 py-4 text-base font-semibold text-[#F4F0E7] transition hover:text-[#C3A46F]"
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              openCompanion();
            }}
            className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#C3A46F] px-5 font-bold text-[#304E43] transition hover:bg-[#d4b984] active:bg-[#b18f58]"
          >
            Get Advisory <ArrowRight size={17} />
          </button>
        </nav>
      )}
    </header>
  );
}
