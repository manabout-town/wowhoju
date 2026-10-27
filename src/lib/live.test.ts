import { it, expect } from 'vitest';
import { perthNow, isOpen } from './live';

it('퍼스는 UTC+8', () => {
  const p = perthNow(new Date('2026-11-03T01:30:00Z'));
  expect([p.h, p.m]).toEqual([9, 30]);
  expect(p.wd).toBe(2); // 화
});
it('상담 시간: 월~토 9~18시, 일요일 휴무', () => {
  expect(isOpen({ h: 9, wd: 1 })).toBe(true);
  expect(isOpen({ h: 18, wd: 1 })).toBe(false);
  expect(isOpen({ h: 12, wd: 0 })).toBe(false);
});
