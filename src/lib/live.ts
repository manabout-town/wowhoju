import { useEffect, useState } from 'react';

// 퍼스 시각(AWST, UTC+8, 서머타임 없음)과 상담 시간(월~토 09~18시) 판정 — 순수 함수
export function perthNow(now = new Date()) {
  const t = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 8 * 3600000);
  return { h: t.getHours(), m: t.getMinutes(), s: t.getSeconds(), wd: t.getDay(), date: t };
}
export const isOpen = (p: { h: number; wd: number }) => p.wd !== 0 && p.h >= 9 && p.h < 18;

export function useClock(ms = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), ms); return () => clearInterval(id); }, [ms]);
  return now;
}

// 실시간 환율(호주달러 → 원): Frankfurter(유럽중앙은행 기준환율, 무료·키 없음)
export function useRate() {
  const [r, setR] = useState<{ krw: number; date: string } | null>(null);
  useEffect(() => {
    fetch('https://api.frankfurter.dev/v1/latest?from=AUD&to=KRW').then((x) => x.json()).then((j) => setR({ krw: j.rates.KRW, date: j.date })).catch(() => setR(null));
  }, []);
  return r;
}

// 퍼스 지금 날씨: Open-Meteo(무료·키 없음)
const WMO: Record<number, string> = { 0: '맑음', 1: '대체로 맑음', 2: '구름 조금', 3: '흐림', 45: '안개', 48: '안개', 51: '이슬비', 53: '이슬비', 55: '이슬비', 61: '비', 63: '비', 65: '강한 비', 80: '소나기', 81: '소나기', 82: '강한 소나기', 95: '뇌우' };
export function useWeather() {
  const [w, setW] = useState<{ temp: number; text: string; max: number; min: number } | null>(null);
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-31.95&longitude=115.86&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Australia%2FPerth&forecast_days=1')
      .then((x) => x.json())
      .then((j) => setW({ temp: j.current.temperature_2m, text: WMO[j.current.weather_code] ?? '—', max: j.daily.temperature_2m_max[0], min: j.daily.temperature_2m_min[0] }))
      .catch(() => setW(null));
  }, []);
  return w;
}
