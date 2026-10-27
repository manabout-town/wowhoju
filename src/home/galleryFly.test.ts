import { it, expect } from 'vitest';
import { flyStage, SHOTS } from './galleryFly';

it('처음엔 첫 사진, 끝엔 모든 사진을 지나옴', () => {
  expect(flyStage(0).near).toBe(0);
  expect(flyStage(0).seen).toBe(1);
  expect(flyStage(1).seen).toBe(SHOTS.length);
});
it('카메라를 지난 사진은 사라짐', () => {
  const s = flyStage(1);
  expect(s.o(0)).toBe(0);
});
