import { describe, it, expect } from 'vitest';
import { facts, stores } from './facts';

describe('facts', () => {
  it('모든 수치·주장에 출처·기준일', () => {
    for (const [k, f] of Object.entries(facts) as [string, { source: string; asOf: string }][]) {
      expect(f.source, k).toBeTruthy();
      expect(f.asOf, k).toMatch(/^\d{4}(-\d{2})?(-\d{2})?$/);
    }
  });
  it('매장은 모두 사진·지도 ID·영업시간 보유', () => {
    for (const s of stores) {
      expect(s.photo, s.name).toBeTruthy();
      expect(s.naverId, s.name).toMatch(/^\d+$/);
      expect(s.close, s.name).toBeGreaterThan(s.open);
    }
  });
});
