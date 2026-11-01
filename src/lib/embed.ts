// 담기는 모드: 원래 사이트(wowhoju.com.au) '여행이야기' 페이지 iframe 안에서 열릴 때(?embed=1).
// 원래 사이트의 헤더·하단이 바깥에 있으니 우리 헤더·하단·인트로는 숨긴다. 해시 이동해도 유지(sessionStorage).
export const isEmbed = (() => {
  let on = new URLSearchParams(location.search).has('embed');
  try {
    if (on) sessionStorage.setItem('wowhoju-embed', '1');
    else on = sessionStorage.getItem('wowhoju-embed') === '1' && window.self !== window.top;
  } catch { /* 저장소 막힘 */ }
  if (on) document.documentElement.classList.add('is-embed');
  return on;
})();
