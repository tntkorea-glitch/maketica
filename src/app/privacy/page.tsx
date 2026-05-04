import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 — maketica",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 h-14 flex items-center justify-between max-w-3xl mx-auto">
        <Link href="/" className="font-bold text-blue-600">maketica</Link>
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-700">← 홈으로</Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 prose prose-sm prose-gray">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
        <p className="text-sm text-gray-400 mb-10">최종 수정일: 2026년 5월 4일</p>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">1. 수집하는 개인정보 항목</h2>
          <p className="text-sm text-gray-600 leading-relaxed">maketica(이하 "서비스")는 회원가입 및 서비스 이용 과정에서 아래와 같은 개인정보를 수집합니다.</p>
          <ul className="mt-3 space-y-1 text-sm text-gray-600 list-disc pl-5">
            <li>이메일 주소, 이름 (회원가입 시)</li>
            <li>소셜 로그인 정보 (Google 계정 이메일, 프로필 사진)</li>
            <li>출금 시 계좌정보 (예금주, 은행명, 계좌번호)</li>
            <li>서비스 이용 기록, 접속 로그, 쿠키</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">2. 개인정보의 수집 및 이용 목적</h2>
          <ul className="space-y-1 text-sm text-gray-600 list-disc pl-5">
            <li>회원 식별 및 서비스 제공</li>
            <li>캠페인 참여 및 수익 정산 처리</li>
            <li>공지사항 및 서비스 관련 안내 발송</li>
            <li>부정 이용 방지 및 서비스 운영·개선</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">3. 개인정보의 보유 및 이용 기간</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            회원 탈퇴 시 즉시 파기합니다. 단, 관련 법령에 따라 보존이 필요한 정보는 해당 기간 동안 보관합니다.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-gray-600 list-disc pl-5">
            <li>전자상거래 관련 기록: 5년 (전자상거래법)</li>
            <li>접속 로그: 3개월 (통신비밀보호법)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">4. 개인정보의 제3자 제공</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            서비스는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 단, 법령에 의해 요구되는 경우는 예외로 합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">5. 개인정보 처리 위탁</h2>
          <ul className="space-y-1 text-sm text-gray-600 list-disc pl-5">
            <li>Neon (데이터베이스 호스팅)</li>
            <li>Vercel (서버 호스팅)</li>
            <li>Resend (이메일 발송)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">6. 이용자의 권리</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            이용자는 언제든지 개인정보 조회, 수정, 삭제, 처리 정지를 요청할 수 있습니다.
            문의: <a href="mailto:tntkorea@tntkorea.co.kr" className="text-blue-600">tntkorea@tntkorea.co.kr</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">7. 쿠키 사용</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            서비스는 로그인 세션 유지를 위해 쿠키를 사용합니다. 브라우저 설정에서 쿠키를 거부할 수 있으나, 일부 서비스 이용이 제한될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">8. 개인정보 보호책임자</h2>
          <p className="text-sm text-gray-600">
            이메일: <a href="mailto:tntkorea@tntkorea.co.kr" className="text-blue-600">tntkorea@tntkorea.co.kr</a>
          </p>
        </section>
      </main>
    </div>
  );
}
