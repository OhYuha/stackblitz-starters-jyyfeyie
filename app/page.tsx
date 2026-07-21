import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 🔝 상단 헤더 (로고 영역) */}
      <header className="w-full py-4 px-6 flex justify-center items-center bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="flex items-center gap-3">
          {/* public/mumu.svg 로고 불러오기 */}
          <Image
            src="/mumu.svg"
            alt="무무록스 로고"
            width={36}
            height={36}
            priority
          />
          <span className="text-xl font-extrabold text-gray-800 tracking-tight">
            무무록스{' '}
            <span className="text-xs font-semibold text-blue-600 ml-1">
              Mumu-blox
            </span>
          </span>
        </div>
      </header>

      {/* 🧭 메인 콘텐츠 (선생님 / 학생 반반 분할) */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center">
        {/* 👨‍🏫 선생님 영역 (왼쪽) */}
        <section className="flex flex-col items-center justify-center w-full md:w-1/2 h-full py-12 px-8 bg-white border-b md:border-b-0 md:border-r border-gray-200">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
            선생님
          </h1>
          <p className="text-gray-500 mb-8 text-center leading-relaxed">
            나만의 교육용 메타버스 맵을 제작하고
            <br />
            학생들을 초대해 함께 학습해 보세요.
          </p>

          <Link
            href="/teacher/dashboard"
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            선생님으로 시작하기 (로그인)
          </Link>
        </section>

        {/* 🎒 학생 영역 (오른쪽) */}
        <section className="flex flex-col items-center justify-center w-full md:w-1/2 h-full py-12 px-8 bg-gray-50">
          <h1 className="text-4xl md:text-5xl font-bold text-green-600 mb-4">
            학생
          </h1>
          <p className="text-gray-500 mb-8 text-center leading-relaxed">
            복잡한 가입 없이 선생님이 알려준 초대 코드와
            <br />
            사용할 닉네임만 입력하고 바로 입장하세요!
          </p>

          <form className="flex flex-col gap-4 w-full max-w-sm">
            <input
              type="text"
              placeholder="초대 코드 (Place ID)"
              className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              required
            />
            <input
              type="text"
              placeholder="사용할 닉네임"
              className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              required
            />

            <button
              type="button"
              className="mt-2 px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition shadow-lg hover:shadow-xl"
            >
              플레이스 입장하기
            </button>
          </form>
        </section>
      </main>

      {/* 📄 하단 푸터 (저작권 표시) */}
      <footer className="w-full py-4 text-center text-xs text-gray-400 bg-white border-t border-gray-200">
        <p>
          무궁무진클래스 | 불붙은곰
        </p>
      </footer>
    </div>
  );
}
