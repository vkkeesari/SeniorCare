import Image from 'next/image';
import { ArrowRight, HeartHandshake, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import CareCostCalculator from '@/components/CareCostCalculator';
import OpenCareChatButton from '@/components/OpenCareChatButton';

const careOptions = [
  {
    title: 'Assisted Living',
    price: '$3,500 – $10,800 / month',
    description: 'A helping hand with daily routines, while keeping choice, comfort, and independence.',
    image: 'https://images.unsplash.com/photo-1762955911431-4c44c7c3f408?auto=format&fit=crop&w=1200&q=85',
    alt: 'Caregiver assisting an older couple with an activity',
  },
  {
    title: 'Adult Family Home',
    price: '$2,900 – $14,500 / month',
    description: 'Personalized support in a smaller, home-like setting with a close-knit feel.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85',
    alt: 'Older woman smiling in a bright, welcoming home',
  },
  {
    title: 'Skilled Nursing',
    price: '$9,500 – $16,700 / month',
    description: 'Around-the-clock clinical care and rehabilitation when support needs are complex.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=85',
    alt: 'Care professional providing attentive in-home support',
  },
];

const sampleReviews = [
  {
    quote: 'We felt listened to instead of rushed. Having someone explain the options made the next step feel manageable.',
    attribution: 'A Spokane family',
  },
  {
    quote: 'The guidance helped us understand what kind of daily support would feel right for Mom and for our family.',
    attribution: 'A family in Spokane Valley',
  },
  {
    quote: 'We finally had a clear place to start and someone kind to talk it through with.',
    attribution: 'A family in the Spokane area',
  },
];

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#f1eee9] px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
        <div className="absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-[#e4d6d0]/50 blur-2xl" />
        <svg aria-hidden="true" className="pointer-events-none absolute -right-4 top-3 h-40 w-40 text-[#b97e78]/35 sm:right-8 sm:top-6 sm:h-56 sm:w-56" viewBox="0 0 200 200" fill="none">
          <path d="M100 174c-2-26 1-49 15-72 13-22 31-35 49-48M105 145c-23-2-39-13-48-34 22 1 39 11 48 34Zm20-45c-22-9-32-26-31-49 20 9 31 25 31 49Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M155 44c5 13 0 26-12 31-12-5-17-18-12-31 6-12 18-12 24 0Zm-36 23c-3 14-14 22-27 18-8-10-5-24 6-32 12-7 22 0 21 14Zm50 16c-11 10-25 10-34-1-1-13 9-23 23-24 14 1 19 13 11 25Zm-14 39c-14 3-26-4-28-18 6-12 20-16 32-9 11 9 10 21-4 27Z" fill="currentColor" />
        </svg>
        <div className="relative max-w-3xl">
          <p className="eyebrow">Thoughtful senior care guidance · Spokane, Washington</p>
          <div className="relative mt-6 max-w-2xl rounded-[2rem] rounded-bl-md border border-white/80 bg-white/90 px-6 py-7 shadow-soft sm:px-9 sm:py-9">
            <span className="absolute -bottom-3 left-8 h-6 w-6 rotate-45 border-b border-l border-white/80 bg-white/90" />
            <h1 className="relative font-serif text-4xl leading-[1.08] text-ink sm:text-6xl">HAVE A CONVERSATION TODAY</h1>
            <p className="relative mt-5 max-w-xl text-lg leading-8 text-slate-700">Care decisions can feel heavy. Talk with a local Spokane advisor to understand your options and find one clear next step at a time.</p>
            <OpenCareChatButton className="relative mt-7 flex min-h-14 items-center gap-3 rounded-full bg-ink px-6 font-bold text-white transition hover:bg-moss">Start a conversation <ArrowRight size={17} /></OpenCareChatButton>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-700">
            <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-moss" /> Free guidance for families</span>
            <span className="flex items-center gap-2"><MapPin size={18} className="text-moss" /> Greater Spokane area</span>
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute bottom-5 right-8 hidden rotate-12 text-[#b97e78]/50 lg:block">
          <Sparkles size={30} />
        </div>
      </section>

      <section className="py-14 sm:py-18">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Find a level of support</p>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">Care that feels right for your family.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Explore Spokane-area options and typical monthly planning ranges.</p>
          </div>
          <OpenCareChatButton className="flex min-h-12 items-center gap-2 font-bold text-moss">Ask which may fit <ArrowRight size={17} /></OpenCareChatButton>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
          {careOptions.map(option => (
            <article key={option.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1">
              <div className="relative h-52 sm:h-56">
                <Image src={option.image} alt={option.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-extrabold">{option.title}</h3>
                  <HeartHandshake className="mt-0.5 shrink-0 text-moss" size={22} aria-hidden="true" />
                </div>
                <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">{option.description}</p>
                <p className="mt-4 border-t border-slate-100 pt-4 text-base font-extrabold text-moss">{option.price}</p>
                <OpenCareChatButton className="mt-4 flex min-h-11 items-center gap-2 text-sm font-bold text-ink">Talk through this option <ArrowRight size={16} /></OpenCareChatButton>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[2rem] bg-[#e8efe9] px-6 py-10 sm:px-9 sm:py-12" aria-labelledby="family-reviews">
        <div aria-hidden="true" className="absolute -right-12 -top-14 h-44 w-44 rounded-full border-[22px] border-white/50" />
        <div className="relative">
          <p className="eyebrow">A little reassurance goes a long way</p>
          <h2 id="family-reviews" className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">What Spokane Families Are Saying</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Sample family reflections — shared here as illustrative examples.</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {sampleReviews.map(review => (
              <figure key={review.attribution} className="rounded-2xl bg-white/90 p-5 shadow-soft">
                <div className="flex gap-1 text-amber" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote className="mt-3 text-sm leading-6 text-slate-700">“{review.quote}”</blockquote>
                <figcaption className="mt-4 text-xs font-extrabold text-moss">{review.attribution}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="care-costs" className="scroll-mt-24 py-10 sm:py-14"><CareCostCalculator /></section>
      <section className="my-5 rounded-[2rem] bg-ink px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="grid gap-8 md:grid-cols-[1fr_.8fr] md:items-center">
          <div><p className="eyebrow text-[#c2d7c8]">A more personal kind of help</p><h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">A local person beside you, not a call center.</h2></div>
          <div><p className="text-base leading-7 text-slate-200">Our Spokane-area advisors offer thoughtful recommendations and the time to explain the why behind every option. Guidance is free for your family.</p><OpenCareChatButton className="mt-6 flex min-h-12 items-center gap-2 rounded-full bg-white px-5 font-bold text-ink">Meet your care companion <ArrowRight size={17} /></OpenCareChatButton></div>
        </div>
      </section>
    </>
  );
}
