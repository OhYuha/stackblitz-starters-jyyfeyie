'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import GameCanvas from '@/components/game/GameCanvas';
import VirtualJoystick from '@/components/ui/VirtualJoystick';

export default function StudentPlayPage() {
  const router = useRouter();
  const { nickname, placeId, viewMode } = useGameStore();

  useEffect(() => {
    if (!nickname) {
      router.replace(`/student/${placeId}`);
    }
  }, [nickname, placeId, router]);

  if (!nickname) return null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-900 select-none">
      {/* HUD 상단 */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-black/60 text-white px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
        <span className="font-semibold text-sm">{nickname}님</span>
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-gray-200">
          {viewMode} Mode
        </span>
      </div>

      {/* 조작법 안내 */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/60 text-white text-xs px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
        PC: WASD / 모바일: 화면 조이스틱
      </div>

      {/* 📱 모바일 가상 조이스틱 */}
      <VirtualJoystick />

      {/* 3D / 2D Canvas */}
      <GameCanvas />
    </div>
  );
}
