'use client';

import dynamic from 'next/dynamic';

// 💡 Three.js 캔버스를 서버에서 그리지 않도록 SSR을 꺼줍니다.
const MapEditor = dynamic(() => import('@/components/editor/MapEditor'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50 font-bold text-gray-500">
      🛠️ 3D 에디터 불러오는 중...
    </div>
  ),
});

export default function TeacherEditorPage({ params }: { params: { mapId: string } }) {
  return (
    <main className="w-screen h-screen">
      <MapEditor mapId={params.mapId} />
    </main>
  );
}
