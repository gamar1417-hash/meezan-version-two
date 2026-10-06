import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useMizan } from '@/hooks/useMizan';
import { getJannahLevel } from '@/lib/jannahLevels';
import Jannah3DScene from '@/components/jannah3d/Jannah3DScene';
import JannahLevelHud from '@/components/jannah3d/JannahLevelHud';
import ServiceRing from '@/components/jannah3d/ServiceRing';
import ServedPhoto from '@/components/jannah3d/ServedPhoto';
import PalaceRoomBar from '@/components/jannah3d/PalaceRoomBar';
import MazidInfo from '@/components/jannah3d/MazidInfo';
import EmptyJannahNotice from '@/components/jannah3d/EmptyJannahNotice';
import JannahControls from '@/components/jannah3d/JannahControls';

export default function Jannah3D() {
  const { state } = useMizan();
  const empty = state.totalGood <= 0;
  const hasPalace = getJannahLevel(state.totalGood).level.palaces > 0;
  const [showGreeting, setShowGreeting] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [palace, setPalace] = useState(null);
  const [room, setRoom] = useState(0);
  const [ringOpen, setRingOpen] = useState(false);
  const [served, setServed] = useState(null);
  const [mazidOpen, setMazidOpen] = useState(false);
  const sceneRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setShowGreeting(false), 5000);
    const onFirst = () => { sceneRef.current?.playSalam(); window.removeEventListener('pointerdown', onFirst); };
    window.addEventListener('pointerdown', onFirst);
    return () => { clearTimeout(t); window.removeEventListener('pointerdown', onFirst); };
  }, []);

  const triggerMazid = () => {
    sceneRef.current?.triggerMazid();
    setFlashing(true);
    setMazidOpen(true);
    setTimeout(() => setFlashing(false), 1400);
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sceneRef.current?.setSound(next);
  };

  const onPalaceChange = (i) => { setPalace(i); setServed(null); };
  const pick = (s) => { setRingOpen(false); setServed(s); };

  return (
    <div dir="rtl" className="fixed inset-0 bg-black overflow-hidden">
      <Jannah3DScene ref={sceneRef} totalGood={state.totalGood} onPalaceChange={onPalaceChange} onRoomChange={setRoom} />

      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle at 50% 60%, rgba(255,236,179,0.9), rgba(255,200,120,0.4) 40%, transparent 75%)',
          opacity: flashing ? 1 : 0,
        }}
      />

      <div className="absolute top-0 inset-x-0 z-20 p-4 flex items-start justify-between pointer-events-none">
        <Link
          to="/"
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/35 backdrop-blur-md text-amber-50 text-xs font-body border border-white/15 hover:bg-black/50 transition"
        >
          <ArrowRight className="w-4 h-4" /> رجوع
        </Link>
        <JannahLevelHud totalGood={state.totalGood} />
      </div>

      {empty ? (
        <EmptyJannahNotice />
      ) : (
        <>
          {showGreeting && palace === null && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="text-center px-8">
                <p className="font-display text-3xl md:text-5xl font-bold text-amber-50 drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
                  ادخلوها بسلامٍ آمنين
                </p>
                <p className="font-body text-sm md:text-base text-amber-200/90 mt-3 drop-shadow">
                  روضتك تتّسع مع كل حسنة — عشبًا ونخلًا، ثم قصورًا وأنهارًا
                </p>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 inset-x-0 z-20 p-4 flex flex-col items-center gap-3">
            {palace !== null && <PalaceRoomBar room={room} totalGood={state.totalGood} onPick={(i) => sceneRef.current?.goToRoom(i)} />}
            <JannahControls
              inside={palace !== null}
              hasPalace={hasPalace}
              soundOn={soundOn}
              onRing={() => setRingOpen(true)}
              onMazid={triggerMazid}
              onExit={() => sceneRef.current?.exitPalace()}
              onSound={toggleSound}
            />
          </div>
        </>
      )}

      <ServiceRing open={ringOpen} totalGood={state.totalGood} onClose={() => setRingOpen(false)} onPick={pick} />
      <ServedPhoto service={served} onClose={() => setServed(null)} />
      <MazidInfo open={mazidOpen} onClose={() => setMazidOpen(false)} />
    </div>
  );
}