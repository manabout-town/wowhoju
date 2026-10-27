import { it, expect } from 'vitest';
import { wordFill } from './scrub';

it('단어는 앞에서부터 차례로 채워지고 끝에서 전부 1', () => {
  expect(wordFill(0, 0, 10)).toBe(0);
  expect(wordFill(0.3, 0, 10)).toBeGreaterThan(wordFill(0.3, 5, 10));
  for (let i = 0; i < 10; i++) expect(wordFill(1, i, 10)).toBe(1);
});
