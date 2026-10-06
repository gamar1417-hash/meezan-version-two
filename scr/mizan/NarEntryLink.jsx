import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';

export default function NarEntryLink() {
  return (
    <Link to="/nar-3d" className="block rounded-2xl border border-orange-500/40 bg-gradient-to-l from-red-950/30 via-orange-950/20 to-card dark:from-red-900/20 dark:to-orange-900/15 p-4 hover:opacity-90 transition relative overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center shadow-inner">
          <Flame className="w-6 h-6 text-orange-50" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-sm font-bold text-orange-600 dark:text-orange-300">جولة النار ثلاثية الأبعاد</h3>
          <p className="font-body text-[10px] text-muted-foreground mt-0.5">نارٌ تتأجّج وتتّسع بالسيئات وتخبو بالتوبة والتكفير</p>
        </div>
        <span className="font-display text-xs text-orange-600 dark:text-orange-300 shrink-0">ادخل ←</span>
      </div>
    </Link>
  );
}