import { useMizan } from '@/hooks/useMizan';
import { EXPIATION_INFO } from '@/lib/fireData';
import { MIZAN_ICONS } from '@/lib/mizanIcons';

export default function Expiation() {
  const { state, addGood } = useMizan();
  const Droplets = MIZAN_ICONS.Droplets;
  const expiated = state.forgiveCount || 0;
  const pending = Math.max(0, state.totalBad);

  return (
    <div className="rounded-3xl border border-emerald-700/25 bg-gradient-to-b from-emerald-50 to-card dark:from-emerald-950/20 p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
          <Droplets className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold">{EXPIATION_INFO.title}</h2>
          <p className="font-body text-[11px] text-muted-foreground">الحسنات يُذهبن السيئات</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-3 text-center">
          <p className="font-body text-[11px] text-muted-foreground mb-0.5">سيئاتٌ كُفّرت</p>
          <p className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">{expiated.toLocaleString('ar-EG')}</p>
        </div>
        <div className="rounded-2xl bg-red-500/5 border border-red-500/15 p-3 text-center">
          <p className="font-body text-[11px] text-muted-foreground mb-0.5">سيئاتٌ باقية</p>
          <p className="font-display text-2xl font-bold text-red-500">{pending.toLocaleString('ar-EG')}</p>
        </div>
      </div>

      <p className="font-body text-sm leading-relaxed text-muted-foreground mb-3">{EXPIATION_INFO.desc}</p>

      <div className="rounded-2xl bg-primary/5 border border-primary/15 p-3.5 mb-4">
        <p className="font-display text-sm leading-loose text-foreground">{EXPIATION_INFO.verse}</p>
        <p className="font-body text-[11px] text-muted-foreground mt-1">{EXPIATION_INFO.ref}</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => addGood({ id: 'istighfar-kaffarah', name: 'استغفار لتكفير سيئة', points: 200 })}
          className="px-4 py-2 rounded-full bg-emerald-600 text-white font-body text-sm font-semibold hover:bg-emerald-700 transition active:scale-95"
        >
          استغفر الله
        </button>
        <button
          onClick={() => addGood({ id: 'sadaqah-kaffarah', name: 'صدقة لتكفير سيئة', points: 700 })}
          className="px-4 py-2 rounded-full bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 font-body text-sm font-semibold border border-emerald-500/25 hover:bg-emerald-600/25 transition active:scale-95"
        >
          تصدّق
        </button>
      </div>
    </div>
  );
}