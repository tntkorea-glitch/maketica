---
name: maketica 프로젝트 진행 상태
description: 현재 진행률, 완료 작업, 남은 작업 목록
type: project
originSessionId: 3c6e204d-775c-4f9b-9cf9-9f62c6fa9762
---
## 진행률: 40% (랜딩 리디자인 + 이미지 업로드 완료)

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
- **비밀번호 재설정** — Resend 연동 준비 완료
- **개인정보처리방침/이용약관** — /privacy, /terms
- **SEO 메타태그** — OG, Twitter Card, robots
- **로그아웃 → 랜딩페이지(/) 리다이렉트** 수정
- **랜딩페이지 전면 리디자인** — 인디고+다크 테마, 리플알바 영감 독자 스타일
- **배너 캐러셀 (BannerCarousel)** — 5초 자동 롤링, 도트/화살표 컨트롤
- **이미지 업로드 (Vercel Blob)** — 캠페인 등록·수정 폼, 드래그앤드롭+미리보기
- **Vercel Blob 스토어 연결** — maketica-images, BLOB_READ_WRITE_TOKEN 환경변수 설정
- **샘플 캠페인 9개** — Unsplash 이미지 포함 DB seed
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
- [ ] /public/og-image.png 추가 (1200×630)
- [ ] 카카오 로그인 앱키 등록 (선택)
- [ ] 실제 광고주 캠페인 이미지 업로드 (현재 Unsplash 샘플)
- [ ] 마케터 랜딩페이지 캠페인 탐색 페이지 UI 개선 (현재 basic)
- [ ] 실제 운영을 위한 사업자 정보 푸터 업데이트

**Why:** 랜딩 리디자인 + 이미지 업로드 기능 완성. 핵심 기능은 모두 동작.
**How to apply:** 다음 세션에서 RESEND_API_KEY 등록 또는 마케터 캠페인 탐색 UI 개선 우선.
