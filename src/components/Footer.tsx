import Link from 'next/link';
import OpenCareChatButton from './OpenCareChatButton';

export default function Footer() {
  return (
    <footer className="border-t border-[#d9d2c8] bg-[#F4F0E7]">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#304E43] text-[#F4F0E7]">
              <svg viewBox="0 0 52 52" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 32L26 16L37 32H15Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                <path d="M9 36H43" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M26 10V4M22 12L26 8L30 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <div>
              <b className="block font-serif text-xl text-[#304E43]">NextHaven</b>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#878E7A]">Senior Living Referral Services</span>
            </div>
          </div>
          <p className="max-w-xs text-base leading-7 text-[#3A3530]/80">A calmer, clearer way to find the right care for the people you love.</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#E7E1D5] px-3 py-2 text-sm font-bold text-[#304E43]">Local guidance · Always free to families</div>
        </div>

        <div>
          <p className="eyebrow mb-4">Explore</p>
          <div className="grid gap-3 text-base font-semibold text-[#3A3530]">
            <Link href="/care-options">Care options</Link>
            <Link href="/care-costs">Care costs</Link>
            <Link href="/about">Our approach</Link>
            <OpenCareChatButton className="flex min-h-11 items-center gap-2 text-left">Start a conversation</OpenCareChatButton>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-4">Talk with an advisor</p>
          <OpenCareChatButton className="flex min-h-11 items-center gap-2 text-left text-lg font-bold text-[#304E43]">Get Spokane guidance</OpenCareChatButton>
          <p className="mt-2 text-base leading-7 text-[#3A3530]/75">Serving Spokane, Washington and surrounding communities.</p>
        </div>
      </div>

      <div className="container-shell flex flex-col gap-3 border-t border-[#d9d2c8] py-6 text-sm text-[#3A3530]/70 md:flex-row md:items-center md:justify-between">
        <span>NextHaven. All rights reserved.</span>
        <span>Information is educational and not medical advice.</span>
      </div>
    </footer>
  );
}
