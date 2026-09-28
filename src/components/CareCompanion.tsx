'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, Check, MessageCircleHeart, Minimize2, X } from 'lucide-react';
import { upsertLeadData } from '@/lib/saveLead';

type Sender = 'user' | 'bot';
type ChatMessage = { sender: Sender; text: string };
type LeadFields = {
  moveFor?: string;
  medicalNeeds?: string;
  adls?: string;
  timeline?: string;
  budget?: string;
  name?: string;
  phone?: string;
  zip?: string;
};
type ChatResponse = { replyText: string; extractedData: LeadFields; isComplete: boolean };

const welcome: ChatMessage = { sender: 'bot', text: "I'm glad you're here. Who are you looking for care for?" };
const replyOptions: Array<[keyof LeadFields, string[]]> = [
  ['moveFor', ['For myself', 'For my parent', 'For my spouse', 'For a relative']],
  ['medicalNeeds', ['Memory care needed', 'Recent falls', '24-hour support', 'Help after a hospital stay']],
  ['adls', ['Help with bathing', 'Medication reminders', 'Mobility support', 'A little help each day']],
  ['timeline', ['Immediate move-in', 'Within 1-3 months', 'Just planning ahead']],
  ['budget', ['$3,000-$5,000', '$5,000-$8,000', '$8,000+']],
];
const requiredFields: Array<keyof LeadFields> = ['moveFor', 'medicalNeeds', 'adls', 'timeline', 'budget', 'name', 'phone', 'zip'];

function getInitialSession() {
  try {
    let id = sessionStorage.getItem('care-companion-session');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('care-companion-session', id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export default function CareCompanion() {
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [fields, setFields] = useState<LeadFields>({});
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState('');
  const [saveWarning, setSaveWarning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = getInitialSession();
    let storedMessages: ChatMessage[] | null = null;
    try {
      const stored = sessionStorage.getItem(`care-companion-messages:${id}`);
      if (stored) storedMessages = JSON.parse(stored) as ChatMessage[];
    } catch {
      storedMessages = null;
    }
    const openChat = () => {
      setExpanded(true);
      window.setTimeout(() => document.getElementById('care-chat-message')?.focus(), 50);
    };
    window.addEventListener('open-care-chat', openChat);
    const frame = window.requestAnimationFrame(() => {
      setSessionId(id);
      if (storedMessages) setMessages(storedMessages);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('open-care-chat', openChat);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    if (!sessionId) return;
    try {
      sessionStorage.setItem(`care-companion-messages:${sessionId}`, JSON.stringify(messages.slice(-40)));
    } catch {
      // The active conversation remains usable if browser storage is unavailable.
    }
  }, [messages, sessionId]);

  const suggestions = useMemo(() => {
    const next = replyOptions.find(([field]) => !fields[field]);
    if (next) return next[1];
    if (!fields.name) return [];
    if (!fields.phone) return [];
    if (!fields.zip) return [];
    return [];
  }, [fields]);

  const sendMessage = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText || busy || !sessionId) return;
    const userMessage: ChatMessage = { sender: 'user', text: cleanText };
    const history = [...messages, userMessage];
    setMessages(history);
    setDraft('');
    setBusy(true);
    setError('');
    try {
      try {
        const saved = await upsertLeadData(sessionId, fields, userMessage);
        if (!saved.saved) setSaveWarning(true);
      } catch {
        setSaveWarning(true);
      }
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, messageHistory: history.slice(-40, -1), userMessage: cleanText }),
      });
      const result = await response.json() as ChatResponse | { error?: string };
      if (!response.ok || !('replyText' in result)) throw new Error(('error' in result && result.error) || 'Please try sending that again.');
      const merged = { ...fields, ...result.extractedData };
      setFields(merged);
      const botMessage: ChatMessage = { sender: 'bot', text: result.replyText };
      setMessages([...history, botMessage]);
      try {
        const saved = await upsertLeadData(sessionId, merged, botMessage);
        if (!saved.saved) setSaveWarning(true);
      } catch {
        setSaveWarning(true);
      }
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Please try again in a moment.');
    } finally {
      setBusy(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(draft);
  };
  const completeCount = requiredFields.filter(field => Boolean(fields[field])).length;
  const complete = completeCount === requiredFields.length;

  const panel = (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
      <header className="flex items-center gap-3 border-b border-slate-100 bg-[#f7faf7] px-5 py-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-moss text-white"><MessageCircleHeart size={21} /></span>
        <div className="min-w-0 flex-1"><h2 className="text-base font-extrabold">Care Companion</h2><p className="mt-0.5 text-sm text-slate-600">A friendly local care guide</p></div>
        <button className="grid h-11 w-11 place-items-center rounded-full text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setExpanded(false)} aria-label="Minimize care companion"><Minimize2 size={20} /></button>
      </header>
      <div className="border-b border-slate-100 px-5 py-3" aria-label="Conversation progress">
        <div className="mb-2 flex items-center justify-between text-base"><span className="font-bold">Your care picture</span><span className="text-slate-600">{completeCount} of 8 details</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-moss transition-all" style={{ width: `${(completeCount / 8) * 100}%` }} /></div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5" aria-live="polite" aria-relevant="additions text">
        {messages.map((message, index) => <div key={`${index}-${message.sender}`} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-lg leading-7 ${message.sender === 'user' ? 'rounded-br-md bg-ink text-white' : 'rounded-bl-md bg-sage text-ink'}`}>{message.text}</p></div>)}
        {busy && <div className="rounded-2xl rounded-bl-md bg-sage px-4 py-3 text-base text-slate-600" role="status">Your care companion is thinking…</div>}
        {complete && <div className="flex items-center gap-2 rounded-xl bg-[#eef5ef] p-3 text-base font-semibold text-moss"><Check size={18} /> You&apos;ve shared what our care team needs to follow up thoughtfully.</div>}
        <div ref={bottomRef} />
      </div>
      {suggestions.length > 0 && !busy && <div className="flex gap-2 overflow-x-auto px-4 pb-3 sm:flex-wrap sm:overflow-visible sm:px-5" aria-label="Suggested replies">{suggestions.map(option => <button key={option} onClick={() => void sendMessage(option)} className="min-h-12 shrink-0 rounded-full border border-moss/40 bg-white px-4 text-base font-bold text-moss transition hover:bg-sage focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss">{option}</button>)}</div>}
      {saveWarning && <p className="px-5 pb-2 text-xs text-amber-800">Your message went through, but saving details needs Firebase configuration.</p>}
      {error && <p role="alert" className="px-5 pb-2 text-sm font-semibold text-red-700">{error}</p>}
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-slate-100 p-3 sm:p-4">
        <label className="sr-only" htmlFor="care-chat-message">Write a message</label>
        <input id="care-chat-message" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Type or use a suggestion…" className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-[#fcfcfb] px-4 text-lg outline-none placeholder:text-slate-500 focus:border-moss focus:ring-2 focus:ring-moss/20" maxLength={2000} />
        <button type="submit" disabled={!draft.trim() || busy || !sessionId} aria-label="Send message" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-white transition hover:bg-moss disabled:cursor-not-allowed disabled:opacity-45"><ArrowUp size={21} /></button>
      </form>
      <p className="px-4 pb-3 text-center text-xs text-slate-500">No cost to families. Your details are shared with our care team.</p>
    </div>
  );

  return <>
    <div className="hidden h-[calc(100vh-110px)] min-h-[620px] max-h-[900px] lg:sticky lg:top-[92px] lg:block">{panel}</div>
    <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
      {expanded ? <div className="h-[min(82dvh,760px)] px-2 pb-[max(env(safe-area-inset-bottom),8px)]">{panel}</div> : <button onClick={() => setExpanded(true)} className="mx-3 mb-[max(env(safe-area-inset-bottom),12px)] flex min-h-14 w-[calc(100%-24px)] items-center justify-between rounded-2xl bg-ink px-5 text-left text-white shadow-2xl"><span className="flex items-center gap-3"><MessageCircleHeart size={22} /><span><span className="block text-base font-extrabold">Open Care Companion</span><span className="block text-sm text-slate-200">A good first step, at your pace</span></span></span><X className="rotate-45" size={22} /></button>}
    </div>
  </>;
}
