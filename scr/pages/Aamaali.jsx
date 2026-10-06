import WorshipSchedule from '@/components/mizan/WorshipSchedule';
import GoodDeeds from '@/components/mizan/GoodDeeds';
import ManualInput from '@/components/mizan/ManualInput';
import BadDeeds from '@/components/mizan/BadDeeds';
import MajorSins from '@/components/mizan/MajorSins';
import Expiation from '@/components/mizan/Expiation';
import NarEntryLink from '@/components/mizan/NarEntryLink';
import IllnessCounter from '@/components/mizan/IllnessCounter';

// أعمالي — تسجيل الأعمال والعدادات: الصلوات والعبادات، الحسنات والسيئات، التوبة والكفّارات
export default function Aamaali() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground px-5 pt-10 pb-12 rounded-b-3xl">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold gold-text mb-2">الأَعمَال وَالسِّجِلّ</h1>
          <p className="font-display text-base md:text-lg text-amber-100/80">سجّل طاعاتك، واعدل زلّاتك، وطَهِّر بالتكفير والاستغفار</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 -mt-5 space-y-5">
        <WorshipSchedule />
        <GoodDeeds />
        <ManualInput />
        <BadDeeds />
        <MajorSins />
        <Expiation />
        <IllnessCounter />
        <NarEntryLink />
      </main>
    </div>
  );
}