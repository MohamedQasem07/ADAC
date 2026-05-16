export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
      <span className="font-sans text-xs uppercase tracking-[0.4em] text-gold">
        Partnership Proposal
      </span>
      <h1 className="mt-6 font-display text-6xl font-semibold leading-tight md:text-8xl">
        HMC × ADAC
      </h1>
      <div className="gold-rule mt-8 w-32" />
      <p className="mt-8 max-w-xl text-base text-ink-soft md:text-lg">
        Scaffold ready. Phase 1 verified. Cinematic presentation coming next.
      </p>
      <p className="mt-2 text-xs uppercase tracking-widest text-ink-soft/70">
        19 May 2026 · Hurghada, Egypt
      </p>
    </main>
  );
}
