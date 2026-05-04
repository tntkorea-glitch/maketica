'use server'

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCampaign(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;
  if (role !== "ADVERTISER") throw new Error("Forbidden");

  const advertiserPrice = parseInt(formData.get("advertiserPrice") as string, 10);
  const publisherPrice = parseInt(formData.get("publisherPrice") as string, 10);
  const budget = parseInt(formData.get("budget") as string, 10);
  const approvalRateRaw = formData.get("approvalRate") as string;
  const startDateRaw = formData.get("startDate") as string;
  const endDateRaw = formData.get("endDate") as string;

  if (publisherPrice >= advertiserPrice) {
    return { error: "마케터 지급 단가는 광고주 단가보다 낮아야 합니다." };
  }

  await prisma.campaign.create({
    data: {
      advertiserId: userId,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string as never,
      type: (formData.get("type") as string as never) ?? "CPA",
      status: "ACTIVE",
      advertiserPrice,
      publisherPrice,
      budget,
      targetAction: formData.get("targetAction") as string,
      requirement: (formData.get("requirement") as string) || null,
      landingUrl: formData.get("landingUrl") as string,
      minGrade: (formData.get("minGrade") as string as never) ?? "BRONZE",
      approvalRate: approvalRateRaw ? parseInt(approvalRateRaw, 10) : null,
      startDate: startDateRaw ? new Date(startDateRaw) : null,
      endDate: endDateRaw ? new Date(endDateRaw) : null,
    },
  });

  revalidatePath("/advertiser/campaigns");
  redirect("/advertiser/campaigns");
}

export async function updateCampaign(campaignId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as { id: string }).id;

  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
  if (!campaign || campaign.advertiserId !== userId) throw new Error("Forbidden");

  const advertiserPrice = parseInt(formData.get("advertiserPrice") as string, 10);
  const publisherPrice  = parseInt(formData.get("publisherPrice") as string, 10);
  if (publisherPrice >= advertiserPrice) {
    return { error: "마케터 지급 단가는 광고주 단가보다 낮아야 합니다." };
  }

  const startDateRaw = formData.get("startDate") as string;
  const endDateRaw   = formData.get("endDate") as string;
  const approvalRateRaw = formData.get("approvalRate") as string;

  await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      title:           formData.get("title") as string,
      description:     formData.get("description") as string,
      requirement:     (formData.get("requirement") as string) || null,
      landingUrl:      formData.get("landingUrl") as string,
      targetAction:    formData.get("targetAction") as string,
      advertiserPrice,
      publisherPrice,
      budget:          parseInt(formData.get("budget") as string, 10),
      minGrade:        formData.get("minGrade") as string as never,
      approvalRate:    approvalRateRaw ? parseInt(approvalRateRaw, 10) : null,
      startDate:       startDateRaw ? new Date(startDateRaw) : null,
      endDate:         endDateRaw ? new Date(endDateRaw) : null,
    },
  });

  revalidatePath("/advertiser/campaigns");
  redirect("/advertiser/campaigns");
}

export async function setCampaignStatus(campaignId: string, status: "PAUSED" | "ENDED") {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as { id: string }).id;

  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
  if (!campaign || campaign.advertiserId !== userId) throw new Error("Forbidden");

  await prisma.campaign.update({ where: { id: campaignId }, data: { status } });
  revalidatePath("/advertiser/campaigns");
}
