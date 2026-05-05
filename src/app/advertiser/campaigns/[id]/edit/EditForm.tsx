"use client";

import { useActionState, useTransition } from "react";
import { updateCampaign, setCampaignStatus } from "@/app/actions/campaigns";
import ImageUploadField from "@/components/ImageUploadField";
import type { Campaign } from "@prisma/client";

const categories = [
  { value: "LEGAL",      label: "⚖️ 개인회생/법률" },
  { value: "LOAN",       label: "💰 대출" },
  { value: "INSURANCE",  label: "🛡️ 보험" },
  { value: "PLASTIC",    label: "💊 성형/다이어트" },
  { value: "BEAUTY",     label: "✨ 뷰티/피부" },
  { value: "HEALTHCARE", label: "🏥 건강/의료" },
  { value: "EDUCATION",  label: "📚 교육/자격증" },
  { value: "REALESTATE", label: "🏠 부동산" },
  { value: "IT",         label: "💻 IT/앱/게임" },
  { value: "FOOD",       label: "🍎 식품" },
  { value: "SHOPPING",   label: "🛒 쇼핑" },
  { value: "OTHER",      label: "📦 기타" },
];
const targetActions = ["상담신청", "회원가입", "구매완료", "앱설치", "견적신청", "무료체험", "기타"];
const grades = [
  { value: "BRONZE",   label: "BRONZE — 모든 마케터" },
  { value: "SILVER",   label: "SILVER — 월 50건+" },
  { value: "GOLD",     label: "GOLD — 월 200건+" },
  { value: "PLATINUM", label: "PLATINUM — 상위 1%" },
];

function fmtDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toISOString().split("T")[0];
}

export default function EditForm({ campaign }: { campaign: Campaign }) {
  const [isPending, startTransition] = useTransition();
  const [error, formAction, submitting] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      const result = await updateCampaign(campaign.id, formData);
      if (result?.error) return result.error;
      return null;
    },
    null
  );

  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-6">
        {/* 기본 정보 */}
        <Section title="기본 정보">
          <Field label="캠페인명" required>
            <input name="title" type="text" required defaultValue={campaign.title} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="업종/카테고리" required>
              <select name="category" required defaultValue={campaign.category} className={inputCls}>
                {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="목표 액션" required>
              <select name="targetAction" required defaultValue={campaign.targetAction} className={inputCls}>
                {targetActions.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        {/* 대표 이미지 */}
        <Section title="대표 이미지">
          <Field label="캠페인 대표 이미지" hint="랜딩페이지 캠페인 카드에 표시됩니다. 권장 크기 800×450 (16:9)">
            <ImageUploadField defaultUrl={campaign.imageUrl ?? undefined} />
          </Field>
        </Section>

        {/* 캠페인 내용 */}
        <Section title="캠페인 내용">
          <Field label="캠페인 설명" required>
            <textarea name="description" required rows={4} defaultValue={campaign.description}
              className={inputCls + " resize-none"} />
          </Field>
          <Field label="참여 조건 / 주의사항">
            <textarea name="requirement" rows={3} defaultValue={campaign.requirement ?? ""}
              className={inputCls + " resize-none"} />
          </Field>
          <Field label="랜딩 페이지 URL" required>
            <input name="landingUrl" type="url" required defaultValue={campaign.landingUrl} className={inputCls} />
          </Field>
        </Section>

        {/* 단가/예산 */}
        <Section title="단가 및 예산">
          <div className="grid grid-cols-2 gap-4">
            <Field label="광고주 단가 (원)" required>
              <input name="advertiserPrice" type="number" required min={1000} step={1000}
                defaultValue={campaign.advertiserPrice} className={inputCls} />
            </Field>
            <Field label="마케터 단가 (원)" required>
              <input name="publisherPrice" type="number" required min={500} step={500}
                defaultValue={campaign.publisherPrice} className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="총 예산 (원)" required>
              <input name="budget" type="number" required min={100000} step={10000}
                defaultValue={campaign.budget} className={inputCls} />
            </Field>
            <Field label="예상 승인율 (%)">
              <input name="approvalRate" type="number" min={0} max={100}
                defaultValue={campaign.approvalRate ?? ""} className={inputCls} />
            </Field>
          </div>
        </Section>

        {/* 운영 설정 */}
        <Section title="운영 설정">
          <div className="grid grid-cols-2 gap-4">
            <Field label="시작일">
              <input name="startDate" type="date" defaultValue={fmtDate(campaign.startDate)} className={inputCls} />
            </Field>
            <Field label="종료일">
              <input name="endDate" type="date" defaultValue={fmtDate(campaign.endDate)} className={inputCls} />
            </Field>
          </div>
          <Field label="최소 마케터 등급">
            <select name="minGrade" defaultValue={campaign.minGrade} className={inputCls}>
              {grades.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </Field>
        </Section>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {submitting ? "저장 중..." : "수정 저장"}
          </button>
          <a href="/advertiser/campaigns"
            className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            취소
          </a>
        </div>
      </form>

      {/* 캠페인 상태 변경 */}
      {(campaign.status === "ACTIVE" || campaign.status === "PAUSED") && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">캠페인 상태 변경</h3>
          <div className="flex gap-3">
            {campaign.status === "ACTIVE" && (
              <button
                disabled={isPending}
                onClick={() => startTransition(() => setCampaignStatus(campaign.id, "PAUSED"))}
                className="px-4 py-2 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                일시 중지
              </button>
            )}
            {campaign.status === "PAUSED" && (
              <button
                disabled={isPending}
                onClick={() => startTransition(() => setCampaignStatus(campaign.id, "PAUSED"))}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                재개
              </button>
            )}
            <button
              disabled={isPending}
              onClick={() => {
                if (confirm("캠페인을 종료하시겠습니까? 종료 후 다시 활성화할 수 없습니다.")) {
                  startTransition(() => setCampaignStatus(campaign.id, "ENDED"));
                }
              }}
              className="px-4 py-2 border border-red-200 text-red-600 text-sm rounded-lg hover:bg-red-50 disabled:opacity-50"
            >
              캠페인 종료
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
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
