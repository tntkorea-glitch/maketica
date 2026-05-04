import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 — maketica",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 h-14 flex items-center justify-between max-w-3xl mx-auto">
        <Link href="/" className="font-bold text-blue-600">maketica</Link>
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-700">← 홈으로</Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">이용약관</h1>
        <p className="text-sm text-gray-400 mb-10">최종 수정일: 2026년 5월 4일</p>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">제1조 (목적)</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            이 약관은 maketica(이하 "서비스")가 제공하는 CPA 제휴마케팅 플랫폼 서비스의 이용 조건 및 절차, 이용자와 서비스 간의 권리·의무 관계를 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">제2조 (정의)</h2>
          <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
            <li><strong>마케터(퍼블리셔)</strong>: 캠페인에 참여해 수익을 창출하는 회원</li>
            <li><strong>광고주(어드버타이저)</strong>: 캠페인을 등록하고 예치금을 충전하는 회원</li>
            <li><strong>CPA(Cost Per Action)</strong>: 특정 행동(상담 신청 등) 완료 시 수수료를 지급하는 광고 방식</li>
            <li><strong>전환</strong>: 트래킹 링크를 통해 발생한 유효한 광고 액션</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">제3조 (서비스 이용)</h2>
          <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
            <li>서비스는 만 19세 이상 개인 또는 사업자가 이용할 수 있습니다.</li>
            <li>회원은 하나의 계정만 보유할 수 있으며, 타인의 계정을 이용할 수 없습니다.</li>
            <li>부정 전환(허위 정보 입력, 자기 클릭 등)은 즉시 계정 정지 및 수익 몰수 대상입니다.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">제4조 (수익 정산)</h2>
          <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
            <li>전환은 관리자 검수 후 승인 또는 반려됩니다.</li>
            <li>승인된 전환 수익은 매주 금요일 기준으로 정산 확정됩니다.</li>
            <li>출금 신청은 정산 확정 후 가능하며, 처리 기간은 영업일 기준 3~5일입니다.</li>
            <li>출금 최소 금액은 서비스 정책에 따라 변경될 수 있습니다.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">제5조 (광고주 예치금)</h2>
          <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
            <li>광고주는 캠페인 운영을 위해 사전 예치금을 충전해야 합니다.</li>
            <li>예치금은 전환 승인 시 자동 차감됩니다.</li>
            <li>잔여 예치금은 환불 요청 시 검토 후 환불 처리됩니다.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">제6조 (금지 행위)</h2>
          <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
            <li>허위 전환 데이터 입력</li>
            <li>자동화 도구를 이용한 클릭·전환 조작</li>
            <li>타인의 개인정보를 이용한 전환 등록</li>
            <li>서비스의 정상 운영을 방해하는 행위</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">제7조 (면책)</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            서비스는 천재지변, 시스템 장애, 광고주의 사정으로 인한 캠페인 중단 등 불가항력적 사유로 발생한 손해에 대해 책임지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">제8조 (문의)</h2>
          <p className="text-sm text-gray-600">
            이메일: <a href="mailto:tntkorea@tntkorea.co.kr" className="text-blue-600">tntkorea@tntkorea.co.kr</a>
          </p>
        </section>
      </main>
    </div>
  );
}
