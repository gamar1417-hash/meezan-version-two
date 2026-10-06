import { useMizan } from '@/hooks/useMizan';
import { JANNAN_GATES } from '@/lib/jannahData';
import { MIZAN_ICONS } from '@/lib/mizanIcons';

export default function JannahGates() {
  const { state } = useMizan();
  const Lock = MIZAN_ICONS.Lock;
  const loggedDeedIds = new Set(state.log.filter(e => e.type === 'good').map(e => e.deedId));

  const gates = JANNAN_GATES.map(g => ({ ...g, unlocked: g.deeds.some(d => loggedDeedIds.has(d)) }));
  const unlockedCount = gates.filter(g => g.unlocked).length;

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl font-bold mb-1">أبواب الجنة السبعة</h2>
      <p className="font-body text-sm text-muted-foreground mb-4">لكل عملٍ بابٌ يدعوك للدخول منه — افتحها بطاعتك، وكلما فتحت بابًا ازددت من جنتك قربًا</p>

      <div className="flex items-center justify-between mb-4 rounded-xl bg-primary/5 border border-primary/15 px-4 py-2.5">
        <span className="font-body text-sm">الأبواب المفتوحة</span>
        <span className="font-display text-lg font-bold gold-text">{unlockedCount.toLocaleString('ar-EG')} / ٧</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {gates.map(g => {
          const Icon = MIZAN_ICONS[g.icon] || MIZAN_ICONS.Sparkles;
          return (
            <div
              key={g.id}
              className={
                g.unlocked
                  ? 'relative rounded-2xl p-4 text-center bg-gradient-to-b from-amber-50 to-amber-100/40 dark:from-amber-900/20 dark:to-transparent border border-amber-400/40 shadow-md shadow-amber-500/10'
                  : 'relative rounded-2xl p-4 text-center bg-muted/40 border border-border'
              }
            >
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${g.unlocked ? 'bg-amber-400/20 text-amber-600 dark:text-amber-300' : 'bg-muted text-muted-foreground'}`}>
                {g.unlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
              </div>
              <h3 className={`font-display text-sm font-bold leading-snug mb-1 ${g.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>{g.name}</h3>
              <p className="font-body text-[10px] text-muted-foreground leading-relaxed">{g.desc}</p>
              {g.unlocked && <span className="absolute top-2 left-2 text-xs">🔓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}