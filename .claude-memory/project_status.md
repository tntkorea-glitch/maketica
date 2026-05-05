---
name: maketica 프로젝트 진행 상태
description: 현재 진행률, 완료 작업, 남은 작업 목록
type: project
originSessionId: 9141f866-baca-45cc-95db-6ec105fad0f9
---
## 진행률: 100% (MVP 완성 + 프로덕션 배포)

## 완료된 작업

- 프로젝트 초기 셋업 (Next.js 16, Prisma v6, NextAuth v5, Neon DB)
- Prisma 스키마 설계 (11개 모델)
- 랜딩페이지, 로그인, 회원가입, 대시보드 역할 라우터
- **광고주 대시보드** — 대시보드/캠페인 목록/캠페인 등록+수정/전환 리포트/예치금 충전
- **마케터 대시보드** — 대시보드/캠페인 탐색/신청/내 캠페인+트래킹링크/수익내역/출금신청
- **트래킹 링크** — /t/[code] 클릭 수집 + landingUrl 리다이렉트
- **전환 등록 API** — GET/POST /api/conversions
- **관리자 대시보드** — 전환/캠페인/출금/충전/사용자 관리
- **정산 배치 Cron** — 매주 금요일 09:00 UTC
- **소셜 로그인** — Google (카카오/네이버 env-gated)
- **비밀번호 재설정** — Resend 연동 준비 완료 (RESEND_API_KEY 등록 시 즉시 동작)
- **개인정보처리방침** — /privacy
- **이용약관** — /terms
- **SEO 메타태그** — OG, Twitter Card, robots, keywords
- **로그아웃 버튼** — 각 사이드바 하단
- **관리자 뷰 전환** — admin/publisher/advertiser 자유 전환
- **도메인** — maketica.co.kr 연결 완료
- **프로덕션 배포** — Vercel + Neon DB

## 테스트 계정
- 관리자: admin@maketica.kr / Test1234! (또는 Google tntkorea@tntkorea.co.kr)
- 광고주: advertiser@maketica.kr / Test1234!
- 마케터: publisher@maketica.kr / Test1234!

## Postback URL 형식
```
GET /api/conversions?code={trackingCode}&name=홍길동&phone=010-1234-5678
```

## 남은 작업
- [ ] RESEND_API_KEY 등록 (Vercel 환경변수) → 비밀번호 재설정 이메일 발송 활성화
- [ ] Resend에서 maketica.co.kr 발신 도메인 인증
- [ ] /public/og-image.png 추가 (1200×630, SNS 공유 이미지)
- [ ] 카카오 로그인 앱키 등록 (선택)

**Why:** MVP 전체 완성, 프로덕션 도메인 연결까지 완료.
**How to apply:** 다음 세션에서 Resend API 키 받아 환경변수 등록하면 이메일 기능 완성.
