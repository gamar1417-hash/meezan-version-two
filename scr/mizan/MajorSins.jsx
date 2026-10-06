import { useMizan } from '@/hooks/useMizan';
import { MAJOR_SINS } from '@/lib/fireData';
import { MIZAN_ICONS } from '@/lib/mizanIcons';

const MULTIPLIER = 2; // تضعيف السيئات: الكبائر تُضاعف في الميزان

export default function MajorSins() {
  const { addBad, state } = useMizan();
  const AlertTriangle = MIZAN_ICONS.AlertCircle;

  const loggedMajor = state.log.filter(e => e.type === 'bad' && MAJOR_SINS.some(s => s.id === e.deedId));
  const majorCount = loggedMajor.length;
  const majorWeight = loggedMajor.reduce((sum, e) => sum + Math.abs(e.points), 0);

  const log = (sin) => {
    addBad({ id: sin.id, name: `${sin.name} (كبيرة ×${MULTIPLIER})`, points: sin.basePoints * MULTIPLIER });
  };

  return (
    <div className="rounded-3xl border border-red-900/40 bg-gradient-to-b from-red-950/20 to-card p-5">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-11 h-11 rounded-full bg-red-500/15 flex items-center justify-center text-red-500">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold">الكبائر والمحرمات</h2>
          <p className="font-body text-[11px] text-muted-foreground">تضعيف السيئات ×{MULTIPLIER} على الكبائر — فاحذرها وتب منها</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 rounded-xl bg-red-500/5 border border-red-500/15 px-4 py-2.5">
        <span className="font-body text-xs text-red-700 dark:text-red-300">عدّاد تضعيف السيئات</span>
        <span className="font-display text-sm font-bold text-red-600 dark:text-red-400">
          {majorCount.toLocaleString('ar-EG')} كبيرة · {majorWeight.toLocaleString('ar-EG')} خردلة
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {MAJOR_SINS.map(sin => (
          <button
            key={sin.id}
            onClick={() => log(sin)}
            className="group flex items-center justify-between gap-3 rounded-2xl border border-red-800/25 bg-red-950/10 p-3.5 text-right hover:border-red-700/40 transition active:scale-[0.98]"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-body">{sin.category}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-body font-bold">×{MULTIPLIER}</span>
              </div>
              <h3 className="font-body font-semibold text-sm leading-snug mb-1">{sin.name}</h3>
              <p className="font-display text-[11px] leading-relaxed text-muted-foreground">{sin.verse} <span className="text-[10px]">— {sin.ref}</span></p>
            </div>
            <div className="text-left shrink-0">
              <p className="font-display text-xs text-red-500 font-bold whitespace-nowrap">
                {(sin.basePoints * MULTIPLIER).toLocaleString('ar-EG')}
              </p>
              <p className="font-body text-[9px] text-muted-foreground">خردلة</p>
            </div>
          </button>
        ))}
      </div>

      <p className="font-body text-[11px] text-center text-muted-foreground mt-4 leading-relaxed">
        هذه تنبيهٌ وتذكير لا فتوى — والتوبة الصادقة من الكبائر شرطها الإقلاع والندم والعزم والتحلل من حقوق العباد.
      </p>
    </div>
  );
}