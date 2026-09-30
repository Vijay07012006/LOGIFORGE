import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/globals.css';
import { Header } from '@/components/platform/Header';
import { Footer } from '@/components/platform/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  weight: ['500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://logiforge.dev'),
  title: {
    default: 'LOGIFORGE | Premium Logistics Website Templates & Design Studio',
    template: '%s | LOGIFORGE',
  },
  description:
    'Category-defining logistics website template platform. Discover, preview, and launch interactive website templates for freight forwarding, maritime shipping, telematics, and supply chain enterprises.',
  keywords: [
    'logistics website template',
    'freight forwarding website',
    'supply chain web design',
    'fleet telematics dashboard',
    'cargo tracking UI',
    'maritime shipping template',
  ],
  authors: [{ name: 'LogiForge Architecture Team' }],
  creator: 'LOGIFORGE Studio',
  publisher: 'LOGIFORGE Platforms',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://logiforge.dev',
    siteName: 'LOGIFORGE',
    title: 'LOGIFORGE | Premium Logistics Website Templates & Studio',
    description:
      'High-performance website templates, live device previews, and simulated tracking engines for modern logistics and transport organizations.',
    images: [
      {
        url: '/images/templates/cargo-nova/preview.webp',
        width: 1200,
        height: 630,
        alt: 'LOGIFORGE Logistics Website Template Platform & Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LOGIFORGE | Premium Logistics Website Templates & Studio',
    description:
      'High-performance website templates, live device previews, and simulated tracking engines for modern logistics and transport organizations.',
    images: ['/images/templates/cargo-nova/preview.webp'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d0a08',
  colorScheme: 'dark',
};

const platformJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://logiforge.dev/#website',
      url: 'https://logiforge.dev',
      name: 'LOGIFORGE',
      description:
        'Category-defining logistics website template platform and interactive design studio.',
      publisher: {
        '@id': 'https://logiforge.dev/#organization',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://logiforge.dev/#organization',
      name: 'LOGIFORGE',
      url: 'https://logiforge.dev',
      logo: {
        '@type': 'ImageObject',
        url: 'https://logiforge.dev/icon.svg',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <script type="application/ld+json">{JSON.stringify(platformJsonLd)}</script>
        <Header />
        <main id="main-content" style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
