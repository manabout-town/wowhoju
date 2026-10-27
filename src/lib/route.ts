import { useEffect, useState } from 'react';

// 해시 라우팅: '#/…' = 페이지, '#섹션id' 또는 빈 해시 = 홈(섹션 이동)
export type Route = { page: string; parts: string[]; query: URLSearchParams };

export function parseHash(h: string): Route {
  if (!h.startsWith('#/')) return { page: 'home', parts: [], query: new URLSearchParams() };
  const [path, qs = ''] = h.slice(2).split('?');
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
  return { page: parts[0] ?? 'home', parts: parts.slice(1), query: new URLSearchParams(qs) };
}

export function useRoute() {
  const [r, setR] = useState(() => parseHash(location.hash));
  useEffect(() => {
    const on = () => {
      const next = parseHash(location.hash);
      setR((prev) => {
        if (next.page !== prev.page || next.parts.join('/') !== prev.parts.join('/')) scrollTo(0, 0);
        return next;
      });
    };
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  return r;
}

export const go = (path: string) => { location.hash = path; };
