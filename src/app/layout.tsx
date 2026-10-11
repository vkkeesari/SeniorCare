import type { Metadata } from 'next';
import { Montserrat, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadModal from '@/components/LeadModal';
import CompanionLayout from '@/components/CompanionLayout';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const metadata: Metadata = {
  title: 'NextHaven | Senior Living Referral Services',
  description: 'Personalized guidance to help you find the right assisted living options for the people who matter most.',
  metadataBase: new URL(siteUrl),
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="bg-[#F4F0E7] text-[#3A3530] antialiased">
        <Header />
        <main>
          <CompanionLayout>{children}</CompanionLayout>
        </main>
        <Footer />
        <LeadModal />
      </body>
    </html>
  );
}
