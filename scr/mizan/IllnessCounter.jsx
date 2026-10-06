import { useMizan } from '@/hooks/useMizan';
import { MIZAN_ICONS } from '@/lib/mizanIcons';

export default function IllnessCounter() {
  const { state, addIllness, addPatience } = useMizan();
  const expiation = (state.forgiveCount || 0) + (state.illnessCount || 0) + (state.patienceCount || 0);

  return (
    <div className="rounded-3xl border border-orange-400/25 bg-gradient-to-b from-orange-50/40 to-card p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-full bg-orange-500/15 flex items-center justify-center text-orange-600">
          {(() => { const I = MIZAN_ICONS.Shield; return <I className="w-6 h-6" />; })()}
        </div>
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold">عدّاد التكفير: المرض والصبر</h2>
          <p className="font-body text-[11px] text-muted-foreground">البلاء يُطفئ وقود النار — سجّل ما يصيبك ويُكفَّر به عنك</p>
        </div>
        <div className="text-center shrink-0">
          <span className="font-display text-2xl font-bold text-orange-600">{expiation.toLocaleString('ar-EG')}</span>
          <p className="font-body text-[10px] text-muted-foreground">موجات تكفير</p>
        </div>
      </div>

      <p className="font-display text-sm text-center leading-relaxed text-foreground/80 bg-orange-50/50 rounded-2xl p-3 mb-4">
        «مَا يُصِيبُ الْمُؤْمِنَ مِنْ وَصَبٍ وَلَا نَصَبٍ وَلَا سَقَمٍ وَلَا حَزَنٍ حَتَّى الْهَمّ يُهَمّهُ إِلَّا كَفَّرَ اللَّهُ بِهِ مِنْ خَطَايَاهُ»
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={addIllness}
          className="rounded-2xl border border-orange-300/40 bg-gradient-to-b from-orange-100/60 to-card p-4 hover:border-orange-400/60 transition active:scale-[0.98]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-display text-sm font-bold">سجّل مرضاً</span>
            {(() => { const I = MIZAN_ICONS.Heart; return <I className="w-4 h-4 text-orange-500" />; })()}
          </div>
          <p className="font-display text-2xl font-bold text-orange-600">{(state.illnessCount || 0).toLocaleString('ar-EG')}</p>
          <p className="font-body text-[10px] text-muted-foreground mt-1">يُنقص وقود النار −٥٠٠</p>
        </button>

        <button
          onClick={addPatience}
          className="rounded-2xl border border-emerald-300/40 bg-gradient-to-b from-emerald-100/50 to-card p-4 hover:border-emerald-400/60 transition active:scale-[0.98]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-display text-sm font-bold">سجّل صبراً</span>
            {(() => { const I = MIZAN_ICONS.Star; return <I className="w-4 h-4 text-emerald-500" />; })()}
          </div>
          <p className="font-display text-2xl font-bold text-emerald-600">{(state.patienceCount || 0).toLocaleString('ar-EG')}</p>
          <p className="font-body text-[10px] text-muted-foreground mt-1">يُنقص وقود النار −٣٠٠</p>
        </button>
      </div>

      <p className="font-body text-[11px] text-muted-foreground text-center mt-3">
        إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُمْ بِغَيْرِ حِسَابٍ — الزمر: ١٠
      </p>
    </div>
  );
}