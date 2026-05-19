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

// Tiny pre-hydration script that reads the visual-theme preference
// from localStorage and applies it to <html data-theme="..."> before
// React renders. Without this, partnership-theme users would see a
// brief flash of Premium Navy on first paint. Strict validation —
// any unknown value is ignored so the default (Premium Navy) wins.
const THEME_INIT_SCRIPT = `
try {
  var t = localStorage.getItem('hmc-adac-visual-theme-v1');
  if (t === 'partnership' || t === 'cinematic') {
    document.documentElement.setAttribute('data-theme', t);
  }
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-navy-deep font-sans text-white antialiased">
        <PresentationShell>{children}</PresentationShell>
      </body>
    </html>
  );
}
