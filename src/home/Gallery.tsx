import { useRef, useState } from 'react';
import { useScrub } from '../lib/scrub';
import { facts, channels } from '../data/facts';
import posts from '../data/posts.json';
import { Lines } from '../components/Lines';
import { Ph } from '../components/Ph';
import { flyStage, SHOTS } from './galleryFly';

// 손님 사진 갤러리: 고정된 화면에서 내리는 만큼 손님들이 찍힌 사진 사이로 앞으로 날아 들어감.
// 근거: 원래 사이트 「포토/영상 갤러리」 페이지 + 사진 92장 중 손님 포즈 사진
const VIDEOS = [
  ['KEP0tdGwEsQ', '어른들도 집에가는걸 잊은 아이들처럼 노는 랜슬린 (Lancelin)'],
  ['bfkfx84B2sw', '설원같은 란셀린 모래사막에서 라이딩으로 시작한 서호주 북부 2박 3일의 짦은 여행'],
  ['1qu_T4BGDfY', '달콤했던 마가렛리버 여행'],
  ['ij9v1CwwLLg', '9월에는 퍼스로 여행을 와야하는 이유 3'],
] as const;

export function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState<string | null>(null);
  useScrub(ref, (p, el) => {
    const s = flyStage(p);
    el.querySelectorAll<HTMLElement>('.ga-shot').forEach((sh, i) => {
      const z = s.z(i);
      sh.style.transform = `translate3d(${SHOTS[i].x}vw, ${SHOTS[i].y}vh, ${z.toFixed(0)}px) rotate(${SHOTS[i].r}deg)`;
      sh.style.opacity = s.o(i).toFixed(3);
    });
    el.querySelector<HTMLElement>('.ga-cap')!.textContent = SHOTS[s.near].where;
    el.querySelector<HTMLElement>('.ga-n')!.textContent = String(s.seen);
    el.querySelector<HTMLElement>('.ga-tilt')!.style.transform = `rotateY(${((p - 0.5) * 8).toFixed(2)}deg)`;
  }, { pin: true, end: '+=260%', still: 0.35 });

  return (
    <section id="gallery" className="sec ga" data-bg="sunset" data-fx="사진 사이로 날아 들어감,지명 자막 바뀜,본 사진 수 올라감,화면 살짝 기울어짐,영상 썸네일 눌러 재생">
      <div id="fly" className="ga-pin" ref={ref}>
      <div className="ga-stage" aria-hidden>
        <div className="ga-tilt">
          {SHOTS.map((s) => <div key={s.s} className="ga-shot"><Ph s={s.s} alt="" sizes="40vw" /></div>)}
        </div>
      </div>
      <div className="wrap ga-over">
        <h2><Lines l={[['사진으로 먼저'], ['걸어 보는 서호주']]} /></h2>
        <p className="ga-meta"><b className="ga-cap">{SHOTS[0].where}</b><span><i className="ga-n num">1</i> / {SHOTS.length}장</span></p>
      </div>
      </div>
      <div className="wrap ga-videos">
        <h3>유튜브 영상</h3>
        <ul>
          {VIDEOS.map(([id, t]) => (
            <li key={id}>
              {play === id
                ? <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={t} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
                : <button type="button" onClick={() => setPlay(id)} aria-label={`${t} 재생`}><img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" /><span>{t}</span></button>}
            </li>
          ))}
        </ul>
        <h3 className="ga-blog-h">블로그 최근 글</h3>
        <ul className="po-list">{posts.recent.slice(0, 5).map((p) => <li key={p.url}><a href={p.url} target="_blank" rel="noreferrer"><b>{p.title}</b><span className="num">{p.date.replaceAll('-', '.')}</span></a></li>)}</ul>
        <p className="ga-links"><a href="#/info">여행정보 글 전체</a></p>
        <p className="ga-links">
          <a href={channels.insta} target="_blank" rel="noreferrer">인스타그램 @wowhoju · 게시물 {facts.instaPosts.value}개</a>
          <a href={channels.youtube} target="_blank" rel="noreferrer">유튜브 채널</a>
        </p>
      </div>
    </section>
  );
}
