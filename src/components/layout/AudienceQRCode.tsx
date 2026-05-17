'use client';

import Image from 'next/image';
import { useAudienceMode } from '@/context/AudienceModeContext';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const QR_SRC = `${BASE_PATH}/qr/mobile.svg`;

/**
 * Phase 2.4W — Mobile audience QR code block.
 *
 * Static SVG (generated once via `npx qrcode`; no runtime dependency).
 * Encodes `https://mohamedqasem07.github.io/ADAC/m` — the canonical
 * mobile audience entry URL.
 *
 * Hidden in audience mode (the audience phones are already on the
 * mobile view — pointless to show them another QR).
 *
 * Placement: rendered as a block inside the Presentation Overview slide.
 * Visually paired with a short caption so attendees know what to do.
 */
export function AudienceQRCode() {
  const { isAudience } = useAudienceMode();
  if (isAudience) return null;

  return (
    <section
      aria-label="Scan to follow on mobile"
      className="mx-auto mt-12 max-w-4xl px-8"
    >
      <div
        className="relative flex flex-col items-center gap-5 overflow-hidden rounded-sm border px-6 py-7 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-6 sm:px-7"
        style={{
          borderColor:
            'color-mix(in srgb, var(--theme-accent) 40%, transparent)',
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--theme-accent) 8%, transparent), transparent 70%)',
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t"
          style={{
            borderColor:
              'color-mix(in srgb, var(--theme-accent) 60%, transparent)',
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r"
          style={{
            borderColor:
              'color-mix(in srgb, var(--theme-accent) 60%, transparent)',
          }}
        />

        {/* QR tile */}
        <div
          className="shrink-0 rounded-sm border bg-white p-3"
          style={{
            borderColor:
              'color-mix(in srgb, var(--theme-accent) 55%, transparent)',
            boxShadow:
              '0 0 28px color-mix(in srgb, var(--theme-accent) 22%, transparent)',
          }}
        >
          <Image
            src={QR_SRC}
            alt="QR code linking to the HMC × ADAC mobile-friendly meeting view"
            width={128}
            height={128}
            unoptimized
            className="block h-32 w-32"
          />
        </div>

        {/* Caption */}
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ color: 'var(--theme-accent)' }}
          >
            Follow along on your phone
          </p>
          <p className="mt-1.5 font-display text-xl font-semibold leading-snug text-white sm:text-2xl">
            Scan to follow the mobile-friendly meeting view
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ice/85">
            Open the camera on your iPhone or Android, point at the code,
            and tap the link — the same proposal opens in a phone-shaped
            view you can browse during the meeting.
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ice/55">
            iPhone Safari · Android Chrome
          </p>
        </div>
      </div>
    </section>
  );
}
