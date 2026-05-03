---
name: maketica 프로젝트 초기화 정보
description: maketica CPA 제휴마케팅 플랫폼 프로젝트 기본 셋업 정보
type: project
originSessionId: e7e27173-892b-4eef-9414-fd902a637ed4
---
maketica는 CPA 제휴마케팅 플랫폼 프로젝트 (2026-05-03 생성)

**Why:** 국내 CPA 제휴마케팅 플랫폼 1위 리플알바 등을 벤치마킹해 새로 만드는 플랫폼
**How to apply:** 광고주/마케터/관리자 3자 구조로 개발. 벤치마킹 분석 자료는 data-file/ 폴더에 있음

## 기본 정보
- GitHub: https://github.com/tntkorea-glitch/maketica
- 개발 포트: 3015 고정 (http://localhost:3015)
- 기술 스택: Next.js 16 + TypeScript + Tailwind CSS v4 + Prisma + Supabase + NextAuth v5

## 앱 구조
- `(landing)/` — 비로그인 공개 페이지 (랜딩, 캠페인 목록)
- `(auth)/` — 로그인/회원가입 (역할별)
- `advertiser/` — 광고주 대시보드 (캠페인 등록/관리/리포트/충전)
- `publisher/` — 마케터 대시보드 (캠페인 탐색/수익/출금/랭킹)
- `admin/` — 관리자 (승인/정산/유저 관리)

## 수익 구조 핵심
- 광고주 단가 > 마케터 지급 단가 → 중간 스프레드가 플랫폼 수익 (약 50% 마진)
- 승인율 60~100%로 실제 지급 비용 통제 가능
- 고단가 카테고리: 개인회생/법률 5~15만, 대출 3~10만, 보험 3~8만, 성형/다이어트 2~6만
- 광고주 예치금(선수금) 시스템 필수 — 미지급 리스크 방지

## 후발주자 차별화 전략
- 니치 + 고수 타겟 + SaaS화 (자동화 도구 붙이기)
- 상위 10% 마케터 전용 고단가 캠페인 (minGrade 필드로 구현)
- Postica AI 연동으로 콘텐츠 자동 생성 → 마케터 Lock-in

## 벤치마킹 사이트
- 리플알바 (replyalba.com) — 1위, CPA 종합, 최대 마케터 풀
- 링크프라이스 (linkprice.com) — 4위, CPS 전문, 브랜드 공식
- dbdbdeep.com — 보상형/바이럴, 게임화(랭킹)
