import { useState, type FormEvent } from 'react';
import { facts } from '../data/facts';

// 연락 폼(원래 CF7 연락 폼·광고/제휴 문의 폼·맞춤투어 안내를 옮김). 서버 전송 대신 이메일 앱을 내용과 함께 엶(시안).
export type Field = { k: string; label: string; type?: 'text' | 'email' | 'tel' | 'date' | 'number' | 'textarea'; req?: boolean; ph?: string };

export function MailForm({ subject, fields, submit = '이메일로 보내기' }: { subject: string; fields: Field[]; submit?: string }) {
  const [err, setErr] = useState('');
  const on = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const miss = fields.filter((f) => f.req && !String(fd.get(f.k) ?? '').trim());
    if (miss.length) { setErr(`${miss.map((m) => m.label).join(', ')}을(를) 적어 주세요.`); return; }
    const em = String(fd.get('email') ?? '');
    if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setErr('이메일 주소를 확인해 주세요.'); return; }
    setErr('');
    const body = fields.map((f) => `${f.label}: ${String(fd.get(f.k) ?? '').trim() || '-'}`).join('\n');
    location.href = `mailto:${facts.email.value}?subject=${encodeURIComponent(`${subject} ${String(fd.get('title') ?? '')}`.trim())}&body=${encodeURIComponent(body)}`;
  };
  return (
    <form className="mf" onSubmit={on} noValidate>
      {fields.map((f) => (
        <label key={f.k} className={`fl${f.type === 'textarea' ? ' fl--wide' : ''}`}>
          <span>{f.label}{f.req ? ' *' : ''}</span>
          {f.type === 'textarea' ? <textarea name={f.k} rows={5} placeholder={f.ph} /> : <input name={f.k} type={f.type ?? 'text'} placeholder={f.ph} autoComplete={f.k === 'email' ? 'email' : f.k === 'name' ? 'name' : f.k === 'phone' ? 'tel' : 'off'} />}
        </label>
      ))}
      {err && <p className="mf-err" role="alert">{err}</p>}
      <p className="mf-acts"><button type="submit">{submit}</button><a href={facts.kakaoChat.value} target="_blank" rel="noreferrer">카톡으로 상담</a></p>
      <p className="mf-note">제안 시안이라 이 폼은 서버로 보내지 않고, 적은 내용으로 이메일 앱을 엽니다.</p>
    </form>
  );
}
