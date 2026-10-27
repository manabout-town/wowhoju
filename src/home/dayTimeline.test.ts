import { it, expect } from 'vitest';
import { dayStage, dayStops } from './dayTimeline';

it('처음은 무어리버, 끝은 별빛', () => {
  expect(dayStage(0).active).toBe(0);
  expect(dayStage(1).active).toBe(dayStops.length - 1);
  expect(dayStage(0).photo(0)).toBe(1);
  expect(dayStage(1).photo(4)).toBe(1);
});
it('해는 가운데서 가장 높고 별빛에선 진다', () => {
  expect(dayStage(0.41).sunY).toBeLessThan(dayStage(0).sunY);
  expect(dayStage(1).sunGlow).toBe(0);
});
