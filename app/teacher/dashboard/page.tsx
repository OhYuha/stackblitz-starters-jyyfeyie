'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface MapItem {
  id: string;
  title: string;
  view_mode: '2D' | '3D';
  created_at: string;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [maps, setMaps] = useState<MapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaps();
  }, []);

  const fetchMaps = async () => {
    const { data, error } = await supabase
      .from('maps')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setMaps(data);
    }
    setLoading(false);
  };

  const handleCreateNewMap = async () => {
    const title = prompt('새 맵의 이름을 입력하세요:', '무궁무진 에듀 맵');
    if (!title) return;

    // Supabase DB에 신규 맵 데이터 추가
    const { data, error } = await supabase
      .from('maps')
      .insert([{ title, view_mode: '3D', objects: [] }])
      .select()
      .single();

    if (error) {
      // DB 통신 실패 시 임시 ID로 에디터 진입 (테스트용)
      const mockId = Math.random().toString(36).substring(2, 9);
      router.push(`/teacher/editor/${mockId}`);
    } else if (data) {
      router.push(`/teacher/editor/${data.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              선생님 대시보드
            </h1>
            <p className="text-sm text-gray-500">
              학생들을 위한 플레이스를 생성하고 관리하세요.
            </p>
          </div>
          <button
            onClick={handleCreateNewMap}
            className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            + 새 플레이스 만들기
          </button>
        </header>

        {loading ? (
          <div className="text-center py-12 text-gray-400">
            맵 목록을 불러오는 중...
          </div>
        ) : maps.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">
              아직 제작된 플레이스가 없습니다.
            </p>
            <button
              onClick={handleCreateNewMap}
              className="px-4 py-2 bg-blue-100 text-blue-600 font-medium rounded-lg hover:bg-blue-200"
            >
              첫 맵 만들기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {maps.map((map) => (
              <div
                key={map.id}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                      map.view_mode === '2D'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {map.view_mode} 맵
                  </span>
                  <span className="text-xs text-gray-400">
                    ID: {map.id.substring(0, 8)}...
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-6">
                  {map.title}
                </h3>

                <div className="flex gap-2">
                  <Link
                    href={`/teacher/editor/${map.id}`}
                    className="flex-1 text-center py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 text-sm"
                  >
                    맵 수정하기
                  </Link>
                  <Link
                    href={`/student/${map.id}`}
                    target="_blank"
                    className="flex-1 text-center py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 text-sm"
                  >
                    학생용 초대링크
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
