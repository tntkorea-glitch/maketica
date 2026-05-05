"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    badge: "이번 달 최고 단가",
    title: "개인회생·파산 전문\n법무법인 캠페인",
    highlight: "건당 최대 150,000원",
    sub: "승인율 93% | 전국 상담 가능",
    cta: "지금 신청하기",
    href: "/register",
    bg: "from-[#0f0f1a] to-[#1a1a3e]",
    accent: "#6366F1",
    tag: "개인회생/법률",
  },
  {
    id: 2,
    badge: "승인율 100% 캠페인",
    title: "국내 1위 청소업체\n모두클린 파트너 모집",
    highlight: "건당 8,000원 · 무제한 전환",
    sub: "전환신청률 3.73% | 초보자 추천",
    cta: "신청하러 가기",
    href: "/register",
    bg: "from-[#0d2137] to-[#0a3d2b]",
    accent: "#10B981",
    tag: "라이프/청소",
  },
  {
    id: 3,
    badge: "5월 프로모션 진행 중",
    title: "대출 비교 플랫폼\n고단가 마케터 모집",
    highlight: "건당 최대 100,000원",
    sub: "승인율 88% | 블로그·SNS 가능",
    cta: "프로모션 확인",
    href: "/register",
    bg: "from-[#1a0a2e] to-[#2d1654]",
    accent: "#A855F7",
    tag: "대출/금융",
  },
];

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  const slide = slides[current];

  return (
    <div
      className={`relative bg-gradient-to-r ${slide.bg} text-white overflow-hidden transition-all duration-700`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 배경 장식 */}
      <div
        className="absolute inset-0 opacity-10 transition-all duration-700"
        style={{
          backgroundImage: `radial-gradient(circle at 70% 50%, ${slide.accent} 0%, transparent 60%)`,
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-6 py-14 flex items-center justify-between">
        {/* 텍스트 */}
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ backgroundColor: slide.accent, color: "#fff" }}
            >
              {slide.tag}
            </span>
            <span className="text-xs text-white/60">{slide.badge}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black leading-snug mb-3 whitespace-pre-line">
            {slide.title}
          </h2>
          <p className="text-2xl font-black mb-2" style={{ color: slide.accent }}>
            {slide.highlight}
          </p>
          <p className="text-sm text-white/60 mb-6">{slide.sub}</p>
          <Link
            href={slide.href}
            className="inline-block px-7 py-3 font-bold rounded-lg text-sm transition-opacity hover:opacity-80"
            style={{ backgroundColor: slide.accent, color: "#fff" }}
          >
            {slide.cta} →
          </Link>
        </div>

        {/* 우측 장식 텍스트 */}
        <div className="hidden lg:block opacity-5 text-[120px] font-black leading-none select-none">
          {current + 1}/{slides.length}
        </div>
      </div>

      {/* 좌우 화살표 */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors text-white text-sm"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-20 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors text-white text-sm"
      >
        ›
      </button>

      {/* 도트 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-white" : "w-3 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
