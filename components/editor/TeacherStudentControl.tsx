'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Student {
  id: string;
  nickname: string;
}

export default function TeacherStudentControl({ placeId }: { placeId: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!placeId) return;

    const channel = supabase.channel(`place_${placeId}`);

    // 접속 상태(Presence) 실시간 동기화
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const activeStudents: Student[] = [];

        Object.values(state).forEach((presences: any) => {
          presences.forEach((p: any) => {
            if (p.id && p.nickname) {
              activeStudents.push({ id: p.id, nickname: p.nickname });
            }
          });
        });

        setStudents(activeStudents);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [placeId]);

  // ✏️ 닉네임 강제 변경 브로드캐스트
  const handleChangeNickname = (targetId: string, currentName: string) => {
    const newNickname = prompt(`'${currentName}' 학생의 새 닉네임을 입력하세요:`, currentName);
    if (!newNickname || newNickname === currentName) return;

    supabase.channel(`place_${placeId}`).send({
      type: 'broadcast',
      event: 'force-change-nickname',
      payload: { targetId, newNickname },
    });
  };

  // 🚫 강퇴 브로드캐스트
  const handleKickStudent = (targetId: string, nickname: string) => {
    if (!confirm(`정말로 '${nickname}' 학생을 강퇴하시겠습니까?`)) return;

    supabase.channel(`place_${placeId}`).send({
      type: 'broadcast',
      event: 'kick-student',
      payload: { targetId },
    });
  };

  return (
    <div className="absolute top-20 right-4 z-20 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-slate-800 text-white font-bold text-sm flex justify-between items-center cursor-pointer select-none"
      >
        <span>👥 접속 학생 목록 ({students.length}명)</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="max-h-80 overflow-y-auto p-3 space-y-2">
          {students.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">접속 중인 학생이 없습니다.</p>
          ) : (
            students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs"
              >
                <span className="font-semibold text-gray-800 truncate max-w-[100px]">
                  {student.nickname}
                </span>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleChangeNickname(student.id, student.nickname)}
                    className="px-2 py-1 bg-amber-100 text-amber-700 font-bold rounded hover:bg-amber-200"
                    title="닉네임 변경"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleKickStudent(student.id, student.nickname)}
                    className="px-2 py-1 bg-rose-100 text-rose-700 font-bold rounded hover:bg-rose-200"
                    title="강퇴"
                  >
                    강퇴
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
