import { useMizan } from '@/hooks/useMizan';
import { MIZAN_ICONS } from '@/lib/mizanIcons';
import WorshipChart from '@/components/mizan/WorshipChart';

const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const TASKS = [
  { id: 'fajr', name: 'صلاة الفجر في جماعة', icon: 'Sun', points: 400 },
  { id: 'dhuhr', name: 'صلاة الظهر', icon: 'Clock', points: 300 },
  { id: 'asr', name: 'صلاة العصر', icon: 'Clock', points: 300 },
  { id: 'maghrib', name: 'صلاة المغرب', icon: 'Moon', points: 300 },
  { id: 'isha', name: 'صلاة العشاء', icon: 'Moon', points: 300 },
  { id: 'witr', name: 'الوتر', icon: 'Star', points: 200 },
  { id: 'morning', name: 'أذكار الصباح', icon: 'Sun', points: 150 },
  { id: 'evening', name: 'أذكار المساء', icon: 'Moon', points: 150 },
  { id: 'quran', name: 'ورد القرآن', icon: 'BookOpen', points: 300 },
  { id: 'qiyam', name: 'قيام الليل', icon: 'Moon', points: 400 },
  { id: 'sadaqah', name: 'صدقة اليوم', icon: 'Gift', points: 200 },
  { id: 'silah', name: 'صلة الرحم', icon: 'Users', points: 300 },
];

function dayKey(d) { return d.toISOString().slice(0, 10); }

export default function WorshipSchedule() {
  const { state, toggleDailyWorship } = useMizan();
  const today = dayKey(new Date());
  const todayTasks = state.dailyWorship[today] || {};
  const checkedCount = TASKS.filter(t => todayTasks[t.id]).length;

  // تراكمي
  const goodEntries = state.log.filter(e => e.type === 'good');
  const totalDeeds = goodEntries.length;
  const activeDays = new Set(goodEntries.map(e => dayKey(new Date(e.timestamp)))).size;

  const doneTasksPct = Math.round((checkedCount / TASKS.length) * 100);

  return (
    <div className="space-y-4">
      {/* الجدول اليومي */}
      <div className="rounded-3xl border border-primary/15 bg-gradient-to-b from-primary/5 to-card p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-primary">
              {(() => { const I = MIZAN_ICONS.Clock; return <I className="w-6 h-6" />; })()}
            </div>
            <div>
              <h2 className="font-display text-xl md:text-2xl font-bold">الجدول اليومي لرفع الأعمال</h2>
              <p className="font-body text-[11px] text-muted-foreground">أَدْرِكْ جدول اليوم — كل ختمة تُرفع في ميزانك وتُضاعَف</p>
            </div>
          </div>
          <div className="text-center shrink-0">
            <span className="font-display text-2xl font-bold gold-text">{checkedCount}/{TASKS.length}</span>
            <p className="font-body text-[10px] text-muted-foreground">{doneTasksPct}%</p>
          </div>
        </div>

        <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-l from-primary to-accent transition-all" style={{ width: `${doneTasksPct}%` }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TASKS.map(t => {
            const Icon = MIZAN_ICONS[t.icon] || MIZAN_ICONS.Sparkles;
            const on = !!todayTasks[t.id];
            return (
              <button
                key={t.id}
                onClick={() => toggleDailyWorship(today, t)}
                className={`flex items-center gap-3 rounded-2xl border p-3 transition active:scale-[0.98] ${
                  on ? 'border-primary bg-primary/10' : 'border-primary/15 bg-background hover:border-primary/30'
                }`}
              >
                <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${on ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="flex-1 text-right font-body text-sm font-medium">{t.name}</span>
                <span className="text-[10px] font-body text-accent">+{t.points}</span>
                <div className={`w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center ${on ? 'bg-primary border-primary text-primary-foreground' : 'border-primary/30'}`}>
                  {on && <MIZAN_ICONS.Check className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* الرسم الشهري المقروء */}
      <WorshipChart />

      {/* التقرير التراكمي */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/8 to-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary">
            {(() => { const I = MIZAN_ICONS.Trophy; return I ? <I className="w-5 h-5" /> : <MIZAN_ICONS.Star className="w-5 h-5" />; })()}
          </div>
          <h2 className="font-display text-lg font-bold">التقرير التراكمي</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-secondary/40 p-3 text-center">
            <p className="font-display text-2xl font-bold gold-text">{state.totalGood.toLocaleString('ar-EG')}</p>
            <p className="font-body text-[10px] text-muted-foreground">إجمالي الحسنات</p>
          </div>
          <div className="rounded-2xl bg-secondary/40 p-3 text-center">
            <p className="font-display text-2xl font-bold gold-text">{totalDeeds.toLocaleString('ar-EG')}</p>
            <p className="font-body text-[10px] text-muted-foreground">عدد الأعمال</p>
          </div>
          <div className="rounded-2xl bg-secondary/40 p-3 text-center">
            <p className="font-display text-2xl font-bold gold-text">{activeDays.toLocaleString('ar-EG')}</p>
            <p className="font-body text-[10px] text-muted-foreground">أيام نشطة</p>
          </div>
          <div className="rounded-2xl bg-secondary/40 p-3 text-center">
            <p className="font-display text-2xl font-bold gold-text">{(state.forgiveCount || 0).toLocaleString('ar-EG')}</p>
            <p className="font-body text-[10px] text-muted-foreground">تائب مستغفر</p>
          </div>
        </div>
      </div>
    </div>
  );
}