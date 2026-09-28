import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadModal from '@/components/LeadModal';
import CompanionLayout from '@/components/CompanionLayout';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
export const metadata: Metadata = { title: 'Senior Care Advisory | Find care with confidence', description: 'Local, trusted guidance for finding the right senior living and care options at no cost to families.', metadataBase: new URL(siteUrl) };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Header /><main><CompanionLayout>{children}</CompanionLayout></main><Footer /><LeadModal /></body></html>;
}
