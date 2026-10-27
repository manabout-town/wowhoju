// 업체 사진(public/img/<slug>-800|1600.webp). 테두리·판 없이 가장자리 마스크로 영상에 녹임(.ph--fade).
export function Ph({ s, alt, className, sizes = '(max-width: 760px) 100vw, 50vw', eager }: { s: string; alt: string; className?: string; sizes?: string; eager?: boolean }) {
  return (
    <img
      className={`ph${className ? ` ${className}` : ''}`}
      src={`/img/${s}-800.webp`}
      srcSet={`/img/${s}-800.webp 800w, /img/${s}-1600.webp 1600w`}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
