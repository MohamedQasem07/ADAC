import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { PresentationShell } from '@/components/layout/PresentationShell';
// Lenis smooth-scroll was disabled in Phase 2.4 for live-meeting reliability —
// wheel-event interception was breaking native scroll on long pages. Native
// scroll is now the default. Re-enable only after a careful retest.
// import { SmoothScroll } from '@/components/layout/SmoothScroll';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HMC × ADAC — Outpatient Medical Care Proposal',
  description:
    'Partnership proposal for ADAC Versicherung AG. Flat-rate outpatient care framework for the Red Sea region. Hurghada Medical Center · 19 May 2026.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-navy-deep font-sans text-white antialiased">
        <PresentationShell>{children}</PresentationShell>
      </body>
    </html>
  );
}
