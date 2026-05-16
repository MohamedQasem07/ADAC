'use client';

import { useEffect, useRef } from 'react';

interface ParticleFieldProps {
  /** Roughly the count of particles; auto-scaled by viewport area. */
  density?: number;
  /** Class name applied to the absolute-positioned canvas. */
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  hue: 'white' | 'gold';
}

/**
 * Slow-drifting white + gold particles for dark sections. Canvas-based
 * for performance — runs at ~60 fps with 30–50 particles. Particles
 * regenerate at the opposite edge when they leave the viewport so the
 * field looks endless.
 *
 * Respects `prefers-reduced-motion`.
 */
export function ParticleField({ density = 40, className = '' }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    const init = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = width * height;
      const target = Math.min(
        Math.max(Math.floor(area / 22000), 12),
        Math.floor(density * 1.5)
      );

      particles = Array.from({ length: target }, () => createParticle(width, height));
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges.
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.fillStyle =
          p.hue === 'gold'
            ? `rgba(201, 169, 97, ${p.alpha})`
            : `rgba(255, 255, 255, ${p.alpha * 0.85})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      rafRef.current = window.requestAnimationFrame(step);
    };

    init();
    if (!reduced) {
      rafRef.current = window.requestAnimationFrame(step);
    } else {
      // Render once, no animation loop.
      step();
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    const onResize = () => init();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

function createParticle(width: number, height: number): Particle {
  const isGold = Math.random() < 0.35;
  const speed = 0.04 + Math.random() * 0.12; // very slow drift
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    r: 0.8 + Math.random() * 1.8,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    alpha: 0.25 + Math.random() * 0.5,
    hue: isGold ? 'gold' : 'white',
  };
}
