import { it, expect } from 'vitest';
import { copy, keep } from './copy';

it('브랜드 문장은 출처가 있다', () => {
  for (const [k, c] of Object.entries(copy) as [string, { source: string }][]) expect(c.source, k).toBeTruthy();
});
it('구절 묶음: 한 끼는 끊기지 않고, 가운뎃점은 앞뒤에 붙음', () => {
  expect(keep('바다 앞 한 끼')).toBe('바다 앞 한 끼');
  expect(keep('고단백·저칼로리')).toBe('고단백⁠·⁠저칼로리');
});
