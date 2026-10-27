import { Fragment } from 'react';
import { keep } from '../data/copy';

// 제목·인용 줄바꿈: 바깥 배열 = 줄(지정한 자리에서만 바뀜), 안쪽 배열 = 구절(절대 쪼개지지 않음, 좁은 폰에선 구절 사이에서만 넘어감)
export function Lines({ l, className }: { l: string[][]; className?: string }) {
  return (
    <>
      {l.map((line, i) => (
        <span key={i} className={`ln${className ? ` ${className}` : ''}`}>
          {line.map((c, j) => <Fragment key={j}>{j > 0 && ' '}<span className="nw">{keep(c)}</span></Fragment>)}
        </span>
      ))}
    </>
  );
}
export const flat = (l: string[][]) => l.map((x) => x.join(' ')).join(' ');

// 줄바꿈 규칙: 문장이 끝나면 바로 다음 줄. 한 줄에 안 끝나는 문장은 두 줄로 고르게(.sent = block + text-wrap: balance).
// 문자열을 주면 문장 끝(. ! ?)에서 알아서 나눔.
export const split = (t: string) => t.split(/(?<=[.!?])\s+(?=\S)/);
export function Sents({ s }: { s: string | string[] }) {
  const list = typeof s === 'string' ? split(s) : s.flatMap(split);
  return <>{list.map((x, i) => <span key={i} className="sent">{keep(x)} </span>)}</>;
}
