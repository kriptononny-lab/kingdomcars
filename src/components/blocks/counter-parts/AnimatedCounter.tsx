'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  target: number;
  suffix?: string;
  label: string;
  durationMs?: number;
}

const DEFAULT_DURATION = 1800;

export function AnimatedCounter({
  target,
  suffix = '',
  label,
  durationMs = DEFAULT_DURATION,
}: Props) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Observe entry into viewport, start counting once.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      // Reduced-motion: skip the animation, show the final number immediately.
      // The lint rule warns about cascading renders, but here we want exactly
      // one re-render so the user sees the target value, not zero.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional, see comment above.
      setCount(target);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setStarted(true);
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  // Animate from 0 → target with ease-out cubic.
  // setState calls live inside an rAF callback, not directly in the effect
  // body — the lint rule fires on the closing setCount(target) of the
  // animation, which is the legitimate way to snap to the final value.
  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - t) ** 3;
      setCount(Math.floor(target * eased));
      if (t < 1) raf = requestAnimationFrame(step);
      else setCount(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, target, durationMs]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-gold mb-2 text-[clamp(2.5rem,5vw,3.6rem)] leading-none font-bold [text-shadow:0_0_30px_rgba(232,168,37,0.3)]">
        {count}
        {suffix}
      </div>
      <div className="text-text-muted text-sm tracking-[0.1em] uppercase">{label}</div>
    </div>
  );
}
