import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BannerCarousel from "@/components/BannerCarousel";

const categoryLabel: Record<string, string> = {
  LOAN: "대출", INSURANCE: "보험", LEGAL: "개인회생/법률",
  PLASTIC: "성형/다이어트", BEAUTY: "뷰티/피부", HEALTHCARE: "건강/의료",
  EDUCATION: "교육/자격증", REALESTATE: "부동산", IT: "IT/앱/게임",
  FOOD: "식품/다이어트", SHOPPING: "쇼핑", OTHER: "기타",
};

const categoryAccent: Record<string, string> = {
  LOAN: "#F59E0B", INSURANCE: "#3B82F6", LEGAL: "#6366F1",
  PLASTIC: "#EC4899", BEAUTY: "#F472B6", HEALTHCARE: "#10B981",
  EDUCATION: "#8B5CF6", REALESTATE: "#14B8A6", IT: "#06B6D4",
  FOOD: "#22C55E", SHOPPING: "#F97316", OTHER: "#9CA3AF",
};

const categoryBg: Record<string, string> = {
  LOAN: "from-amber-900 to-amber-950",
  INSURANCE: "from-blue-900 to-blue-950",
  LEGAL: "from-indigo-900 to-indigo-950",
  PLASTIC: "from-pink-900 to-pink-950",
  BEAUTY: "from-fuchsia-900 to-fuchsia-950",
  HEALTHCARE: "from-emerald-900 to-emerald-950",
  EDUCATION: "from-violet-900 to-violet-950",
  REALESTATE: "from-teal-900 to-teal-950",
  IT: "from-cyan-900 to-cyan-950",
  FOOD: "from-green-900 to-green-950",
  SHOPPING: "from-orange-900 to-orange-950",
  OTHER: "from-gray-800 to-gray-900",
};

const topEarners = [
  { rank: 1, earnings: "4.74억", change: "+12%" },
  { rank: 2, earnings: "1.16억", change: "+8%" },
  { rank: 3, earnings: "1.13억", change: "+5%" },
  { rank: 4, earnings: "8,618만", change: "+3%" },
  { rank: 5, earnings: "8,266만", change: "±0%" },
];

const topApproval = [
  { name: "모두클린", rate: "100%", up: true },
  { name: "무촌철거 1등", rate: "100%", up: true },
  { name: "코웨이 렌탈", rate: "98.2%", up: true },
  { name: "면역다이어트", rate: "97.4%", up: false },
  { name: "더복력", rate: "96.1%", up: false },
];

const categories = [
  { key: "LEGAL", name: "개인회생/법률", icon: "⚖️", max: "150,000" },
  { key: "LOAN", name: "대출", icon: "💳", max: "100,000" },
  { key: "INSURANCE", name: "보험", icon: "🛡️", max: "80,000" },
  { key: "PLASTIC", name: "성형/다이어트", icon: "💊", max: "60,000" },
  { key: "REALESTATE", name: "부동산/이사", icon: "🏠", max: "50,000" },
  { key: "FOOD", name: "식품/건강", icon: "🌿", max: "30,000" },
];

export default async function Home() {
  const session = await auth();
  if (session) redirect("/dashboard");

  const campaigns = await prisma.campaign.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: {
      id: true, title: true, category: true,
      publisherPrice: true, approvalRate: true, imageUrl: true,
    },
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900">

      {/* ===== HEADER ===== */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center gap-8">
          <Link href="/" className="shrink-0">
            <span className="text-2xl font-black tracking-tight text-gray-900">
              mak<span className="text-indigo-600">e</span>tica
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-500 flex-1">
            <a href="#campaigns" className="hover:text-indigo-600 transition-colors font-medium">캠페인 탐색</a>
            <a href="#earnings" className="hover:text-indigo-600 transition-colors">수익 현황</a>
            <a href="#how" className="hover:text-indigo-600 transition-colors">이용방법</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">고객센터</a>
          </nav>
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <Link href="/login" className="text-sm px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
              로그인
            </Link>
            <Link href="/register" className="text-sm px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">
              무료 시작 →
            </Link>
          </div>
        </div>
      </header>

      <div className="h-16" />

      {/* ===== 배너 캐러셀 ===== */}
      <BannerCarousel />

      {/* ===== 카테고리 필터 바 ===== */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
            <span className="text-xs font-semibold text-gray-400 mr-2 shrink-0">카테고리</span>
            {categories.map((c) => (
              <Link key={c.key} href="/register"
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors border border-gray-200 hover:border-indigo-200"
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
                <span className="text-indigo-600 font-bold">최대 {c.max}원</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ===== 메인 콘텐츠 ===== */}
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex gap-6">

          {/* ── 좌측 메인 ── */}
          <main className="flex-1 min-w-0">

            {/* 통계 바 */}
            <div className="grid grid-cols-4 divide-x divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden mb-8 bg-white">
              {[
                { val: "12,000+", label: "활동 마케터" },
                { val: "850+", label: "진행 캠페인" },
                { val: "98%", label: "정산 정확도" },
                { val: "매주 금요일", label: "정산일" },
              ].map((s) => (
                <div key={s.label} className="py-4 text-center hover:bg-indigo-50 transition-colors">
                  <div className="text-xl font-black text-indigo-600">{s.val}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* 캠페인 목록 */}
            <section id="campaigns">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-black text-gray-900">인기 캠페인</h2>
                  <p className="text-sm text-gray-400 mt-0.5">승인율 높고 단가 좋은 캠페인 모음</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-full font-semibold">최신순</button>
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">단가순</button>
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">승인율순</button>
                </div>
              </div>

              {campaigns.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {campaigns.map((c) => {
                    const accent = categoryAccent[c.category] ?? "#6366F1";
                    const bg = categoryBg[c.category] ?? "from-gray-800 to-gray-900";
                    return (
                      <Link href="/register" key={c.id}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all group"
                      >
                        {/* 이미지 or 플레이스홀더 */}
                        <div className="relative h-44 overflow-hidden">
                          {c.imageUrl ? (
                            <Image
                              src={c.imageUrl}
                              alt={c.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, 400px"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${bg} flex flex-col items-center justify-center p-4`}>
                              <span className="text-xs text-white/40 mb-2">{categoryLabel[c.category]}</span>
                              <span className="text-white font-bold text-sm text-center leading-snug">{c.title}</span>
                            </div>
                          )}
                          {/* 카테고리 뱃지 */}
                          <span
                            className="absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: accent }}
                          >
                            {categoryLabel[c.category]}
                          </span>
                        </div>

                        {/* 정보 */}
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 text-sm mb-3 group-hover:text-indigo-700 transition-colors line-clamp-1">
                            {c.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-400">
                              승인율{" "}
                              <span className="font-semibold text-gray-700">
                                {c.approvalRate != null ? `${c.approvalRate}%` : "비공개"}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] text-gray-400">건당 단가</div>
                              <div className="text-base font-black" style={{ color: accent }}>
                                {c.publisherPrice.toLocaleString()}원
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                /* 캠페인 없을 때 샘플 표시 */
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      cat: "LEGAL", name: "법무법인 서안을 | 개인회생 무료상담",
                      price: 60000, rate: 93,
                      img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=450&fit=crop",
                    },
                    {
                      cat: "HEALTHCARE", name: "면역다이어트 프리미엄 파트너 모집",
                      price: 37000, rate: 100,
                      img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=450&fit=crop",
                    },
                    {
                      cat: "OTHER", name: "모두클린 청소업체 파트너 모집",
                      price: 8000, rate: 100,
                      img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=450&fit=crop",
                    },
                    {
                      cat: "INSURANCE", name: "현대해상 태아보험 마케터 모집",
                      price: 45000, rate: 88,
                      img: "https://images.unsplash.com/photo-1609220136736-443140cfeaa8?w=800&h=450&fit=crop",
                    },
                    {
                      cat: "LOAN", name: "미즈케어 대출 비교 파트너십",
                      price: 32000, rate: 92,
                      img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop",
                    },
                    {
                      cat: "REALESTATE", name: "무촌철거 1등 철거 플랫폼",
                      price: 24000, rate: 100,
                      img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=450&fit=crop",
                    },
                  ].map((c, i) => {
                    const accent = categoryAccent[c.cat] ?? "#6366F1";
                    return (
                      <Link href="/register" key={i}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all group"
                      >
                        <div className="relative h-44 overflow-hidden">
                          <Image
                            src={c.img}
                            alt={c.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                          <span
                            className="absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: accent }}
                          >
                            {categoryLabel[c.cat]}
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 text-sm mb-3 group-hover:text-indigo-700 transition-colors line-clamp-1">
                            {c.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-400">
                              승인율 <span className="font-semibold text-gray-700">{c.rate}%</span>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] text-gray-400">건당 단가</div>
                              <div className="text-base font-black" style={{ color: accent }}>
                                {c.price.toLocaleString()}원
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              <div className="mt-5 text-center">
                <Link href="/register"
                  className="inline-flex items-center gap-2 px-8 py-3 border-2 border-indigo-200 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-sm"
                >
                  캠페인 전체보기 →
                </Link>
              </div>
            </section>

            {/* 이용방법 */}
            <section id="how" className="mt-10 bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-lg font-black text-gray-900 mb-5">3단계로 시작하는 수익 루트</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { step: "01", title: "캠페인 신청", desc: "내 채널에 맞는 캠페인 골라 클릭 한 번으로 신청" },
                  { step: "02", title: "트래킹 링크 발급", desc: "승인 즉시 나만의 전용 링크 자동 발급" },
                  { step: "03", title: "매주 금요일 입금", desc: "확정 DB 건수만큼 정확하게 계좌 입금" },
                ].map((s) => (
                  <div key={s.step}>
                    <div className="text-5xl font-black text-indigo-50 mb-2 leading-none">{s.step}</div>
                    <h3 className="font-bold text-gray-900 mb-1 text-sm">{s.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* ── 우측 사이드바 ── */}
          <aside className="w-[260px] shrink-0 space-y-4" id="earnings">

            {/* 광고주 CTA */}
            <div className="bg-[#0F0F1A] rounded-2xl p-5 text-white">
              <div className="text-xs text-indigo-300 font-semibold mb-2">광고주라면?</div>
              <p className="text-sm font-bold mb-1">12,000명의 마케터가<br />내 광고를 홍보합니다</p>
              <p className="text-xs text-gray-400 mb-4">결과가 날 때만 비용 발생하는 CPA 구조</p>
              <Link href="/register?role=advertiser"
                className="block text-center text-xs font-bold py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
              >
                캠페인 등록하기 →
              </Link>
            </div>

            {/* 누적 수익금 TOP 5 */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-gray-900">누적 수익금 TOP 5</h3>
                <span className="text-[10px] text-gray-400">이번 시즌</span>
              </div>
              <ul className="space-y-3">
                {topEarners.map((e) => (
                  <li key={e.rank} className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0 ${
                      e.rank === 1 ? "bg-yellow-400"
                      : e.rank === 2 ? "bg-gray-400"
                      : e.rank === 3 ? "bg-orange-400"
                      : "bg-gray-200 text-gray-500"
                    }`}>{e.rank}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${100 - (e.rank - 1) * 18}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-14 text-right">{e.earnings}</span>
                    <span className={`text-[10px] font-semibold w-8 ${e.change.startsWith("+") ? "text-emerald-500" : "text-gray-400"}`}>
                      {e.change}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 승인율 TOP */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="text-sm font-black text-gray-900 mb-4">이번 달 승인율 TOP</h3>
              <ul className="space-y-2.5">
                {topApproval.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs">
                    <span className={`text-[10px] ${c.up ? "text-rose-500" : "text-blue-400"}`}>
                      {c.up ? "▲" : "▼"}
                    </span>
                    <span className="flex-1 text-gray-700 font-medium">{c.name}</span>
                    <span className="font-black text-emerald-600">{c.rate}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 공지사항 */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="text-sm font-black text-gray-900 mb-4">공지사항</h3>
              <ul className="space-y-2.5">
                {[
                  { text: "2026년 5월 프로모션 안내", isNew: true },
                  { text: "기업지원파트너 광고 종료 안내", isNew: true },
                  { text: "매주 금요일 정산 시간 안내", isNew: false },
                  { text: "개인정보처리방침 개정 안내", isNew: false },
                ].map((n, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    {n.isNew && (
                      <span className="shrink-0 bg-indigo-600 text-white text-[8px] font-bold px-1 py-0.5 rounded mt-0.5">N</span>
                    )}
                    <span className={`leading-snug ${n.isNew ? "text-gray-800 font-medium" : "text-gray-500"}`}>
                      {n.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 카카오 상담 */}
            <a href="#kakao"
              className="flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 transition-colors rounded-2xl p-4 cursor-pointer"
            >
              <span className="text-2xl">💬</span>
              <div>
                <div className="text-xs font-black text-gray-900">카카오톡 1:1 상담</div>
                <div className="text-[11px] text-gray-700">빠르고 간편하게 문의하세요</div>
              </div>
            </a>
          </aside>
        </div>
      </div>

      {/* ===== 하단 CTA ===== */}
      <section className="bg-indigo-600 py-14">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h2 className="text-2xl font-black mb-1">지금 바로 시작하세요</h2>
            <p className="text-indigo-200 text-sm">가입비 없음 · 수수료 없음 · 매주 금요일 정산</p>
          </div>
          <Link href="/register"
            className="px-8 py-3.5 bg-white hover:bg-gray-100 text-indigo-700 font-black rounded-xl transition-colors text-sm shrink-0"
          >
            무료로 시작하기 →
          </Link>
        </div>
      </section>

      {/* ===== 푸터 ===== */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-start justify-between gap-6 text-xs text-gray-400">
          <div className="space-y-1.5">
            <div className="text-base font-black text-gray-800 mb-2">
              mak<span className="text-indigo-600">e</span>tica
            </div>
            <p>© 2026 maketica. All rights reserved.</p>
            <p>사업자등록번호 : 000-00-00000 | 대표 : 홍길동</p>
            <p>고객센터 : 1588-XXXX | 이메일 : info@maketica.co.kr</p>
          </div>
          <div className="flex gap-4 text-sm">
            <Link href="/terms" className="hover:text-gray-600 transition-colors">이용약관</Link>
            <Link href="/privacy" className="hover:text-gray-700 font-semibold transition-colors">개인정보처리방침</Link>
          </div>
        </div>
      </footer>

      {/* ===== 플로팅 버튼 ===== */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-3">
        <a href="#kakao"
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-bold px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105"
        >
          💬 카카오톡 상담
        </a>
        <a href="#"
          className="w-11 h-11 bg-gray-900 hover:bg-gray-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 text-sm"
        >
          ↑
        </a>
      </div>

    </div>
  );
}
