import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadModal from '@/components/LeadModal';

export const metadata: Metadata = { title: 'Gabe\'s Senior Care Advisory | Find care with confidence', description: 'Local, trusted guidance for finding the right senior living and care options at no cost to families.', metadataBase: new URL('https://gabesllc.com') };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Header /><main>{children}</main><Footer /><LeadModal /></body></html>;
}
