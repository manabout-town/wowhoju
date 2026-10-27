import { it, expect } from 'vitest';
import { parseHash } from './route';

it('섹션 해시·빈 해시는 홈', () => {
  expect(parseHash('').page).toBe('home');
  expect(parseHash('#tours').page).toBe('home');
});
it('페이지·조각·쿼리', () => {
  const r = parseHash('#/tour/pinnacles-sunset?d=2026-11-03');
  expect(r.page).toBe('tour');
  expect(r.parts).toEqual(['pinnacles-sunset']);
  expect(r.query.get('d')).toBe('2026-11-03');
  expect(parseHash('#/tours/uluru?sort=price').parts).toEqual(['uluru']);
});
