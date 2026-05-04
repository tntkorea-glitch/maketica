'use server'

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const role = (session.user as { role: string }).role;
  if (role !== "ADMIN") throw new Error("Forbidden");
}

function getWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, "0")}`;
}

export async function approveConversion(conversionId: string) {
  await assertAdmin();

  const conversion = await prisma.conversion.findUnique({
    where: { id: conversionId },
    include: { application: true },
  });
  if (!conversion || conversion.status !== "PENDING") return { error: "처리할 수 없는 전환입니다." };

  const weekKey = getWeekKey(new Date());

  // 마케터 Earning 누적 (주차별 upsert)
  const earning = await prisma.earning.upsert({
    where: {
      // settleWeek + publisherId 복합 unique 없으므로 findFirst 후 create/update
      id: (
        await prisma.earning.findFirst({
          where: { publisherId: conversion.application.publisherId, settleWeek: weekKey, status: "PENDING" },
          select: { id: true },
        })
      )?.id ?? "nonexistent",
    },
    update: { amount: { increment: conversion.publisherPrice } },
    create: {
      publisherId: conversion.application.publisherId,
      amount: conversion.publisherPrice,
      settleWeek: weekKey,
      status: "PENDING",
    },
  });

  await prisma.$transaction([
    prisma.conversion.update({
      where: { id: conversionId },
      data: { status: "APPROVED", approvedAt: new Date(), earningId: earning.id },
    }),
    prisma.application.update({
      where: { id: conversion.applicationId },
      data: { conversionCount: { increment: 1 } },
    }),
    prisma.campaign.update({
      where: { id: conversion.campaignId },
      data: { usedBudget: { increment: conversion.advertiserPrice } },
    }),
  ]);

  revalidatePath("/admin/conversions");
  return { success: true };
}

export async function rejectConversion(conversionId: string, reason: string) {
  await assertAdmin();

  await prisma.conversion.update({
    where: { id: conversionId },
    data: { status: "REJECTED", rejectedAt: new Date(), rejectedReason: reason },
  });

  revalidatePath("/admin/conversions");
  return { success: true };
}

export async function processWithdraw(withdrawId: string, action: "complete" | "reject") {
  await assertAdmin();

  if (action === "complete") {
    const req = await prisma.withdrawRequest.findUnique({ where: { id: withdrawId } });
    if (!req) return { error: "출금 요청을 찾을 수 없습니다." };

    await prisma.$transaction([
      prisma.withdrawRequest.update({
        where: { id: withdrawId },
        data: { status: "COMPLETED", processedAt: new Date() },
      }),
      // CONFIRMED 수익 중 해당 금액만큼 PAID 처리 (최신 순)
      // 단순화: publisher의 CONFIRMED earning을 합산해 PAID로 일괄 처리
      prisma.earning.updateMany({
        where: { publisherId: req.publisherId, status: "CONFIRMED" },
        data: { status: "PAID" },
      }),
    ]);
  } else {
    await prisma.withdrawRequest.update({
      where: { id: withdrawId },
      data: { status: "REJECTED", processedAt: new Date() },
    });
  }

  revalidatePath("/admin/withdrawals");
  return { success: true };
}

export async function confirmCharge(chargeId: string) {
  await assertAdmin();

  const charge = await prisma.charge.findUnique({
    where: { id: chargeId },
    include: { advertiserProfile: true },
  });
  if (!charge) return { error: "충전 요청을 찾을 수 없습니다." };
  if (charge.status !== "PENDING") return { error: "이미 처리된 요청입니다." };

  await prisma.$transaction([
    prisma.charge.update({
      where: { id: chargeId },
      data: { status: "CONFIRMED", confirmedAt: new Date() },
    }),
    prisma.advertiserProfile.update({
      where: { id: charge.advertiserProfileId },
      data: { balance: { increment: charge.amount } },
    }),
  ]);

  revalidatePath("/admin/charges");
  return { success: true };
}

export async function approveCampaign(campaignId: string) {
  await assertAdmin();
  await prisma.campaign.update({ where: { id: campaignId }, data: { status: "ACTIVE" } });
  revalidatePath("/admin/campaigns");
  return { success: true };
}

export async function rejectCampaign(campaignId: string, reason: string) {
  await assertAdmin();
  await prisma.campaign.update({ where: { id: campaignId }, data: { status: "REJECTED" } });
  revalidatePath("/admin/campaigns");
  return { success: true };
}
