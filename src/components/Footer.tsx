import Link from 'next/link';
import Image from 'next/image';
import OpenCareChatButton from './OpenCareChatButton';
import NextHavenLogo from '@/app/NextHavenLogo.jpg';

export default function Footer() {
  return (
    <footer className="border-t border-[#C3A46F]/50 bg-[#304E43] text-[#F4F0E7]">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <Image src={NextHavenLogo} alt="" aria-hidden="true" width={96} height={56} className="h-14 w-24 rounded-lg object-cover" />
            <div>
              <b className="block font-serif text-xl text-[#F4F0E7]">NextHaven</b>
              <span className="text-xs font-semibold text-[#C3A46F]">Guiding Families to Brighter Tomorrows</span>
            </div>
          </div>
          <p className="max-w-xs text-base leading-7 text-[#F4F0E7]/80">A calmer, clearer way to find the right care for the people you love.</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C3A46F] px-3 py-2 text-sm font-bold text-[#304E43]">Local guidance · Always free to families</div>
        </div>

        <div>
          <p className="eyebrow mb-4 text-[#C3A46F]">Explore</p>
          <div className="grid gap-3 text-base font-semibold text-[#F4F0E7]">
            <Link href="/care-options">Care options</Link>
            <Link href="/care-costs">Care costs</Link>
            <Link href="/about">Our approach</Link>
            <OpenCareChatButton className="flex min-h-11 items-center gap-2 text-left">Start a conversation</OpenCareChatButton>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-4 text-[#C3A46F]">Talk with an advisor</p>
          <OpenCareChatButton className="flex min-h-11 items-center gap-2 text-left text-lg font-bold text-[#C3A46F]">Get Spokane guidance</OpenCareChatButton>
          <p className="mt-2 text-base leading-7 text-[#F4F0E7]/75">Serving Spokane, Washington and surrounding communities.</p>
        </div>
      </div>

      <div className="container-shell flex flex-col gap-3 border-t border-white/15 py-6 text-sm text-[#F4F0E7]/70 md:flex-row md:items-center md:justify-between">
        <span>NextHaven. All rights reserved.</span>
        <span>Information is educational and not medical advice.</span>
      </div>
    </footer>
  );
}
