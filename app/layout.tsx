import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { description, siteURL } from '@/lib/site';
import './global.css';
export const metadata: Metadata = {
  metadataBase: siteURL,
  title: { default: 'AuthRail — Govern AI actions. Keep the proof.', template: '%s | AuthRail' },
  description,
  applicationName: 'AuthRail',
  openGraph: { title: 'AuthRail', description, siteName: 'AuthRail', type: 'website', locale: 'en_US' },
  twitter: { card: 'summary_large_image', title: 'AuthRail', description },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" suppressHydrationWarning><body><RootProvider theme={{ defaultTheme: 'light' }}>{children}</RootProvider></body></html>;
}
