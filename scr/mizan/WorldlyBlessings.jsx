import { WORLDLY_BLESSINGS } from '@/lib/deedsData';
import { MIZAN_ICONS } from '@/lib/mizanIcons';

export default function WorldlyBlessings() {
  const fallback = MIZAN_ICONS.Sparkles;
  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl font-bold mb-1">عاجل الفضل الدنيوي</h2>
      <p className="font-body text-sm text-muted-foreground mb-4">بشارة المؤمن في الدنيا قبل الآخرة — ثمراتٌ تُقطف قبل الجنة</p>
      <div className="grid gap-3">
        {WORLDLY_BLESSINGS.map(b => {
          const Icon = MIZAN_ICONS[b.icon] || fallback;
          return (
            <div key={b.id} className="rounded-2xl bg-card border border-accent/20 p-4 flex items-start gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-accent/15 flex items-center justify-center text-accent">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-body font-bold text-base mb-1">{b.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-2">{b.worldly}</p>
                <p className="font-display text-sm text-foreground/80 leading-loose">{b.verse}</p>
                <p className="font-body text-xs text-accent mt-1">{b.ref}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}