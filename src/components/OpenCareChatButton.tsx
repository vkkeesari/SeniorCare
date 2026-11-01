'use client';

import { MessageCircle } from 'lucide-react';

type Props = { children: React.ReactNode; className?: string; initialMessage?: string };

export default function OpenCareChatButton({ children, className = '', initialMessage }: Props) {
  return <button
    type="button"
    onClick={() => window.dispatchEvent(new CustomEvent('open-care-chat', { detail: { initialMessage } }))}
    className={className}
  >
    {children}<MessageCircle size={17} aria-hidden="true" />
  </button>;
}
