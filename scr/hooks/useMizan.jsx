const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';

import { DEFAULT_SEASONS, resolveActiveMultiplier, multiplierCovers } from '@/lib/virtueSeasons';

const STORAGE_KEY = 'mizan_al_akhirah_v1';

const defaultState = {
  totalGood: 0, totalBad: 0, log: [], verseLikedDates: {}, forgiveCount: 0,
  illnessCount: 0, patienceCount: 0, multiplier: 1, multiplierLabel: null,
  dailyWorship: {}, verseProgress: {},
  multipliers: DEFAULT_SEASONS, combinationRule: 'highest-priority',
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultState, ...JSON.parse(raw), multipliers: DEFAULT_SEASONS };
  } catch (e) {}
  return defaultState;
}

const MizanContext = createContext(null);

export function MizanProvider({ children }) {
  const [state, setState] = useState(load);
  const [repentance, setRepentance] = useState(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    try {
      const { multipliers, ...rest } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    } catch (e) {}
  }, [state]);

  // تحميل المواسم من قاعدة البيانات (أفضل جهد) — عند الفشل نبقى على الإعدادات الافتراضية
  const loadMultipliers = useCallback(async () => {
    try {
      const page = await db.entities.VirtueMultiplier.filter({}, { sort: '-priority', limit: 200 });
      const items = page.items || page;
      if (Array.isArray(items) && items.length) {
        setState(prev => ({ ...prev, multipliers: items }));
      }
    } catch (e) { /* نستخدم الإعدادات الافتراضية */ }
  }, []);

  useEffect(() => { loadMultipliers(); }, [loadMultipliers]);

  // تحديث المعامل النشط تلقائيًا حسب الزمن (كل دقيقة)
  const refreshActive = useCallback(() => {
    const now = new Date();
    const info = resolveActiveMultiplier(stateRef.current.multipliers, now, stateRef.current.combinationRule);
    setState(prev => (prev.multiplier === info.multiplier && prev.multiplierLabel === info.name ? prev
      : { ...prev, multiplier: info.multiplier, multiplierLabel: info.name }));
  }, []);
  useEffect(() => {
    refreshActive();
    const t = setInterval(refreshActive, 60000);
    return () => clearInterval(t);
  }, [refreshActive]);

  // حلّ المعامل الفعّال لعملٍ بتاريخ معيّن (للإدخال اليدوي بأثر رجعي)
  const resolveMultiplier = useCallback((date, deedId) => {
    const s = stateRef.current;
    const info = resolveActiveMultiplier(s.multipliers, date || new Date(), s.combinationRule);
    if (deedId && !multiplierCovers(info, deedId)) {
      return { ...info, multiplier: 1, name: 'يومٌ عادي', periodLabel: 'يومٌ عادي', id: null };
    }
    return info;
  }, []);

  const addGood = useCallback((deed, eventDate) => {
    const when = eventDate ? new Date(eventDate) : new Date();
    const info = resolveMultiplier(when, deed.id);
    const base = deed.points;
    const final = Math.round(base * info.multiplier);
    const name = info.multiplier > 1 ? `${deed.name} (×${info.multiplier.toLocaleString('ar-EG')})` : deed.name;
    const entry = {
      id: Date.now() + Math.random(), deedId: deed.id, name, points: final, type: 'good', timestamp: when.getTime(),
      baseScore: base, multiplier: info.multiplier, multiplierName: info.name, multiplierId: info.id,
      multiplierPeriod: info.periodLabel, finalScore: final, calculatedAt: when.getTime(),
      source: eventDate ? 'manual' : 'auto',
    };
    setState(prev => ({ ...prev, totalGood: prev.totalGood + final, log: [entry, ...prev.log].slice(0, 2000) }));
  }, [resolveMultiplier]);

  const setMultiplier = useCallback((multiplier, label) => {
    setState(prev => ({ ...prev, multiplier: multiplier || 1, multiplierLabel: label || null }));
  }, []);

  const addBad = useCallback((deed) => {
    const base = Math.abs(deed.points);
    const entry = {
      id: Date.now() + Math.random(), deedId: deed.id, name: deed.name, points: deed.points, type: 'bad', timestamp: Date.now(),
      baseScore: base, multiplier: 1, multiplierName: '—', finalScore: deed.points, calculatedAt: Date.now(), source: 'auto',
    };
    setState(prev => ({ ...prev, totalBad: prev.totalBad + base, log: [entry, ...prev.log].slice(0, 2000) }));
    setRepentance(entry);
  }, []);

  const forgive = useCallback(() => {
    if (!repentance) return;
    setState(prev => ({ ...prev, totalBad: Math.max(0, prev.totalBad - Math.abs(repentance.points)), forgiveCount: (prev.forgiveCount || 0) + 1 }));
    setRepentance(null);
  }, [repentance]);

  const dismissRepentance = useCallback(() => setRepentance(null), []);

  const addManual = useCallback((count, perPoint = 10, datetime) => {
    const base = Math.max(0, count) * perPoint;
    if (base <= 0) return;
    const when = datetime ? new Date(datetime) : new Date();
    const info = resolveMultiplier(when);
    const final = Math.round(base * info.multiplier);
    const label = info.multiplier > 1 ? `إدخال يدوي (${count}) (×${info.multiplier.toLocaleString('ar-EG')})` : `إدخال يدوي للتسابيح (${count})`;
    const entry = {
      id: Date.now() + Math.random(), deedId: 'manual', name: label, points: final, type: 'good', timestamp: when.getTime(),
      baseScore: base, multiplier: info.multiplier, multiplierName: info.name, multiplierId: info.id,
      multiplierPeriod: info.periodLabel, finalScore: final, calculatedAt: when.getTime(), source: 'manual',
    };
    setState(prev => ({ ...prev, totalGood: prev.totalGood + final, log: [entry, ...prev.log].slice(0, 2000) }));
  }, [resolveMultiplier]);

  const addIllness = useCallback(() => {
    const reduce = 500;
    setState(prev => {
      const entry = { id: Date.now() + Math.random(), deedId: 'illness', name: 'تكفيرٌ بالمرض', points: reduce, type: 'expiation', timestamp: Date.now() };
      return { ...prev, totalBad: Math.max(0, prev.totalBad - reduce), illnessCount: (prev.illnessCount || 0) + 1, log: [entry, ...prev.log].slice(0, 2000) };
    });
  }, []);

  const addPatience = useCallback(() => {
    const reduce = 300;
    setState(prev => {
      const entry = { id: Date.now() + Math.random(), deedId: 'patience', name: 'أجرُ الصبر على البلاء', points: reduce, type: 'expiation', timestamp: Date.now() };
      return { ...prev, totalBad: Math.max(0, prev.totalBad - reduce), patienceCount: (prev.patienceCount || 0) + 1, log: [entry, ...prev.log].slice(0, 2000) };
    });
  }, []);

  const toggleDailyWorship = useCallback((dateKey, task) => {
    const when = new Date();
    setState(prev => {
      const day = prev.dailyWorship[dateKey] || {};
      if (day[task.id]) {
        const { [task.id]: _r, ...rest } = day;
        return { ...prev, dailyWorship: { ...prev.dailyWorship, [dateKey]: rest }, totalGood: Math.max(0, prev.totalGood - task.points) };
      }
      const info = resolveActiveMultiplier(prev.multipliers, when, prev.combinationRule);
      const cov = multiplierCovers(info, task.id);
      const mult = cov ? info.multiplier : 1;
      const final = Math.round(task.points * mult);
      const name = mult > 1 ? `${task.name} (×${mult.toLocaleString('ar-EG')})` : task.name;
      const entry = { id: Date.now() + Math.random(), deedId: task.id, name, points: final, type: 'good', timestamp: when.getTime(), baseScore: task.points, multiplier: mult, multiplierName: cov ? info.name : 'يومٌ عادي', multiplierId: cov ? info.id : null, finalScore: final, calculatedAt: when.getTime(), source: 'auto' };
      return { ...prev, dailyWorship: { ...prev.dailyWorship, [dateKey]: { ...day, [task.id]: true } }, totalGood: prev.totalGood + final, log: [entry, ...prev.log].slice(0, 2000) };
    });
  }, []);

  const toggleVerseProgress = useCallback((dateKey, field, points) => {
    const when = new Date();
    setState(prev => {
      const vp = prev.verseProgress[dateKey] || {};
      if (vp[field]) {
        return { ...prev, verseProgress: { ...prev.verseProgress, [dateKey]: { ...vp, [field]: false } }, totalGood: Math.max(0, prev.totalGood - points) };
      }
      const info = resolveActiveMultiplier(prev.multipliers, when, prev.combinationRule);
      const mult = info.multiplier;
      const pts = Math.round(points * mult);
      const names = { tilawah: 'تلاوة آية اليوم', tadabbur: 'تدبر آية اليوم', hifz: 'حفظ آية اليوم' };
      const name = mult > 1 ? `${names[field]} (×${mult.toLocaleString('ar-EG')})` : names[field];
      const entry = { id: Date.now() + Math.random(), deedId: `verse-${field}`, name, points: pts, type: 'good', timestamp: when.getTime(), baseScore: points, multiplier: mult, multiplierName: info.name, multiplierId: info.id, finalScore: pts, calculatedAt: when.getTime(), source: 'auto' };
      return { ...prev, verseProgress: { ...prev.verseProgress, [dateKey]: { ...vp, [field]: true } }, totalGood: prev.totalGood + pts, log: [entry, ...prev.log].slice(0, 2000) };
    });
  }, []);

  const toggleVerseLike = useCallback((dateKey) => {
    setState(prev => {
      const liked = prev.verseLikedDates[dateKey];
      const entry = { id: Date.now() + Math.random(), deedId: 'verse-like', name: 'تفاعل قلبي مع آية اليوم', points: 50, type: 'good', timestamp: Date.now(), baseScore: 50, multiplier: 1, multiplierName: '—', finalScore: 50, calculatedAt: Date.now(), source: 'auto' };
      return {
        ...prev,
        verseLikedDates: { ...prev.verseLikedDates, [dateKey]: !liked },
        totalGood: liked ? prev.totalGood : prev.totalGood + 50,
        log: liked ? prev.log : [entry, ...prev.log].slice(0, 2000),
      };
    });
  }, []);

  const setCombinationRule = useCallback((rule) => setState(prev => ({ ...prev, combinationRule: rule })), []);

  const value = {
    state, addGood, addBad, forgive, repentance, dismissRepentance, addManual, addIllness, addPatience,
    toggleVerseLike, setMultiplier, toggleDailyWorship, toggleVerseProgress,
    loadMultipliers, resolveMultiplier, setCombinationRule,
  };
  return <MizanContext.Provider value={value}>{children}</MizanContext.Provider>;
}

export function useMizan() {
  const ctx = useContext(MizanContext);
  if (!ctx) throw new Error('useMizan must be used within MizanProvider');
  return ctx;
}