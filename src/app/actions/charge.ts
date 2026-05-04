'use server'

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function requestCharge(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "로그인이 필요합니다." };
  const userId = (session.user as { id: string }).id;

  const amount = parseInt(formData.get("amount") as string, 10);
  const method = formData.get("method") as string;

  if (!amount || amount < 100000) return { error: "최소 충전 금액은 100,000원입니다." };

  const profile = await prisma.advertiserProfile.findUnique({ where: { userId } });
  if (!profile) return { error: "광고주 프로필을 찾을 수 없습니다." };

  await prisma.charge.create({
    data: {
      advertiserProfileId: profile.id,
      amount,
      method: method || "transfer",
    },
  });

  revalidatePath("/advertiser/charge");
  return { success: true };
}
