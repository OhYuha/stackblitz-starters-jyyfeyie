import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Next.js에서 제공하는 기본 폰트 적용
const inter = Inter({ subsets: ['latin'] });

// 브라우저 탭 및 검색 엔진에 노출될 메타데이터 설정
export const metadata: Metadata = {
  title: '무무록스 (Mumu-blox)',
  description: '선생님과 학생이 함께 만드는 무궁무진 교육용 메타버스 플랫폼',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
