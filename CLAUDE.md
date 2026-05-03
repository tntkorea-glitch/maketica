@AGENTS.md

# maketica — CPA 제휴마케팅 플랫폼

## 개발 포트: 3015 고정
- `npm run dev` → http://localhost:3015

## 세션 시작 시 자동 실행 (필수)
매 세션 시작 시 사용자의 첫 메시지를 처리하기 전에:
```bash
[ -f setup.sh ] && { [ ! -f .git/hooks/pre-commit ] || [ ! -d node_modules ]; } && bash setup.sh
git pull
```

## 기술 스택
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Prisma ORM + PostgreSQL (Supabase)
- NextAuth v5
- Vercel 배포

## 주요 사용자 역할
- **광고주(advertiser)**: 캠페인 등록/관리/리포트
- **마케터(publisher)**: 캠페인 참여/수익/출금
- **관리자(admin)**: 승인/정산 관리
