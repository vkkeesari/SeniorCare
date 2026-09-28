'use client';

import { MessageCircle } from 'lucide-react';

type Props = { children: React.ReactNode; className?: string };

export default function OpenCareChatButton({ children, className = '' }: Props) {
  return <button type="button" onClick={() => window.dispatchEvent(new Event('open-care-chat'))} className={className}>
    {children}<MessageCircle size={17} aria-hidden="true" />
  </button>;
}
