// شدّة اشتعال النار — تزيد بالسيئات وتخبو بالتكفير
export const NAR_LEVELS = [
  { min: 0, name: 'خامدة', desc: 'لا وقودَ لها في صحيفتك — حافظ على ذلك' },
  { min: 1, name: 'جمرٌ متّقد', desc: 'شرارةٌ أولى — أطفئها بالاستغفار' },
  { min: 1000, name: 'لهبٌ يتصاعد', desc: 'ألسنةٌ ترتفع مع كل سيئة' },
  { min: 3000, name: 'سعيرٌ مستعر', desc: 'وَسَيَصْلَوْنَ سَعِيرًا' },
  { min: 8000, name: 'نارٌ تلظّى', desc: 'فَأَنذَرْتُكُمْ نَارًا تَلَظَّىٰ' },
  { min: 20000, name: 'حطمةٌ تأكل ما حولها', desc: 'نَارُ اللَّهِ الْمُوقَدَةُ' },
  { min: 50000, name: 'نارٌ حامية', desc: 'نَارٌ حَامِيَةٌ — بادِر بالتوبة' },
];

export function getNarLevel(bad) {
  const v = Math.max(0, bad);
  let index = 0;
  NAR_LEVELS.forEach((l, i) => { if (v >= l.min) index = i; });
  const level = NAR_LEVELS[index];
  const next = NAR_LEVELS[index + 1] || null;
  const raw = next ? (v - level.min) / (next.min - level.min) : (v - level.min) / level.min;
  const progress = Math.min(1, Math.max(0, raw));
  const intensity = v <= 0 ? 0 : Math.min(1, 0.04 + (index - 1 + progress) / (NAR_LEVELS.length - 2));
  return { index, level, next, progress, intensity, remaining: next ? next.min - v : 0 };
}