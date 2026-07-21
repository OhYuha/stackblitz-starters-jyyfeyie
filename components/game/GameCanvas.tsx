'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { useGameStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import Player from './Player';

export default function GameCanvas() {
  const router = useRouter();
  const { viewMode, placeId, nickname, setNickname } = useGameStore();
  const [myId] = useState(() => Math.random().toString(36).substring(2, 9));

  useEffect(() => {
    if (!placeId) return;

    const channel = supabase.channel(`place_${placeId}`, {
      config: { presence: { key: myId } },
    });

    channel
      // 1. 타 유저 이동 수신
      .on('broadcast', { event: 'player-move' }, ({ payload }) => {
        if (payload.id !== myId) {
          useGameStore.getState().updatePlayerPosition(payload.id, payload.position);
        }
      })

      // 2. 🚫 선생님 강퇴 신호 수신
      .on('broadcast', { event: 'kick-student' }, ({ payload }) => {
        if (payload.targetId === myId) {
          alert('선생님에 의해 강제 퇴장당했습니다.');
          setNickname('');
          router.replace(`/student/${placeId}`);
        }
      })

      // 3. ✏️ 선생님 닉네임 변경 신호 수신
      .on('broadcast', { event: 'force-change-nickname' }, ({ payload }) => {
        if (payload.targetId === myId) {
          alert(`선생님이 닉네임을 '${payload.newNickname}'(으)로 변경하셨습니다.`);
          setNickname(payload.newNickname);
          // 변경된 닉네임을 Realtime Presence에 업데이트
          channel.track({ id: myId, nickname: payload.newNickname, position: [0, 0.5, 0] });
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
  }, [placeId, myId, nickname, setNickname, router]);

  return (
    <Canvas shadows className="w-full h-full">
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />

      {viewMode === '2D' ? (
        <OrthographicCamera
          makeDefault
          position={[0, 20, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          zoom={35}
        />
      ) : (
        <>
          <PerspectiveCamera makeDefault position={[0, 8, 12]} fov={50} />
          <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 - 0.05} />
        </>
      )}

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>
      <gridHelper args={[50, 50, '#16a34a', '#22c55e']} position={[0, 0.01, 0]} />

      <Player myId={myId} isMe={true} />
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
