import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, DM_Serif_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadModal from '@/components/LeadModal';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });
const display = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-display' });
export const metadata: Metadata = { title: 'Gabe\'s Senior Care Advisory | Find care with confidence', description: 'Local, trusted guidance for finding the right senior living and care options at no cost to families.', metadataBase: new URL('https://gabesllc.com') };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${jakarta.variable} ${display.variable}`}><Header /><main>{children}</main><Footer /><LeadModal /></body></html>;
}
