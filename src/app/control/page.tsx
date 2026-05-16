'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ControlPanel } from '@/components/control/ControlPanel';

/**
 * Standalone Presenter Control Mode route.
 *
 * URL: /control · Not linked from any audience-facing UI.
 * Same content as the Ctrl/Cmd+Shift+E overlay, but renders full-page
 * for cases where the overlay UX is too cramped (long editing sessions).
 */
export default function ControlPage() {
  return (
    <div className="min-h-screen bg-navy-deep">
      <div className="border-b border-white/10 bg-navy-deep/80 px-4 py-3 backdrop-blur-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-ice/70 transition-colors hover:text-gold"
        >
          <ArrowLeft size={14} />
          Back to presentation
        </Link>
      </div>
      <div className="mx-auto max-w-6xl">
        <ControlPanel />
      </div>
    </div>
  );
}
