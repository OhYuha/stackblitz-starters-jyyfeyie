'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
} from '@react-three/drei';
import { useGameStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import Player from './Player';

export default function GameCanvas() {
  const { viewMode, placeId, nickname } = useGameStore();
  const [myId] = useState(() => Math.random().toString(36).substring(2, 9));

  useEffect(() => {
    if (!placeId) return;

    // Supabase Realtime 멀티플레이어 채널 바인딩
    const channel = supabase.channel(`place_${placeId}`, {
      config: { presence: { key: myId } },
    });

    channel
      .on('broadcast', { event: 'player-move' }, ({ payload }) => {
        // 타 유저 이동 신호 수신
        if (payload.id !== myId) {
          useGameStore
            .getState()
            .updatePlayerPosition(payload.id, payload.position);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ id: myId, nickname, position: [0, 0.5, 0] });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [placeId, myId, nickname]);

  return (
    <Canvas shadows className="w-full h-full">
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />

      {/* 선생님 설정에 따른 카메라 분기 */}
      {viewMode === '2D' ? (
        // 2D 뷰: 탑다운 직교 카메라 (Top-down view)
        <OrthographicCamera
          makeDefault
          position={[0, 20, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          zoom={35}
        />
      ) : (
        // 3D 뷰: 원근 카메라 + OrbitControls 시점 회전
        <>
          <PerspectiveCamera makeDefault position={[0, 8, 12]} fov={50} />
          <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 - 0.05} />
        </>
      )}

      {/* 기본 바닥 지형 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>
      <gridHelper
        args={[50, 50, '#16a34a', '#22c55e']}
        position={[0, 0.01, 0]}
      />

      {/* 본인 캐릭터 */}
      <Player myId={myId} isMe={true} />

      {/* 다른 학생 캐릭터들 */}
      <OtherPlayers currentMyId={myId} />
    </Canvas>
  );
}

function OtherPlayers({ currentMyId }: { currentMyId: string }) {
  const players = useGameStore((state) => state.players);

  return (
    <>
      {Object.entries(players).map(([id, player]) => {
        if (id === currentMyId) return null;
        return (
          <mesh key={id} position={player.position}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        );
      })}
    </>
  );
}
