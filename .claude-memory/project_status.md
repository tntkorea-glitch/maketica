---
name: maketica 프로젝트 진행 상태
description: 현재 진행률, 완료 작업, 남은 작업 목록
type: project
originSessionId: 9141f866-baca-45cc-95db-6ec105fad0f9
---
## 진행률: 100% (MVP 완성)

## 완료된 작업

- 프로젝트 초기 셋업 (Next.js 16, Prisma v6, NextAuth v5, Neon DB)
- Prisma 스키마 설계 (11개 모델)
- 랜딩페이지, 로그인, 회원가입, 대시보드 역할 라우터
- **광고주 대시보드** — 대시보드/캠페인 목록/캠페인 등록+수정/전환 리포트/예치금 충전
- **마케터 대시보드** — 대시보드/캠페인 탐색/신청/내 캠페인+트래킹링크/수익내역/출금신청
- **트래킹 링크** — /t/[code] 클릭 수집 + landingUrl 리다이렉트
- **전환 등록 API** — GET/POST /api/conversions
- **관리자 대시보드** — 전환/캠페인/출금/충전/사용자 관리
- **정산 배치 Cron** — 매주 금요일 09:00 UTC, /api/cron/settle
- **소셜 로그인** — 카카오/네이버 (env-gated)
- **비밀번호 재설정** — 토큰 기반 (콘솔 로그, 실서비스 Resend 연동 필요)
- 시드 데이터 (admin/advertiser/publisher 계정 + 캠페인)

## 테스트 계정
- 관리자: admin@maketica.kr / Test1234!
- 광고주: advertiser@maketica.kr / Test1234!
- 마케터: publisher@maketica.kr / Test1234!
- 캠페인: 법무법인 정윤 | 개인회생 무료상담 (ACTIVE, 마케터 8만원)

## Postback URL 형식
```
GET /api/conversions?code={trackingCode}&name=홍길동&phone=010-1234-5678
```

## CPA 전체 루프
```
광고주 캠페인 등록 → 마케터 신청 → 트래킹 링크 발급
→ /t/{code} 클릭 → 랜딩 리다이렉트
→ GET /api/conversions?code=...&name=...&phone=...
→ 관리자 전환 승인 → 마케터 Earning 적립
→ 주급 정산 배치 (매주 금요일 Cron)
→ 마케터 출금 신청 → 관리자 이체 완료
```

## 배포 전 환경변수 등록 필요 (Vercel)
- AUTH_KAKAO_ID / AUTH_KAKAO_SECRET — 카카오 소셜 로그인
- AUTH_NAVER_ID / AUTH_NAVER_SECRET — 네이버 소셜 로그인
- CRON_SECRET — Cron 엔드포인트 보호
- COMPANY_BANK / COMPANY_ACCOUNT / COMPANY_HOLDER — 예치금 충전 계좌
- Resend API Key — 비밀번호 재설정 이메일 (선택)

**Why:** 전체 MVP 완성. 사용자가 /bye 또는 /test 호출 시 1회 배포.
**How to apply:** 배포 전 Vercel 환경변수 등록 필요 항목 안내.
