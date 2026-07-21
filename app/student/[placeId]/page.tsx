ssr: false,
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export default function StudentLobbyPage({
  params,
}: {
  params: Promise<{ placeId: string }>;
}) {
  const resolvedParams = use(params);
  const placeId = resolvedParams.placeId;

  const router = useRouter();
  const { setNickname, setPlaceId, setViewMode } = useGameStore();

  const [inputNickname, setInputNickname] = useState('');
  const [viewMode, setLocalViewMode] = useState<'2D' | '3D'>('3D');
  const [mapTitle, setMapTitle] = useState('플레이스 로딩 중...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlaceInfo() {
      setPlaceId(placeId);

      // Supabase DB에서 선생님이 설정한 맵 정보 불러오기
      const { data, error } = await supabase
        .from('maps')
        .select('title, view_mode')
        .eq('id', placeId)
        .single();

      if (data && !error) {
        setMapTitle(data.title || '즐거운 메타버스 교실');
        const mode = data.view_mode === '2D' ? '2D' : '3D';
        setLocalViewMode(mode);
        setViewMode(mode);
      } else {
        // 기본값 세팅 (테스트용)
        setMapTitle('무무록스 체험 공간');
        setLocalViewMode('3D');
        setViewMode('3D');
      }
      setLoading(false);
    }

    fetchPlaceInfo();
  }, [placeId, setPlaceId, setViewMode]);

  const handleEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNickname.trim()) return alert('닉네임을 입력해주세요!');

    setNickname(inputNickname.trim());
    router.push(`/student/${placeId}/play`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 font-semibold text-xs rounded-full mb-3">
          선생님이 설정한 [{viewMode}] 모드 공간
        </span>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{mapTitle}</h1>
        <p className="text-sm text-gray-500 mb-6">
          사용할 닉네임을 입력하고 입장해 주세요.
        </p>

        <form onSubmit={handleEnter} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="닉네임 입력 (예: 김무무)"
            value={inputNickname}
            onChange={(e) => setInputNickname(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-lg font-medium"
            maxLength={10}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-md disabled:bg-gray-300"
          >
            게임 입장하기 🚀
          </button>
        </form>
      </div>
    </main>
  );
}
