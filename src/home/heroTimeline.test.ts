import { describe, it, expect } from 'vitest';
import { heroStage, STAR_COUNT } from './heroTimeline';

describe('heroStage — 하늘이 물드는 순서', () => {
  it('처음엔 한낮만, 질문이 보임', () => {
    const s = heroStage(0);
    expect(s.day).toBe(1);
    expect(s.dusk + s.night).toBe(0);
    expect(s.title).toBe(1);
    expect(s.stars).toBe(0);
  });
  it('중간엔 노을이 주인공', () => {
    const s = heroStage(0.5);
    expect(s.dusk).toBe(1);
    expect(s.title).toBe(0);
  });
  it('끝엔 별밤과 별 전부, 피날레 문장', () => {
    const s = heroStage(1);
    expect(s.night).toBe(1);
    expect(s.stars).toBe(STAR_COUNT);
    expect(s.finaleLine).toBe(1);
  });
  it('세 하늘의 합은 늘 1', () => {
    for (let p = 0; p <= 1; p += 0.05) {
      const s = heroStage(p);
      expect(s.day + s.dusk + s.night).toBeCloseTo(1, 5);
    }
  });
});
