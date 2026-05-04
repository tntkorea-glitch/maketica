"use client";

import { useActionState } from "react";
import { createCampaign } from "@/app/actions/campaigns";

const categories = [
  { value: "LEGAL", label: "⚖️ 개인회생/법률 (5~15만원)" },
  { value: "LOAN", label: "💰 대출 (3~10만원)" },
  { value: "INSURANCE", label: "🛡️ 보험 (3~8만원)" },
  { value: "PLASTIC", label: "💊 성형/다이어트 (2~6만원)" },
  { value: "BEAUTY", label: "✨ 뷰티/피부 (1~4만원)" },
  { value: "HEALTHCARE", label: "🏥 건강/의료 (1~4만원)" },
  { value: "EDUCATION", label: "📚 교육/자격증 (1~3만원)" },
  { value: "REALESTATE", label: "🏠 부동산 (2~5만원)" },
  { value: "IT", label: "💻 IT/앱/게임 (1~3만원)" },
  { value: "FOOD", label: "🍎 식품/다이어트 (0.5~2만원)" },
  { value: "SHOPPING", label: "🛒 쇼핑/이커머스 (0.3~1만원)" },
  { value: "OTHER", label: "📦 기타" },
];

const targetActions = ["상담신청", "회원가입", "구매완료", "앱설치", "견적신청", "무료체험", "기타"];
const grades = [
  { value: "BRONZE", label: "BRONZE — 모든 마케터 참여 가능" },
  { value: "SILVER", label: "SILVER — 월 50건 이상 실적자" },
  { value: "GOLD", label: "GOLD — 월 200건 이상 실적자" },
  { value: "PLATINUM", label: "PLATINUM — 상위 1% 전문 마케터" },
];

export default function NewCampaignPage() {
  const [error, formAction, isPending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      const result = await createCampaign(formData);
      if (result?.error) return result.error;
      return null;
    },
    null
  );

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">캠페인 등록</h1>
        <p className="text-sm text-gray-500 mt-1">등록 즉시 마케터들에게 공개됩니다. 단가와 예산을 신중히 설정하세요.</p>
      </div>

      <form action={formAction} className="space-y-6">
        {/* 기본 정보 */}
        <Section title="기본 정보">
          <Field label="캠페인명" required>
            <input
              name="title"
              type="text"
              required
              placeholder="예) 법무법인 OO | 개인회생 무료상담"
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="업종/카테고리" required>
              <select name="category" required className={inputCls}>
                <option value="">선택하세요</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>
            <Field label="광고 유형" required>
              <select name="type" defaultValue="CPA" className={inputCls}>
                <option value="CPA">CPA — 액션당 비용</option>
                <option value="CPL">CPL — 리드당 비용</option>
                <option value="CPS">CPS — 판매당 비용</option>
              </select>
            </Field>
          </div>
          <Field label="목표 액션" required hint="마케터가 유도해야 하는 사용자 행동">
            <select name="targetAction" required className={inputCls}>
              <option value="">선택하세요</option>
              {targetActions.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>
        </Section>

        {/* 캠페인 설명 */}
        <Section title="캠페인 내용">
          <Field label="캠페인 설명" required hint="마케터에게 공개됩니다. 광고 대상, 특장점 등을 입력하세요.">
            <textarea
              name="description"
              required
              rows={4}
              placeholder="예) 부채 5천만원 이상, 소득이 있는 분을 대상으로 개인회생/파산 전문 무료상담을 제공합니다. 상담 연결 시 건당 지급됩니다."
              className={inputCls + " resize-none"}
            />
          </Field>
          <Field label="참여 조건 / 주의사항" hint="승인 기준, 거절 사유 등 마케터에게 꼭 알려야 할 사항">
            <textarea
              name="requirement"
              rows={3}
              placeholder="예) 실명 상담 신청 필수 / 허위 DB 적발 시 미지급 / 상담원 연결 완료 후 확정"
              className={inputCls + " resize-none"}
            />
          </Field>
          <Field label="랜딩 페이지 URL" required hint="마케터 트래킹 링크가 이 URL로 리다이렉트됩니다.">
            <input
              name="landingUrl"
              type="url"
              required
              placeholder="https://example.com/landing"
              className={inputCls}
            />
          </Field>
        </Section>

        {/* 단가/예산 */}
        <Section title="단가 및 예산 설정">
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-blue-700 mb-4">
            💡 광고주 단가 - 마케터 단가 = 플랫폼 수수료. 마케터 단가는 반드시 광고주 단가보다 낮아야 합니다.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="광고주 지불 단가 (원)" required hint="전환 1건당 광고주가 지불하는 금액">
              <input name="advertiserPrice" type="number" required min={1000} step={1000} placeholder="100000" className={inputCls} />
            </Field>
            <Field label="마케터 지급 단가 (원)" required hint="전환 1건당 마케터에게 지급하는 금액">
              <input name="publisherPrice" type="number" required min={500} step={500} placeholder="70000" className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="총 예산 (원)" required hint="이 예산이 소진되면 캠페인이 자동 종료됩니다.">
              <input name="budget" type="number" required min={100000} step={10000} placeholder="5000000" className={inputCls} />
            </Field>
            <Field label="예상 승인율 (%)" hint="마케터에게 공개됩니다. 실제 승인 비율을 참고해 입력하세요.">
              <input name="approvalRate" type="number" min={0} max={100} placeholder="75" className={inputCls} />
            </Field>
          </div>
        </Section>

        {/* 운영 설정 */}
        <Section title="운영 설정">
          <div className="grid grid-cols-2 gap-4">
            <Field label="시작일">
              <input name="startDate" type="date" className={inputCls} />
            </Field>
            <Field label="종료일">
              <input name="endDate" type="date" className={inputCls} />
            </Field>
          </div>
          <Field label="최소 마케터 등급" hint="이 등급 이상의 마케터만 신청 가능합니다.">
            <select name="minGrade" defaultValue="BRONZE" className={inputCls}>
              {grades.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </Field>
        </Section>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? "등록 중..." : "캠페인 등록"}
          </button>
          <a href="/advertiser/campaigns" className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            취소
          </a>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 bg-gray-50">
        <h2 className="font-semibold text-gray-800 text-sm">{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}
