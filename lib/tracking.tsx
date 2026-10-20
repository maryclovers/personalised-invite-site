'use client';
import { createContext, useContext, useRef, useEffect, useCallback } from 'react';

const SlugContext = createContext<string>('');

export function TrackingProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  return <SlugContext.Provider value={slug}>{children}</SlugContext.Provider>;
}

export function useTrack() {
  const slug = useContext(SlugContext);
  return useCallback(
    (action: string, metadata?: Record<string, unknown>) => {
      if (!slug) return;
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, action, metadata }),
      }).catch(() => {});
    },
    [slug]
  );
}

export function useSlug() {
  return useContext(SlugContext);
}

// Fires once when the element scrolls into view (30% visible)
export function useTrackSection(sectionName: string, action = 'section_viewed') {
  const track = useTrack();
  const ref = useRef<HTMLElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          track(action, { section: sectionName });
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [track, sectionName, action]);

  return ref;
}
