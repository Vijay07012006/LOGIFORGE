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
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d0a08',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body>
        <Header />
        <main id="main-content" style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
