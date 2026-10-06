// عمارة الجنة — قصرك يبدأ مدخلًا بسيطًا ثم يُعمر ويزداد جمالًا مع كل حسنة
export const PALACE_STAGES = [
  { min: 1, variant: 'gate', name: 'مدخلٌ بسيط' },
  { min: 1000, variant: 'pavilion', name: 'جوسقٌ صغير' },
  { min: 5000, variant: 'pearl', name: 'قصرٌ من لؤلؤ' },
  { min: 60000, variant: 'grand', name: 'قصرٌ عامر' },
  { min: 400000, variant: 'gold', name: 'قصورٌ من ذهبٍ ولؤلؤ' },
];

export function getPalaceStage(total) {
  let index = -1;
  PALACE_STAGES.forEach((s, i) => { if (total >= s.min) index = i; });
  return { stage: PALACE_STAGES[index] || null, next: PALACE_STAGES[index + 1] || null };
}

// القصر الأول يمرّ بكل المراحل، والقصور التالية تظهر بالمرحلة الحالية
export function palaceVariant(total, i) {
  const { stage } = getPalaceStage(total);
  if (!stage) return null;
  if (stage.variant === 'gold') return i % 2 === 0 ? 'gold' : 'grand';
  return stage.variant;
}

export const countUnlocked = (items, total) => items.filter((x) => total >= x.min).length;