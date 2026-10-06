const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from 'react';
import { useMizan } from '@/hooks/useMizan';

import { COMBINATION_RULES, DEFAULT_SEASONS, describeRange } from '@/lib/virtueSeasons';
import { MIZAN_ICONS } from '@/lib/mizanIcons';
import { Link } from 'react-router-dom';

const empty = { name: '', rule: 'hijri-period', multiplier: 1, priority: 0, active: true, recurring: true, needsReview: true, hijriMonth: 9, hijriDayStart: 1, hijriDayEnd: 1, weekday: 5, gregorianStart: '', gregorianEnd: '', eligibleActions: [], reference: '', description: '', notes: '' };

export default function MizanSettings() {
  const { state, loadMultipliers, setCombinationRule } = useMizan();
  const [list, setList] = useState(state.multipliers || []);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [eligText, setEligText] = useState('');
  const Back = MIZAN_ICONS.Plus;
  const Save = MIZAN_ICONS.Check;

  useEffect(() => { setList(state.multipliers || []); }, [state.multipliers]);

  const reload = async () => { await loadMultipliers(); };

  const startNew = () => { setEditing({ ...empty }); setEligText(''); };
  const startEdit = (m) => { setEditing({ ...m }); setEligText((m.eligibleActions || []).join(', ')); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = {
      ...editing,
      multiplier: Number(editing.multiplier) || 1,
      priority: Number(editing.priority) || 0,
      weekday: Number(editing.weekday) || 0,
      hijriMonth: Number(editing.hijriMonth) || 0,
      hijriDayStart: Number(editing.hijriDayStart) || 0,
      hijriDayEnd: Number(editing.hijriDayEnd) || 0,
      eligibleActions: eligText.split(',').map(s => s.trim()).filter(Boolean),
    };
    try {
      if (editing.id && String(editing.id).length > 8) {
        await db.entities.VirtueMultiplier.update(editing.id, payload);
      } else {
        const { id, ...rest } = payload;
        await db.entities.VirtueMultiplier.create(rest);
      }
      setEditing(null);
      await reload();
    } catch (e) {
      alert('تعذّر الحفظ في قاعدة البيانات — تأكد من تسجيل الدخول. ستُحفظ القيم محليًا كإعداد مؤقت.');
    }
    setSaving(false);
  };

  const remove = async (m) => {
    if (!confirm(`حذف «${m.name}»؟`)) return;
    try { await db.entities.VirtueMultiplier.delete(m.id); await reload(); } catch (e) { alert('تعذّر الحذف — تأكد من تسجيل الدخول.'); }
  };

  const toggleActive = async (m) => {
    try { await db.entities.VirtueMultiplier.update(m.id, { active: !m.active }); await reload(); } catch (e) {}
  };

  const restoreDefaults = async () => {
    if (!confirm('استعادة المواسم الافتراضية؟ سيُنشئ نسخًا جديدة في قاعدة البيانات.')) return;
    setSaving(true);
    try {
      await db.entities.VirtueMultiplier.bulkCreate(DEFAULT_SEASONS.map(({ id, ...r }) => r));
      await reload();
    } catch (e) { alert('تعذّر الإضافة — تأكد من تسجيل الدخول.'); }
    setSaving(false);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background pb-10">
      <header className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground px-5 pt-8 pb-6 rounded-b-3xl">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="font-body text-xs text-amber-100/80 hover:underline">← العودة للرئيسية</Link>
          <h1 className="font-display text-2xl md:text-3xl font-bold gold-text mt-1">لوحةُ المضاعفات والمواسم</h1>
          <p className="font-body text-[12px] text-amber-100/80 mt-1">عدّل معاملات المناسبات وتواريخها وأعمالها المشمولة — كلٌّ مستقلٌّ وقابل للتعديل بلا إعادة برمجة.</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 -mt-4 space-y-4">
        <div className="rounded-2xl border border-primary/20 bg-card p-4">
          <h2 className="font-display text-lg font-bold mb-2">قاعدةُ تداخل المناسبات</h2>
          <p className="font-body text-[11px] text-muted-foreground mb-2">عند تزامن مناسبتين، كيف يختار النظام المعامل؟ (لا يضرب المعاملين معًا أبدًا.)</p>
          <div className="flex flex-col gap-1.5">
            {COMBINATION_RULES.map(r => (
              <button key={r.id} onClick={() => setCombinationRule(r.id)}
                className={`text-right rounded-xl border px-3 py-2 font-body text-sm transition ${state.combinationRule === r.id ? 'border-primary bg-primary/10 font-bold' : 'border-border bg-background/60'}`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">المواسم ({list.length})</h2>
          <div className="flex gap-2">
            <button onClick={restoreDefaults} disabled={saving} className="font-body text-[11px] px-3 py-1.5 rounded-xl border border-border bg-background/60 hover:border-primary/40">استعادة الافتراضي</button>
            <button onClick={startNew} className="font-body text-[11px] px-3 py-1.5 rounded-xl bg-primary text-primary-foreground flex items-center gap-1"><Back className="w-4 h-4" /> مناسبة جديدة</button>
          </div>
        </div>

        {list.map(m => (
          <div key={m.id} className="rounded-2xl border border-border bg-card p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-body font-semibold text-sm">{m.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-body">×{m.multiplier.toLocaleString('ar-EG')}</span>
                  {m.active ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">فعّال</span> : <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">موقوف</span>}
                  {m.needsReview && <span className="text-[10px] text-amber-600">قيمة مبدئية</span>}
                </div>
                <p className="font-body text-[11px] text-muted-foreground">{describeRange(m)} · أولوية {m.priority}</p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button onClick={() => startEdit(m)} className="font-body text-[10px] px-2.5 py-1 rounded-lg border border-border hover:border-primary/40">تعديل</button>
                <button onClick={() => toggleActive(m)} className="font-body text-[10px] px-2.5 py-1 rounded-lg border border-border hover:border-primary/40">{m.active ? 'إيقاف' : 'تفعيل'}</button>
                <button onClick={() => remove(m)} className="font-body text-[10px] px-2.5 py-1 rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/10">حذف</button>
              </div>
            </div>
          </div>
        ))}

        {editing && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-3" onClick={() => setEditing(null)}>
            <div className="bg-card rounded-3xl p-5 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h3 className="font-display text-lg font-bold mb-3">{editing.id ? 'تعديل مناسبة' : 'مناسبة جديدة'}</h3>
              <div className="space-y-2.5">
                <Field label="الاسم"><input className={inp} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></Field>
                <Field label="الوصف"><input className={inp} value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} /></Field>
                <Field label="المرجع/الملاحظة الشرعية"><input className={inp} value={editing.reference || ''} onChange={e => setEditing({ ...editing, reference: e.target.value })} /></Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="المعامل"><input type="number" className={inp} value={editing.multiplier} onChange={e => setEditing({ ...editing, multiplier: e.target.value })} /></Field>
                  <Field label="الأولوية"><input type="number" className={inp} value={editing.priority} onChange={e => setEditing({ ...editing, priority: e.target.value })} /></Field>
                </div>
                <Field label="نوع القاعدة">
                  <select className={inp} value={editing.rule} onChange={e => setEditing({ ...editing, rule: e.target.value })}>
                    <option value="hijri-period">فترة هجرية</option>
                    <option value="weekly">أسبوعي</option>
                    <option value="gregorian-period">فترة ميلادية</option>
                  </select>
                </Field>
                {editing.rule === 'hijri-period' && (
                  <div className="grid grid-cols-3 gap-2">
                    <Field label="الشهر الهجري"><input type="number" className={inp} value={editing.hijriMonth} onChange={e => setEditing({ ...editing, hijriMonth: e.target.value })} /></Field>
                    <Field label="من يوم"><input type="number" className={inp} value={editing.hijriDayStart} onChange={e => setEditing({ ...editing, hijriDayStart: e.target.value })} /></Field>
                    <Field label="إلى يوم"><input type="number" className={inp} value={editing.hijriDayEnd} onChange={e => setEditing({ ...editing, hijriDayEnd: e.target.value })} /></Field>
                  </div>
                )}
                {editing.rule === 'weekly' && (
                  <Field label="يوم الأسبوع (٠=أحد ... ٥=جمعة)"><input type="number" className={inp} value={editing.weekday} onChange={e => setEditing({ ...editing, weekday: e.target.value })} /></Field>
                )}
                {editing.rule === 'gregorian-period' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="من (ميلادي)"><input type="date" className={inp} value={editing.gregorianStart || ''} onChange={e => setEditing({ ...editing, gregorianStart: e.target.value })} /></Field>
                    <Field label="إلى (ميلادي)"><input type="date" className={inp} value={editing.gregorianEnd || ''} onChange={e => setEditing({ ...editing, gregorianEnd: e.target.value })} /></Field>
                  </div>
                )}
                <Field label="الأعمال المشمولة (معرّفات مفصولة بفاصلة؛ فارغ=الجميع)"><input className={inp} value={eligText} onChange={e => setEligText(e.target.value)} /></Field>
                <div className="flex flex-wrap gap-3 text-sm">
                  <label className="flex items-center gap-1.5 font-body"><input type="checkbox" checked={editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} /> فعّال</label>
                  <label className="flex items-center gap-1.5 font-body"><input type="checkbox" checked={editing.recurring} onChange={e => setEditing({ ...editing, recurring: e.target.checked })} /> يتكرر سنويًا</label>
                  <label className="flex items-center gap-1.5 font-body"><input type="checkbox" checked={editing.needsReview} onChange={e => setEditing({ ...editing, needsReview: e.target.checked })} /> قيمة مبدئية</label>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={save} disabled={saving} className="flex-1 rounded-xl bg-primary text-primary-foreground font-body font-medium py-2.5 flex items-center justify-center gap-1.5"><Save className="w-4 h-4" /> حفظ</button>
                <button onClick={() => setEditing(null)} className="rounded-xl border border-border px-4 py-2.5 font-body">إلغاء</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const inp = 'w-full rounded-xl border border-input bg-background px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent';
function Field({ label, children }) {
  return <label className="block"><span className="font-body text-[11px] text-muted-foreground block mb-1">{label}</span>{children}</label>;
}