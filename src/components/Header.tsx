import { useEffect, useState } from 'react';
import { facts } from '../data/facts';
import './header.css';

// 원래 사이트 메인 메뉴 8개(Home·일일투어·단기여행·버스/선박·울룰루·맞춤투어·여행정보·고객센터) + 상단바 카톡상담
export const NAV: [string, string][] = [
  ['일일투어', '#/tours/full-day'], ['단기여행', '#/tours/short'], ['버스/선박', '#/tours/bus-ferry'], ['울룰루', '#/tours/uluru'],
  ['맞춤투어', '#/custom'], ['여행정보', '#/info'], ['고객센터', '#/help'],
];

// 투명 헤더: 바탕 없이 글자만. 화면에 고정하지 않고 페이지 맨 위에만 둠(유저 2026-10-28) — 스크롤하면 같이 올라감.
export function Header() {
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const close = () => setMenu(false);
    addEventListener('hashchange', close);
    return () => removeEventListener('hashchange', close);
  }, []);
  useEffect(() => { document.documentElement.style.overflow = menu ? 'hidden' : ''; }, [menu]);
  return (
    <>
    <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>본문 바로가기</a>
    <header className={`hd${menu ? ' is-menu' : ''}`}>
      <div className="hd__in wrap">
        <a className="hd__mark" href="#/" aria-label="와우호주 홈"><img src="/logo/logo-ko-white.png" alt="와우호주" width="173" height="23" /></a>
        <nav className="hd__nav" aria-label="메인 메뉴">
          {NAV.map(([l, h]) => <a key={h} href={h}>{l}</a>)}
        </nav>
        <a className="hd__talk" href={facts.kakaoChat.value} target="_blank" rel="noreferrer">카톡상담</a>
        <button type="button" className="hd__burger" aria-expanded={menu} aria-controls="mmenu" onClick={() => setMenu(!menu)}>{menu ? '닫기' : '메뉴'}</button>
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
    </>
  );
}
