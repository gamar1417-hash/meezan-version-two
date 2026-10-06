import JannahGates from '@/components/mizan/JannahGates';
import FireGates from '@/components/mizan/FireGates';
import VirtueOfDay from '@/components/mizan/VirtueOfDay';
import VirtueCalendar from '@/components/mizan/VirtueCalendar';
import VirtueAuditLog from '@/components/mizan/VirtueAuditLog';
import WorldlyBlessings from '@/components/mizan/WorldlyBlessings';
import ArafInfo from '@/components/mizan/ArafInfo';
import ArafBanner from '@/components/mizan/ArafBanner';

// المقامات — أبواب المعاني والتأمل: أبواب الجنة والنار، فضائل الدنيا، تقويم الفضائل
export default function Maqamat() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground px-5 pt-10 pb-12 rounded-b-3xl">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold gold-text mb-2">المَقَامَات وَالأَبْوَاب</h1>
          <p className="font-display text-base md:text-lg text-amber-100/80">تأمّل أبواب الجنة والنار، وفضائل الدنيا، ومواسم أضعاف الحسنات</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 -mt-5 space-y-5">
        <JannahGates />
        <FireGates />
        <VirtueOfDay />
        <VirtueCalendar />
        <WorldlyBlessings />
        <ArafInfo />
        <ArafBanner />
        <VirtueAuditLog />
      </main>
    </div>
  );
}