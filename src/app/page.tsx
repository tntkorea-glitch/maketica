import Link from "next/link";

const stats = [
  { value: "12,000+", label: "활동 마케터" },
  { value: "850+", label: "진행 캠페인" },
  { value: "98%", label: "정산 정확도" },
  { value: "매주 금요일", label: "정산일" },
];

const categories = [
  { name: "개인회생/법률", range: "5~15만원", icon: "⚖️", hot: true },
  { name: "대출", range: "3~10만원", icon: "💰", hot: true },
  { name: "보험", range: "3~8만원", icon: "🛡️", hot: false },
  { name: "성형/다이어트", range: "2~6만원", icon: "💊", hot: false },
  { name: "뷰티/피부", range: "1~4만원", icon: "✨", hot: false },
  { name: "교육/자격증", range: "1~3만원", icon: "📚", hot: false },
];

const steps = [
  {
    num: "01",
    title: "캠페인 선택",
    desc: "내 채널에 맞는 고단가 캠페인을 골라 신청합니다.",
  },
  {
    num: "02",
    title: "트래킹 링크 발급",
    desc: "승인 즉시 나만의 고유 링크가 발급됩니다.",
  },
  {
    num: "03",
    title: "매주 금요일 정산",
    desc: "확정된 DB 건수만큼 매주 정확하게 입금됩니다.",
  },
];

const features = [
  {
    icon: "📊",
    title: "실시간 대시보드",
    desc: "클릭수·전환수·수익을 실시간으로 확인하세요.",
  },
  {
    icon: "✅",
    title: "투명한 승인율 공개",
    desc: "캠페인별 승인율을 사전에 공개해 예측 가능한 수익 설계가 가능합니다.",
  },
  {
    icon: "🏆",
    title: "등급별 단가 우대",
    desc: "실적이 쌓일수록 더 높은 단가를 받습니다. GOLD 이상은 독점 캠페인 접근.",
  },
  {
    icon: "🔒",
    title: "광고주 예치금 시스템",
    desc: "광고주가 선입금한 예산에서만 정산해 미지급 리스크 제로.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">maketica</span>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#how" className="hover:text-gray-900 transition-colors">이용방법</a>
            <a href="#categories" className="hover:text-gray-900 transition-colors">캠페인</a>
            <a href="#features" className="hover:text-gray-900 transition-colors">특장점</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              로그인
            </Link>
            <Link
              href="/register"
              className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
            >
              무료 시작
            </Link>
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-6">
            국내 최고 단가 CPA 제휴마케팅 플랫폼
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            내 채널로
            <br />
            <span className="text-blue-600">매주 수익</span>을 만드세요
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            블로그·SNS·유튜브로 건당 최대 <strong className="text-gray-800">15만원</strong> 수익.
            <br className="hidden md:block" />
            초보자도 가능한 투명한 CPA 마케팅 플랫폼.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-base transition-colors shadow-lg shadow-blue-200"
            >
              마케터로 시작하기 →
            </Link>
            <Link
              href="/register?role=advertiser"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-full text-base transition-colors border border-gray-200"
            >
              광고주로 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* 통계 */}
      <section className="py-16 px-4 border-y border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-blue-600 mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 이용방법 */}
      <section id="how" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">3단계로 끝나는 수익 구조</h2>
          <p className="text-gray-500 text-center mb-12">복잡한 설정 없이 링크 하나로 시작합니다.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="relative p-6 bg-gray-50 rounded-2xl">
                <span className="text-5xl font-black text-blue-100 absolute top-4 right-4">{s.num}</span>
                <h3 className="text-lg font-bold mb-2 relative">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed relative">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 카테고리 */}
      <section id="categories" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">고단가 캠페인 카테고리</h2>
          <p className="text-gray-500 text-center mb-12">건당 최대 15만원, 진짜 돈 되는 업종만 모았습니다.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div
                key={c.name}
                className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{c.icon}</span>
                  {c.hot && (
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 font-semibold rounded-full">
                      HOT
                    </span>
                  )}
                </div>
                <div className="font-bold text-gray-800 mb-1">{c.name}</div>
                <div className="text-sm font-semibold text-blue-600">건당 {c.range}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 특장점 */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">왜 maketica인가</h2>
          <p className="text-gray-500 text-center mb-12">기존 플랫폼과 다른 4가지 이유</p>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4 p-6 bg-gray-50 rounded-2xl">
                <span className="text-3xl shrink-0">{f.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 광고주 CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">광고주라면?</h2>
          <p className="text-blue-200 mb-8 text-lg">
            12,000명의 마케터가 내 광고를 홍보합니다.
            <br />결과가 날 때만 비용이 발생하는 CPA 구조.
          </p>
          <Link
            href="/register?role=advertiser"
            className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-bold rounded-full transition-colors"
          >
            캠페인 등록하기 →
          </Link>
        </div>
      </section>

      {/* 최하단 CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-gray-500 mb-8">가입비 없음 · 수수료 없음 · 매주 금요일 정산</p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-lg transition-colors shadow-lg shadow-blue-200"
          >
            무료로 시작하기 →
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-10 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span className="font-bold text-gray-600">maketica</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-600 transition-colors">이용약관</a>
            <a href="#" className="hover:text-gray-600 transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-gray-600 transition-colors">광고 표시 가이드</a>
          </div>
          <span>© 2026 maketica. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
