import { useEffect, useState } from 'react';

// 히어로가 화면에서 거의 빠지면 true — 헤더·하단 바 표시용
export function usePastHero() {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting), { rootMargin: '-96px 0px 0px 0px', threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  return past;
}
