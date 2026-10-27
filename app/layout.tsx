import type {Metadata, Viewport} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AuraTrade - Advanced Mobile Trading Platform',
  description: 'Experience professional mobile trading with real-time analytics, instant execution, portfolio tracking, and comprehensive market intelligence.',
  openGraph: {
    title: 'AuraTrade - Advanced Mobile Trading Platform',
    description: 'Experience professional mobile trading with real-time analytics, instant execution, portfolio tracking, and comprehensive market intelligence.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AuraTrade - Advanced Mobile Trading Platform',
    description: 'Experience professional mobile trading with real-time analytics, instant execution, portfolio tracking, and comprehensive market intelligence.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#fafafa',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 antialiased selection:bg-amber-300 selection:text-neutral-900 min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

