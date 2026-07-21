'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      // 회원가입
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert(`회원가입 실패: ${error.message}`);
      } else {
        alert('회원가입이 완료되었습니다! 로그인해 주세요.');
        setIsSignUp(false);
      }
    } else {
      // 로그인
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert(`로그인 실패: ${error.message}`);
      } else {
        router.push('/teacher/dashboard');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          {isSignUp ? '선생님 회원가입' : '선생님 로그인'}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          무무록스 대시보드 접근을 위해 인증이 필요합니다.
        </p>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">이메일</label>
            <input
              type="email"
              placeholder="teacher@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">비밀번호</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow disabled:bg-gray-300 mt-2"
          >
            {loading ? '처리 중...' : isSignUp ? '회원가입하기' : '로그인하기'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isSignUp ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 font-semibold underline hover:text-blue-700"
          >
            {isSignUp ? '로그인으로 이동' : '회원가입으로 이동'}
          </button>
        </div>
      </div>
    </div>
  );
}
