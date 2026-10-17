import type { Metadata } from 'next';
import { Montserrat, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadModal from '@/components/LeadModal';
import CompanionLayout from '@/components/CompanionLayout';
import LandingPageImage from './landing-page-image.jpg';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://senior-care-peach.vercel.app');
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

const serviceAreas = [
  '99201', '99224', '99203', '99223', '99208',
  '99205', '99206', '99212', '99216', '99037',
].map(postalCode => ({ '@type': 'Place', name: `Spokane-area ZIP code ${postalCode}` }));

const localBusinessStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': `${siteUrl}/#business`,
      name: 'NextHaven Senior Living Referral Services',
      description: 'Free senior living referral and care advisory serving Spokane, Washington.',
      url: siteUrl,
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Greater Spokane, Washington' },
        ...serviceAreas,
      ],
      priceRange: 'Free referral service; care options typically $2,900-$16,700 per month',
    },
    {
      '@type': 'Service',
      '@id': `${siteUrl}/#senior-care-referral`,
      name: 'Senior Living Referral and Care Advisory',
      serviceType: [
        'Assisted Living Referral',
        'Adult Family Home Advisory',
        'Skilled Nursing Care Placement',
        'Medicaid Senior Care Guidance',
      ],
      provider: { '@id': `${siteUrl}/#business` },
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Greater Spokane, Washington' },
        ...serviceAreas,
      ],
    },
  ],
};

export const metadata: Metadata = {
  title: 'NextHaven | Senior Living & Assisted Living Referral in Spokane, WA',
  description: 'Free, local senior living referral services in Spokane, WA. Expert guidance for Assisted Living ($3.5k–$10.8k/mo), Adult Family Homes, and Skilled Nursing across zip codes 99201, 99224, 99203, 99208, and greater Spokane.',
  keywords: [
    'Spokane senior living',
    'assisted living Spokane WA',
    'adult family home Spokane',
    'skilled nursing Spokane',
    'senior care advisory Spokane',
    'Medicaid senior care Washington',
    'elder care referral Spokane',
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'NextHaven Senior Living Referral Services | Spokane, WA',
    description: 'Guiding Spokane families to brighter tomorrows. Personalized, free senior care advisory and local care placement.',
    url: '/',
    siteName: 'NextHaven Senior Living Referral Services',
    locale: 'en_US',
    type: 'website',
    images: [{
      url: LandingPageImage.src,
      width: LandingPageImage.width,
      height: LandingPageImage.height,
      alt: 'NextHaven senior care guidance for Spokane families',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextHaven Senior Living Referral Services | Spokane, WA',
    description: 'Guiding Spokane families to brighter tomorrows. Personalized, free senior care advisory and local care placement.',
    images: [LandingPageImage.src],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="bg-[#F4F0E7] text-[#3A3530] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessStructuredData).replace(/</g, '\\u003c'),
          }}
        />
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
