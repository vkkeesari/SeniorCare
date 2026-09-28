import OpenCareChatButton from '@/components/OpenCareChatButton';

export default function StartConversation() {
  return <section className="rounded-[2rem] bg-sage px-6 py-14 sm:px-10 sm:py-20">
    <p className="eyebrow">A good first step</p>
    <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-tight sm:text-6xl">Tell us what your family needs, in your own words.</h1>
    <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">No quiz and no pressure. The Care Companion will listen, ask one question at a time, and help our advisors understand what would be useful.</p>
    <OpenCareChatButton className="mt-8 flex min-h-14 items-center gap-3 rounded-full bg-ink px-6 font-bold text-white">Start a conversation</OpenCareChatButton>
  </section>;
}
