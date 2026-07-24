"use client";

import { useCallback, useEffect, useState } from "react";
import type { CredibilityIndicator } from "@/content/credibility";

interface Props {
  testimonials: CredibilityIndicator[];
}

const AUTO_ADVANCE_MS = 6000;

export default function TestimonialsCarousel({ testimonials }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const goTo = useCallback((i: number) => setIndex((i + count) % count), [count]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-advance, pausing on hover/focus.
  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [paused, count]);

  const active = testimonials[index];

  return (
    <div
      data-testid="testimonials-carousel"
      className="max-w-2xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
    >
      <div className="relative">
        <blockquote
          key={active.id}
          className="bg-gray-50 rounded-2xl p-8 md:p-10 border-l-4 border-brand-earth-brown text-center"
          aria-live="polite"
        >
          {active.quote && (
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed italic mb-5">
              &ldquo;{active.quote}&rdquo;
            </p>
          )}
          <footer className="text-sm">
            <span className="font-semibold text-gray-900">{active.name}</span>
            {active.description && (
              <span className="block text-gray-500 mt-1">{active.description}</span>
            )}
          </footer>
        </blockquote>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-3 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-brand-earth-brown hover:bg-brand-cream transition-colors focus:outline-none focus:ring-2 focus:ring-brand-earth-brown"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-3 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-brand-earth-brown hover:bg-brand-cream transition-colors focus:outline-none focus:ring-2 focus:ring-brand-earth-brown"
            >
              ›
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === index}
              className={`h-2.5 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-brand-earth-brown"
                  : "w-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
