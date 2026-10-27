import { describe, it, expect } from 'vitest';
import { tours, tourById, filterTours, departsOn, quote } from './tours';

describe('tours', () => {
  it('원래 사이트 38개 전부, id 중복 없음', () => {
    expect(tours.length).toBe(38);
    expect(new Set(tours.map((t) => t.id)).size).toBe(38);
  });
  it('대표 투어 가격·요일은 원문 그대로', () => {
    const p = tourById('pinnacles-sunset');
    expect([p.price, p.child]).toEqual([200, 170]);
    expect(p.weekdays).toEqual([2, 6]);
    expect(tourById('kalbarri-3d').weekdays).toEqual([3]);
  });
  it('출발 요일 아닌 날은 걸러짐', () => {
    const p = tourById('pinnacles-sunset');
    expect(departsOn(p, '2026-11-03')).toBe(true); // 화
    expect(departsOn(p, '2026-11-04')).toBe(false); // 수
  });
  it('필터·정렬', () => {
    expect(filterTours(tours, { cat: 'uluru' }).every((t) => t.cats.includes('uluru'))).toBe(true);
    const byPrice = filterTours(tours, { sort: 'price' }).filter((t) => t.price != null);
    expect(byPrice[0].price!).toBeLessThanOrEqual(byPrice[1].price!);
    expect(filterTours(tours, { q: '별빛' }).some((t) => t.id === 'pinnacles-sunset')).toBe(true);
    expect(filterTours(tours, { dur: 'd2' }).every((t) => t.nDays >= 2 && t.nDays <= 4)).toBe(true);
  });
  it('금액 계산', () => {
    const p = tourById('pinnacles-sunset');
    expect(quote(p, 2, 1)).toBe(570);
  });
  it('모든 투어에 사진', () => {
    for (const t of tours) expect(t.photo, t.title).toBeTruthy();
  });
});
