import type { Metadata } from 'next';
import { Montserrat, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadModal from '@/components/LeadModal';
import CompanionLayout from '@/components/CompanionLayout';
import LandingPageImage from './landing-page-image.jpg';

const siteUrl = 'https://www.nexthavenwa.com';
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
      description: 'Free senior living placement and local senior moving assistance for families in Spokane, Washington.',
      url: siteUrl,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        url: siteUrl,
        availableLanguage: 'English',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'NextHaven Spokane services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Senior Housing Referral',
              serviceType: 'Senior living placement and care advisory',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Senior Moving Assistance',
              serviceType: 'Local senior moving, downsizing, and transition services',
            },
          },
        ],
      },
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
        'Senior Moving Assistance',
        'Senior Downsizing',
        'Senior Transition Services',
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
  title: 'NextHaven | Senior Living & Moving Services in Spokane, WA',
  description: 'Local guidance for senior living placement, memory care, and senior moving services in Spokane, WA. NextHaven helps families compare care options and plan a thoughtful transition.',
  keywords: [
    'senior living Spokane WA',
    'assisted living advisor',
    'senior moving services Spokane',
    'memory care placement',
    'Spokane senior living',
    'assisted living Spokane WA',
    'adult family home Spokane',
    'skilled nursing Spokane',
    'senior care advisory Spokane',
    'Medicaid senior care Washington',
    'elder care referral Spokane',
  ],
  authors: [{ name: 'NextHaven' }],
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'NextHaven | Senior Living & Moving Services in Spokane, WA',
    description: 'Personalized Spokane guidance for senior living placement, memory care, and local senior moving, downsizing, and transition services.',
    url: siteUrl,
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
    title: 'NextHaven | Senior Living & Moving Services in Spokane, WA',
    description: 'Personalized Spokane guidance for senior living placement, memory care, and local senior moving, downsizing, and transition services.',
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
        <Analytics />
      </body>
    </html>
  );
}
