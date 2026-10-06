const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Users, BookOpen, ScrollText, Plus, UserPlus, Clock, Check, X } from 'lucide-react';
import GroupSchedule from '@/components/mizan/GroupSchedule';

const TYPE_META = {
  'تحفيظ': { icon: BookOpen, color: 'from-emerald-500/15 to-emerald-500/5 border-emerald-400/30 text-emerald-600 dark:text-emerald-300' },
  'تفسير': { icon: ScrollText, color: 'from-amber-500/15 to-amber-500/5 border-amber-400/30 text-amber-600 dark:text-amber-300' },
};

export default function QuranGroups() {
  const [groups, setGroups] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [myName, setMyName] = useState('');
  const [tab, setTab] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [busy, setBusy] = useState(null);

  const [form, setForm] = useState({ name: '', type: 'تحفيظ', description: '', surahScope: '', leaderName: '', meetingTime: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [g, m] = await Promise.all([
        db.entities.Group.list('-created_date', 100),
        db.entities.GroupMember.list('-created_date', 500),
      ]);
      setGroups(g);
      setMemberships(m);
    } catch (e) {
      // network/entity errors handled silently for UX
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    db.auth.isAuthenticated().then(ok => {
      if (!ok) return;
      db.auth.me().then(u => { setUser(u); if (u?.full_name) setMyName(u.full_name); }).catch(() => {});
    });
  }, [load]);

  const memberCount = (gid) => memberships.filter(m => m.groupId === gid).length;
  const isJoined = (gid) => {
    if (user) return memberships.some(m => m.groupId === gid && m.userId === user.id);
    return !!myName && memberships.some(m => m.groupId === gid && m.memberName === myName);
  };
  const myMembership = (gid) => memberships.find(m =>
    m.groupId === gid && (user ? m.userId === user.id : m.memberName === myName)
  );

  const join = async (group) => {
    const name = user?.full_name || myName.trim();
    if (!name) return;
    setBusy(group.id);
    try {
      await db.entities.GroupMember.create({ groupId: group.id, memberName: name, userId: user?.id || '' });
      await load();
    } catch (e) { /* ignore */ }
    setBusy(null);
  };

  const leave = async (group) => {
    const m = myMembership(group.id);
    if (!m) return;
    setBusy(group.id);
    try {
      await db.entities.GroupMember.delete(m.id);
      await load();
    } catch (e) { /* ignore */ }
    setBusy(null);
  };

  const create = async () => {
    if (!form.name.trim()) return;
    setBusy('create');
    try {
      await db.entities.Group.create({
        name: form.name.trim(),
        type: form.type,
        description: form.description.trim(),
        surahScope: form.surahScope.trim(),
        leaderName: form.leaderName.trim() || (user?.full_name || myName.trim()),
        meetingTime: form.meetingTime.trim(),
      });
      setForm({ name: '', type: 'تحفيظ', description: '', surahScope: '', leaderName: '', meetingTime: '' });
      setShowCreate(false);
      await load();
    } catch (e) { /* ignore */ }
    setBusy(null);
  };

  const filtered = tab === 'all' ? groups : groups.filter(g => g.type === tab);

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl font-bold mb-1">حلقات التحفيظ والتفسير</h2>
      <p className="font-body text-sm text-muted-foreground mb-4">انضمّ إلى حلقةٍ تُعينك على كتاب الله — حفظًا أو تفسيرًا — في صحبةٍ تُذكّر وتربط القلوب بالقرآن</p>

      {/* Name bar */}
      <div className="rounded-2xl bg-card border border-accent/20 p-3 mb-4">
        <label className="font-body text-xs text-muted-foreground block mb-1.5">اسمك للمشاركة في الحلقات</label>
        <input
          value={myName}
          onChange={e => setMyName(e.target.value)}
          placeholder="اكتب اسمك..."
          disabled={!!user?.full_name}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-center font-body focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-70"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[{ k: 'all', l: 'الكل' }, { k: 'تحفيظ', l: 'تحفيظ' }, { k: 'تفسير', l: 'تفسير' }].map(t => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`flex-1 rounded-xl py-2 font-body text-sm font-medium transition ${tab === t.k ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >{t.l}</button>
        ))}
      </div>

      {/* Create button */}
      <button
        onClick={() => setShowCreate(s => !s)}
        className="w-full mb-4 rounded-xl border border-dashed border-accent/40 bg-accent/5 py-2.5 font-body text-sm font-medium text-accent flex items-center justify-center gap-1.5 hover:bg-accent/10 transition"
      >
        <Plus className="w-4 h-4" /> أنشئ حلقة جديدة
      </button>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="rounded-2xl bg-card border border-accent/20 p-4 space-y-3">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="اسم الحلقة" className="w-full rounded-xl border border-input bg-background px-3 py-2 text-center font-body focus:outline-none focus:ring-2 focus:ring-accent" />
              <div className="flex gap-2">
                {['تحفيظ', 'تفسير'].map(t => (
                  <button key={t} onClick={() => setForm({ ...form, type: t })} className={`flex-1 rounded-xl py-2 font-body text-sm ${form.type === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{t}</button>
                ))}
              </div>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="وصف الحلقة وأهدافها" rows={2} className="w-full rounded-xl border border-input bg-background px-3 py-2 font-body focus:outline-none focus:ring-2 focus:ring-accent" />
              <input value={form.surahScope} onChange={e => setForm({ ...form, surahScope: e.target.value })} placeholder="النطاق (مثل: جزء عمّ، سورة الكهف)" className="w-full rounded-xl border border-input bg-background px-3 py-2 text-center font-body focus:outline-none focus:ring-2 focus:ring-accent" />
              <input value={form.meetingTime} onChange={e => setForm({ ...form, meetingTime: e.target.value })} placeholder="موعد اللقاء (مثل: بعد الفجر)" className="w-full rounded-xl border border-input bg-background px-3 py-2 text-center font-body focus:outline-none focus:ring-2 focus:ring-accent" />
              <button onClick={create} disabled={busy === 'create' || !form.name.trim()} className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 font-body font-medium flex items-center justify-center gap-1.5 hover:opacity-90 transition disabled:opacity-50">
                {busy === 'create' ? 'جارٍ الإنشاء...' : <><Plus className="w-4 h-4" /> إنشاء الحلقة</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Groups list */}
      {loading ? (
        <div className="text-center py-10 text-muted-foreground font-body text-sm">جارٍ تحميل الحلقات...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground font-body text-sm">
          <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
          لا توجد حلقات بعد — كن أول من ينشئ حلقة
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(g => {
            const meta = TYPE_META[g.type] || TYPE_META['تحفيظ'];
            const Icon = meta.icon;
            const joined = isJoined(g.id);
            const count = memberCount(g.id);
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border bg-gradient-to-b ${meta.color} p-4`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-background/60 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-bold leading-snug">{g.name}</h3>
                    {g.description && <p className="font-body text-xs text-muted-foreground mt-0.5 leading-relaxed">{g.description}</p>}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-muted-foreground font-body">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {count.toLocaleString('ar-EG')} عضو</span>
                      {g.surahScope && <span>📖 {g.surahScope}</span>}
                      {g.meetingTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {g.meetingTime}</span>}
                    </div>
                    {g.leaderName && <p className="font-body text-[10px] text-muted-foreground mt-1">بإشراف: {g.leaderName}</p>}
                  </div>
                </div>
                {joined ? (
                  <button
                    onClick={() => leave(g)}
                    disabled={busy === g.id}
                    className="w-full mt-3 rounded-xl bg-background/50 border border-foreground/10 py-2 font-body text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-background transition disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 text-emerald-600" /> انضممت — انسحب
                  </button>
                ) : (
                  <button
                    onClick={() => join(g)}
                    disabled={busy === g.id || !myName.trim()}
                    className="w-full mt-3 rounded-xl bg-primary text-primary-foreground py-2 font-body text-sm font-medium flex items-center justify-center gap-1.5 hover:opacity-90 transition disabled:opacity-50"
                  >
                    <UserPlus className="w-4 h-4" /> {busy === g.id ? 'جارٍ الانضمام...' : 'انضمام'}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <GroupSchedule groups={groups} memberships={memberships} user={user} myName={myName} />
    </div>
  );
}