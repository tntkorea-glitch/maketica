import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CopyButton from "./CopyButton";

export default async function MyCampaignsPage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const applications = await prisma.application.findMany({
    where: { publisherId: userId },
    include: {
      campaign: {
        select: {
          title: true,
          publisherPrice: true,
          approvalRate: true,
          targetAction: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3015";

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">내 캠페인</h1>
        <p className="text-sm text-gray-500 mt-1">트래킹 링크를 복사해 블로그, SNS 등에 게시하세요.</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 px-6 py-20 text-center text-gray-400 text-sm">
          신청한 캠페인이 없습니다.{" "}
          <a href="/publisher/campaigns" className="text-blue-600 hover:underline">캠페인 탐색하기</a>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const trackingUrl = `${baseUrl}/t/${app.trackingCode}`;
            return (
              <div key={app.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{app.campaign.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      목표: {app.campaign.targetAction}
                      {app.campaign.approvalRate != null && ` · 승인율 ${app.campaign.approvalRate}%`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-blue-600">{app.campaign.publisherPrice.toLocaleString()}원</p>
                    <p className="text-xs text-gray-400">건당 수익</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-1">트래킹 링크</p>
                    <p className="text-sm text-gray-700 font-mono truncate">{trackingUrl}</p>
                  </div>
                  <CopyButton url={trackingUrl} />
                </div>

                <div className="flex gap-6 mt-3 text-xs text-gray-500">
                  <span>클릭 <span className="font-semibold text-gray-700">{app.clickCount}</span></span>
                  <span>전환 <span className="font-semibold text-gray-700">{app.conversionCount}</span></span>
                  <span className={`font-medium ${app.campaign.status === "ACTIVE" ? "text-green-600" : "text-gray-400"}`}>
                    {app.campaign.status === "ACTIVE" ? "● 진행중" : "■ 중지됨"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
