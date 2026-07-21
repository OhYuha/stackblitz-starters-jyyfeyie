'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import TeacherStudentControl from './TeacherStudentControl';

interface MapObject {
  id: string;
  position: [number, number, number];
  color: string;
}

export default function MapEditor({ mapId }: { mapId: string }) {
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');
  const [objects, setObjects] = useState<MapObject[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadMapData() {
      const { data } = await supabase.from('maps').select('*').eq('id', mapId).single();
      if (data) {
        setViewMode(data.view_mode || '3D');
        if (data.objects) setObjects(data.objects);
      }
    }
    loadMapData();
  }, [mapId]);

  const handleAddBlock = () => {
    const newObj: MapObject = {
      id: Math.random().toString(36).substring(2, 9),
      position: [(Math.random() - 0.5) * 10, 0.5, (Math.random() - 0.5) * 10],
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    };
    setObjects((prev) => [...prev, newObj]);
  };

  const handleSaveMap = async () => {
    setSaving(true);
    await supabase.from('maps').update({ view_mode: viewMode, objects }).eq('id', mapId);
    setSaving(false);
    alert(`맵 저장 완료! (뷰 모드: ${viewMode})`);
  };

  return (
    <div className="relative w-full h-full">
      {/* 🛠️ 상단 툴바 UI */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex items-center gap-4">
          <Link href="/teacher/dashboard" className="text-sm font-semibold text-gray-500 hover:text-gray-800">
            ← 대시보드
          </Link>
          <span className="h-4 w-px bg-gray-300" />
          <h2 className="font-bold text-gray-800">맵 에디터</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('3D')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${viewMode === '3D' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
            >
              3D 모드
            </button>
            <button
              onClick={() => setViewMode('2D')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${viewMode === '2D' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
            >
              2D 모드 (Top-down)
            </button>
          </div>

          <button
            onClick={handleAddBlock}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl text-xs hover:bg-indigo-100 transition"
          >
            + 블록 추가
          </button>

          <button
            onClick={handleSaveMap}
            disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition shadow"
          >
            {saving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </div>

      {/* 👥 선생님 전용 실시간 학생 관리 컨트롤 패널 */}
      <TeacherStudentControl placeId={mapId} />

      {/* 3D / 2D Canvas */}
      <Canvas shadows className="w-full h-full">
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />

        {viewMode === '2D' ? (
          <OrthographicCamera makeDefault position={[0, 20, 0]} rotation={[-Math.PI / 2, 0, 0]} zoom={35} />
        ) : (
          <>
            <PerspectiveCamera makeDefault position={[0, 10, 15]} fov={50} />
            <OrbitControls makeDefault />
          </>
        )}

        <gridHelper args={[50, 50, '#3b82f6', '#93c5fd']} />

        {objects.map((obj) => (
          <mesh key={obj.id} position={obj.position} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={obj.color} />
          </mesh>
        ))}
      </Canvas>
    </div>
  );
}
