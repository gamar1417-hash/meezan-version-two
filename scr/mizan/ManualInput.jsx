import { useState } from 'react';
import { useMizan } from '@/hooks/useMizan';
import { MIZAN_ICONS } from '@/lib/mizanIcons';
import { resolveActiveMultiplier } from '@/lib/virtueSeasons';

export default function ManualInput() {
  const { addManual, state } = useMizan();
  const Plus = MIZAN_ICONS.Plus;
  const nowLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const [count, setCount] = useState('');
  const [when, setWhen] = useState(nowLocal);

  const info = resolveActiveMultiplier(state.multipliers, when ? new Date(when) : new Date(), state.combinationRule);
  const base = Math.max(0, parseInt(count, 10) || 0) * 10;
  const preview = Math.round(base * info.multiplier);

  const submit = () => {
    const n = parseInt(count, 10);
    if (!n || n <= 0) return;
    addManual(n, 10, when);
    setCount('');
    setWhen(nowLocal);
  };

  return (
    <div className="rounded-2xl bg-card border border-accent/20 p-4">
      <p className="font-body text-sm text-muted-foreground mb-3">إدخال يدوي لأعداد التسابيح والأذكار المحسوبة خارج التطبيق — حدّد تاريخ ووقت العمل ليُفحص الموسم الفعّال حينها:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
        <input
          type="number" value={count}
          onChange={e => setCount(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="اكتب العدد..."
          className="rounded-xl border border-input bg-background px-4 py-2.5 text-center font-body text-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <input
          type="datetime-local" value={when}
          onChange={e => setWhen(e.target.value)}
          className="rounded-xl border border-input bg-background px-4 py-2.5 text-center font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      {info.multiplier > 1 && (
        <p className="font-body text-[11px] text-amber-700 dark:text-amber-300 mb-2">
          الموسم الفعّال في ذلك الوقت: <span className="font-bold">{info.name}</span> — ×{info.multiplier.toLocaleString('ar-EG')}
        </p>
      )}
      <div className="flex items-center justify-between gap-2">
        <span className="font-body text-xs text-muted-foreground">
          {base > 0 ? `الحساب: ${base.toLocaleString('ar-EG')}${info.multiplier > 1 ? ` ×${info.multiplier.toLocaleString('ar-EG')}` : ''} = ` : ''}
          {base > 0 && <span className="font-bold gold-text">{preview.toLocaleString('ar-EG')}</span>}
        </span>
        <button onClick={submit} className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-body font-medium flex items-center gap-1.5 hover:opacity-90 transition active:scale-95">
          <Plus className="w-5 h-5" /> ضخّ للميزان
        </button>
      </div>
    </div>
  );
}