import { useMizan } from '@/hooks/useMizan';
import { GOOD_DEEDS } from '@/lib/deedsData';
import { MIZAN_ICONS } from '@/lib/mizanIcons';

export default function GoodDeeds() {
  const { addGood } = useMizan();
  const fallback = MIZAN_ICONS.Sparkles;

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl font-bold mb-1">الطاعات والقربات</h2>
      <p className="font-body text-sm text-muted-foreground mb-3">اضغط على كل عملٍ أديته ليُضخ في ميزانك مباشرة</p>

      <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4 mb-4">
        <p className="font-body text-sm leading-relaxed">
          💡 <span className="font-bold">توجيه شفيق:</span> أطل وقوفك وأحسن ركوعك وسجودك؛ فصوت الحق يناديك أن صلاتك فرارٌ إلى الله «فَفِرُّوا إِلَى اللَّهِ»، لا فراراً وتخلصاً منها!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {GOOD_DEEDS.map(deed => {
          const Icon = MIZAN_ICONS[deed.icon] || fallback;
          return (
            <button
              key={deed.id}
              onClick={() => addGood(deed)}
              className="group rounded-2xl border border-primary/15 bg-card p-4 text-right hover:border-accent/50 hover:bg-primary/5 transition active:scale-95"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-body">{deed.category}</span>
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-accent/15 group-hover:text-accent transition">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-body font-semibold text-sm leading-snug mb-1">{deed.name}</h3>
              <div className="flex items-center justify-between">
                <p className="font-display text-sm text-accent font-bold">+{deed.points.toLocaleString('ar-EG')}</p>
                {deed.plantsTree && <span className="text-xs">🌴</span>}
                {deed.buildsPalace && <span className="text-xs">🏰</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}