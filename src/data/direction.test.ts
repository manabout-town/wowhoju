import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { direction, AXES, type Pick } from './direction';

const tokens = readFileSync(new URL('../styles/tokens.css', import.meta.url), 'utf8');
const cssVar = (name: string) => tokens.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim().toLowerCase();
const filled = (p: Pick, k: string) => {
  expect(p.value, `${k}.value`).toBeTruthy();
  expect(p.basis, `${k}.basis — 리서치 근거 없음`).toBeTruthy();
  expect(p.from, `${k}.from — 근거 출처 없음`).toMatch(/^(https?:\/\/|research\/|user:)/);
};

describe('direction — 디자인은 리서치 근거로만', () => {
  it('색 4개 모두 근거 있고 tokens.css와 같다', () => {
    for (const [k, p] of Object.entries(direction.palette)) {
      filled(p, `palette.${k}`);
      expect(cssVar(k), `tokens.css --${k}`).toBe(p.value.toLowerCase());
    }
  });
  it('디스플레이 글꼴 근거 있고 tokens.css --display 첫 글꼴과 같다', () => {
    filled(direction.display, 'display');
    expect(cssVar('display')?.split(',')[0].replace(/['"]/g, '')).toBe(direction.display.value.toLowerCase());
    if (direction.quote) filled(direction.quote, 'quote');
  });
  it('바이브 축 5개 모두 1~5 점수와 근거', () => {
    for (const a of AXES) {
      const x = direction.vibe[a];
      expect(x.score, `vibe.${a}.score`).toBeGreaterThanOrEqual(1);
      expect(x.score, `vibe.${a}.score`).toBeLessThanOrEqual(5);
      expect(x.basis, `vibe.${a}.basis`).toBeTruthy();
      expect(x.from, `vibe.${a}.from`).toMatch(/^(https?:\/\/|research\/)/);
    }
  });
  it('스타일·히어로 효과·로고 근거 있음', () => {
    filled(direction.style, 'style');
    filled(direction.heroEffect, 'heroEffect');
    filled(direction.logo, 'logo');
  });
  it('인트로·배경 영상·소품 전부 근거 있음', () => {
    filled(direction.introVideo, 'introVideo');
    expect(direction.bgVideos.length, '배경 영상 2~4겹').toBeGreaterThanOrEqual(2);
    direction.bgVideos.forEach((p, i) => filled(p, `bgVideos[${i}]`));
    direction.props.forEach((p, i) => filled(p, `props[${i}]`));
  });
});
