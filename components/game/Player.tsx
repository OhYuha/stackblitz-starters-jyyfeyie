'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

interface PlayerProps {
  myId: string;
  isMe?: boolean;
}

export default function Player({ myId, isMe = false }: PlayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { nickname, placeId, joystickInput } = useGameStore();
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!isMe) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isMe]);

  useFrame((_, delta) => {
    if (!isMe || !meshRef.current) return;

    const speed = 6 * delta;
    let moveX = 0;
    let moveZ = 0;

    // 1. 키보드 입력 처리
    if (keys.current['w'] || keys.current['arrowup']) moveZ -= 1;
    if (keys.current['s'] || keys.current['arrowdown']) moveZ += 1;
    if (keys.current['a'] || keys.current['arrowleft']) moveX -= 1;
    if (keys.current['d'] || keys.current['arrowright']) moveX += 1;

    // 2. 모바일 조이스틱 입력 연동
    if (joystickInput.x !== 0 || joystickInput.y !== 0) {
      moveX = joystickInput.x;
      moveZ = joystickInput.y;
    }

    if (moveX !== 0 || moveZ !== 0) {
      meshRef.current.position.x += moveX * speed;
      meshRef.current.position.z += moveZ * speed;

      // 위치 변동 시 Supabase Broadcast 전송
      const currentPos: [number, number, number] = [
        meshRef.current.position.x,
        meshRef.current.position.y,
        meshRef.current.position.z,
      ];

      supabase.channel(`place_${placeId}`).send({
        type: 'broadcast',
        event: 'player-move',
        payload: { id: myId, position: currentPos },
      });
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#2563eb" />

      <Text
        position={[0, 1.2, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {nickname || '학생'}
      </Text>
    </mesh>
  );
}
