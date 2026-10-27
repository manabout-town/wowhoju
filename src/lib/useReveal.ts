import { useEffect } from 'react';
import { gsap, ScrollTrigger, reduced } from './gsap';

// .reveal 요소를 화면에 들어올 때 480ms expo-out으로 올림
export function useReveal() {
  useEffect(() => {
    if (reduced()) return;
    const batch = ScrollTrigger.batch('.reveal', {
      start: 'top 88%',
      once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.07 }),
    });
    return () => batch.forEach((t) => t.kill());
  }, []);
}
