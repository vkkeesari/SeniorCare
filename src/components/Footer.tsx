import Link from 'next/link';
import OpenCareChatButton from './OpenCareChatButton';

export default function Footer() {
  return <footer className="border-t border-slate-200 bg-white">
    <div className="container-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
      <div><div className="mb-5 flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-lg bg-ink font-serif text-lg text-white">S</span><b>Senior Care Advisory</b></div><p className="max-w-xs text-base leading-7 text-slate-600">A calmer, clearer way to find the right care for the people you love.</p><div className="mt-6 inline-flex items-center gap-2 rounded-full bg-sage px-3 py-2 text-sm font-bold text-moss">Local guidance · Always free to families</div></div>
      <div><p className="eyebrow mb-4">Explore</p><div className="grid gap-3 text-base font-semibold text-slate-600"><Link href="/care-options">Care options</Link><Link href="/care-costs">Care costs</Link><Link href="/about">Our approach</Link><OpenCareChatButton className="flex min-h-11 items-center gap-2 text-left">Start a conversation</OpenCareChatButton></div></div>
      <div><p className="eyebrow mb-4">Talk with an advisor</p><a href="tel:9195550148" className="text-lg font-bold">(919) 555-0148</a><p className="mt-2 text-base leading-7 text-slate-600">Serving Raleigh, Durham, Cary, and surrounding Triangle communities.</p></div>
    </div>
    <div className="container-shell flex flex-col gap-3 border-t border-slate-200 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between"><span>Senior Care Advisory. All rights reserved.</span><span>Information is educational and not medical advice.</span></div>
  </footer>;
}
