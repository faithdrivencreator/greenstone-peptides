'use client';

import { useEffect, useRef } from 'react';

interface OdometerNumberProps {
  value: string; // e.g. "15-20" or "50" or "7,000+"
  className?: string;
}

/**
 * Odometer-style rolling digit counter.
 * Adapted from robonuggets/cinematic-site-components odometer module.
 * Non-numeric chars (%, +, ,, -, letters) are rendered as static spans.
 */
export function OdometerNumber({ value, className = '' }: OdometerNumberProps) {
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!ref.current || animated.current) return;

    const el = ref.current;
    el.innerHTML = '';

    for (const char of value) {
      if (/\d/.test(char)) {
        const target = parseInt(char, 10);
        const digit = document.createElement('div');
        digit.style.cssText = 'display:inline-block;overflow:hidden;height:1.15em;vertical-align:top;';

        const strip = document.createElement('div');
        strip.style.cssText = 'display:flex;flex-direction:column;transition:transform 1.4s cubic-bezier(.16,1,.3,1);';

        for (let i = 0; i <= 9; i++) {
          const s = document.createElement('span');
          s.textContent = String(i);
          s.style.cssText = 'display:block;height:1.15em;line-height:1.15;';
          strip.appendChild(s);
        }
        digit.appendChild(strip);
        el.appendChild(digit);

        // Trigger roll after paint
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            strip.style.transform = `translateY(-${target * 1.15}em)`;
          });
        });
      } else {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.cssText = 'display:inline-block;vertical-align:top;';
        el.appendChild(span);
      }
    }

    animated.current = true;
  }, [value]);

  return (
    <div
      ref={ref}
      className={`font-black tabular-nums ${className}`}
      style={{ lineHeight: 1.15 }}
    />
  );
}
