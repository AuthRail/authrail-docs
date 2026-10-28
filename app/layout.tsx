import { IBM_Plex_Sans } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AUTHRAIL } from '@/lib/constants';
import './global.css';

const readingFont = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-reading', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(AUTHRAIL.docsOrigin),
  title: { default: 'AuthRail — AI governance', template: '%s | AuthRail' },
  description: AUTHRAIL.description,
  applicationName: AUTHRAIL.name,
  icons: { icon: '/icon.png', shortcut: '/icon.png', apple: '/icon.png' },
  openGraph: {
    title: AUTHRAIL.name, description: AUTHRAIL.description,
    siteName: AUTHRAIL.name, type: 'website', locale: 'en_US', url: '/',
  },
  twitter: { card: 'summary_large_image', title: AUTHRAIL.name, description: AUTHRAIL.description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" className={readingFont.variable} suppressHydrationWarning><body><RootProvider theme={{ defaultTheme: 'light' }}>{children}</RootProvider></body></html>;
}
