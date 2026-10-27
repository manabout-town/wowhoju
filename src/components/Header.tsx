import { useEffect, useState } from 'react';
import { usePastHero } from '../lib/usePastHero';
import { facts } from '../data/facts';
import './header.css';

// 원래 사이트 메인 메뉴 8개(Home·일일투어·단기여행·버스/선박·울룰루·맞춤투어·여행정보·고객센터) + 상단바 카톡상담
export const NAV: [string, string][] = [
  ['일일투어', '#/tours/full-day'], ['단기여행', '#/tours/short'], ['버스/선박', '#/tours/bus-ferry'], ['울룰루', '#/tours/uluru'],
  ['맞춤투어', '#/custom'], ['여행정보', '#/info'], ['고객센터', '#/help'],
];

// 투명 헤더: 바탕 없이 글자만. 홈에선 히어로를 지난 뒤 올릴 때만, 다른 페이지에선 내릴 때 숨고 올릴 때 나타남.
export function Header({ home }: { home: boolean }) {
  const past = usePastHero();
  const [up, setUp] = useState(true);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    let last = scrollY;
    const on = () => { const y = scrollY; if (Math.abs(y - last) > 6) { setUp(y < last || y < 80); last = y; } };
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    const close = () => setMenu(false);
    addEventListener('hashchange', close);
    return () => removeEventListener('hashchange', close);
  }, []);
  useEffect(() => { document.documentElement.style.overflow = menu ? 'hidden' : ''; }, [menu]);
  const show = menu || ((home ? past : true) && up);
  return (
    <header className={`hd${show ? ' is-on' : ''}${menu ? ' is-menu' : ''}`}>
      <div className="hd__in wrap">
        <a className="hd__mark" href="#/" aria-label="와우호주 홈" tabIndex={show ? 0 : -1}><img src="/logo/logo-ko-white.png" alt="와우호주" width="173" height="23" /></a>
        <nav className="hd__nav" aria-label="메인 메뉴">
          {NAV.map(([l, h]) => <a key={h} href={h} tabIndex={show ? 0 : -1}>{l}</a>)}
        </nav>
        <a className="hd__talk" href={facts.kakaoChat.value} target="_blank" rel="noreferrer" tabIndex={show ? 0 : -1}>카톡상담</a>
        <button type="button" className="hd__burger" aria-expanded={menu} aria-controls="mmenu" onClick={() => setMenu(!menu)} tabIndex={show ? 0 : -1}>{menu ? '닫기' : '메뉴'}</button>
      </div>
      <div id="mmenu" className="hd__menu" hidden={!menu}>
        <nav className="wrap" aria-label="모바일 메뉴">
          <a href="#/">홈</a>
          {NAV.map(([l, h]) => <a key={h} href={h}>{l}</a>)}
          <a href="#/about">About Us</a>
          <p className="hd__menu-c"><a href={facts.kakaoChat.value} target="_blank" rel="noreferrer">카톡상담 와우호주투어</a><a href={`tel:${facts.phone.value.replace(/\s/g, '')}`}>{facts.phone.value}</a></p>
        </nav>
      </div>
    </header>
  );
}
