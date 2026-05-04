'use server'

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function applyToCampaign(campaignId: string) {
  const session = await auth();
  if (!session?.user) return { error: "로그인이 필요합니다." };
  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;
  if (role !== "PUBLISHER") return { error: "마케터 계정만 신청 가능합니다." };

  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
  if (!campaign || campaign.status !== "ACTIVE") return { error: "진행 중인 캠페인이 아닙니다." };

  const gradeOrder = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { grade: true } });
  if (!user) return { error: "사용자를 찾을 수 없습니다." };

  if (gradeOrder.indexOf(user.grade) < gradeOrder.indexOf(campaign.minGrade)) {
    return { error: `${campaign.minGrade} 등급 이상만 신청 가능합니다.` };
  }

  const existing = await prisma.application.findUnique({
    where: { campaignId_publisherId: { campaignId, publisherId: userId } },
  });
  if (existing) return { error: "이미 신청한 캠페인입니다." };

  await prisma.application.create({
    data: {
      campaignId,
      publisherId: userId,
      status: "APPROVED",
    },
  });

  revalidatePath("/publisher/campaigns");
  revalidatePath("/publisher/my-campaigns");
  return { success: true };
}
