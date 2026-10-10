import Image from 'next/image';
import { ArrowRight, HeartHandshake, MapPin, ShieldCheck } from 'lucide-react';
import CareCostCalculator from '@/components/CareCostCalculator';
import OpenCareChatButton from '@/components/OpenCareChatButton';

const careOptions = [
  {
    title: 'Assisted Living',
    price: '$3,500 – $10,800 / month',
    description: 'Warm support with daily routines, social connection, and the freedom to keep living well.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85',
    alt: 'Warm assisted living community with seniors enjoying conversation',
  },
  {
    title: 'Adult Family Home',
    price: '$2,900 – $14,500 / month',
    description: 'Personalized support in a smaller, home-like setting with a close-knit, residential feel.',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=85',
    alt: 'Cozy residential house with a front porch and warm neighborhood feel',
  },
  {
    title: 'Skilled Nursing',
    price: '$9,500 – $16,700 / month',
    description: 'Around-the-clock clinical care and recovery support when needs are more complex.',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=85',
    alt: 'Skilled nursing care professional supporting a patient in a clinical home-like setting',
  },
];

const sampleReviews = [
  {
    quote: 'NextHaven helped us slow down, understand our options, and feel much more confident about the next step.',
    attribution: 'A Spokane family',
  },
  {
    quote: 'The guidance felt personal and local. It made comparing care communities feel less overwhelming for our family.',
    attribution: 'A family in Spokane Valley',
  },
  {
    quote: 'We finally had a clear starting point and a calm place to talk through what would work best for Mom.',
    attribution: 'A family in the Spokane area',
  },
];

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#f1eee9] px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
        <div className="absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-[#dfe4d9]/80 blur-2xl" />
        <svg aria-hidden="true" className="pointer-events-none absolute -right-4 top-3 h-40 w-40 text-[#b8a37d]/35 sm:right-8 sm:top-6 sm:h-56 sm:w-56" viewBox="0 0 200 200" fill="none">
          <path d="M100 174c-2-26 1-49 15-72 13-22 31-35 49-48M105 145c-23-2-39-13-48-34 22 1 39 11 48 34Zm20-45c-22-9-32-26-31-49 20 9 31 25 31 49Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M155 44c5 13 0 26-12 31-12-5-17-18-12-31 6-12 18-12 24 0Zm-36 23c-3 14-14 22-27 18-8-10-5-24 6-32 12-7 22 0 21 14Zm50 16c-11 10-25 10-34-1-1-13 9-23 23-24 14 1 19 13 11 25Zm-14 39c-14 3-26-4-28-18 6-12 20-16 32-9 11 9 10 21-4 27Z" fill="currentColor" />
        </svg>
        <div className="relative max-w-3xl">
          <p className="eyebrow">NextHaven • Senior Living Referral Services</p>
          <div className="relative mt-6 max-w-2xl rounded-[2rem] rounded-bl-md border border-[#e4ddd4] bg-white/90 px-6 py-7 shadow-soft sm:px-9 sm:py-9">
            <span className="absolute -bottom-3 left-8 h-6 w-6 rotate-45 border-b border-l border-[#e4ddd4] bg-white/90" />
            <h1 className="relative font-serif text-4xl leading-[1.08] text-[#304E43] sm:text-6xl">HAVE A CONVERSATION TODAY</h1>
            <p className="relative mt-5 max-w-xl text-lg leading-8 text-[#3A3530]/80">Guiding Families to Brighter Tomorrows.</p>
            <p className="relative mt-4 max-w-xl text-base leading-7 text-[#3A3530]/75">Personalized guidance to help you find the right assisted living options for the people who matter most.</p>
            <OpenCareChatButton className="relative mt-7 flex min-h-14 items-center gap-3 rounded-full bg-[#304E43] px-6 font-bold text-white transition hover:bg-[#263f38]">Start a conversation <ArrowRight size={17} /></OpenCareChatButton>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#3A3530]">
            <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-[#304E43]" /> PERSONAL | TRUSTED | LOCAL</span>
            <span className="flex items-center gap-2"><MapPin size={18} className="text-[#304E43]" /> Greater Spokane area</span>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-18">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Find a level of support</p>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight text-[#304E43] sm:text-5xl">Care that feels right for your family.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#3A3530]/75">Explore Spokane-area options and typical monthly planning ranges with guidance built around your family&apos;s priorities.</p>
          </div>
          <OpenCareChatButton className="flex min-h-12 items-center gap-2 font-bold text-[#304E43]">Ask which may fit <ArrowRight size={17} /></OpenCareChatButton>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
          {careOptions.map(option => (
            <article key={option.title} className="overflow-hidden rounded-[1.6rem] border border-[#d9d2c8] bg-[#F4F0E7] shadow-soft transition hover:-translate-y-1">
              <div className="relative h-52 sm:h-56">
                <Image src={option.image} alt={option.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-2xl text-[#304E43]">{option.title}</h3>
                  <HeartHandshake className="mt-0.5 shrink-0 text-[#C3A46F]" size={22} aria-hidden="true" />
                </div>
                <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-[#3A3530]/75">{option.description}</p>
                <p className="mt-4 border-t border-[#d9d2c8] pt-4 text-base font-extrabold text-[#304E43]">{option.price}</p>
                <OpenCareChatButton className="mt-4 flex min-h-11 items-center gap-2 text-sm font-bold text-[#304E43]">Talk through this option <ArrowRight size={16} /></OpenCareChatButton>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[2rem] bg-[#e8efe9] px-6 py-10 sm:px-9 sm:py-12" aria-labelledby="family-reviews">
        <div aria-hidden="true" className="absolute -right-12 -top-14 h-44 w-44 rounded-full border-[22px] border-white/50" />
        <div className="relative">
          <p className="eyebrow">A little reassurance goes a long way</p>
          <h2 id="family-reviews" className="mt-3 font-serif text-3xl leading-tight text-[#304E43] sm:text-4xl">What Spokane Families Are Saying</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#3A3530]/75">Sample family reflections — shared here as illustrative examples.</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {sampleReviews.map(review => (
              <figure key={review.attribution} className="rounded-2xl bg-white/90 p-5 shadow-soft">
                <div className="flex gap-1 text-[#C3A46F]" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote className="mt-3 text-sm leading-6 text-[#3A3530]/80">“{review.quote}”</blockquote>
                <figcaption className="mt-4 text-xs font-extrabold uppercase tracking-[0.12em] text-[#304E43]">{review.attribution}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="care-costs" className="scroll-mt-24 py-10 sm:py-14"><CareCostCalculator /></section>
      <section className="my-5 rounded-[2rem] bg-[#304E43] px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="grid gap-8 md:grid-cols-[1fr_.8fr] md:items-center">
          <div>
            <p className="eyebrow text-[#dfe7df]">Ready when you are</p>
            <h2 className="mt-3 font-serif text-4xl text-white">Let&apos;s make the next step lighter.</h2>
          </div>
          <div>
            <p className="text-base leading-7 text-white/80">A thoughtful advisor can help you compare care communities and local resources without pressure, while keeping your family&apos;s priorities front and center.</p>
            <OpenCareChatButton className="mt-6 flex min-h-12 items-center gap-2 rounded-full bg-[#C3A46F] px-5 font-bold text-[#304E43]">Start a conversation <ArrowRight size={17} /></OpenCareChatButton>
          </div>
        </div>
      </section>
    </>
  );
}
