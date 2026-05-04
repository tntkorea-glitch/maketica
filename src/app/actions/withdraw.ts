'use server'

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function requestWithdraw(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "로그인이 필요합니다." };
  const userId = (session.user as { id: string }).id;

  const amount = parseInt(formData.get("amount") as string, 10);
  const bankName = formData.get("bankName") as string;
  const bankAccount = formData.get("bankAccount") as string;
  const bankHolder = formData.get("bankHolder") as string;

  if (!amount || amount < 10000) return { error: "최소 출금 금액은 10,000원입니다." };
  if (!bankName || !bankAccount || !bankHolder) return { error: "계좌 정보를 모두 입력해주세요." };

  // 출금 가능 금액 확인 (CONFIRMED 수익 합계)
  const confirmed = await prisma.earning.aggregate({
    where: { publisherId: userId, status: "CONFIRMED" },
    _sum: { amount: true },
  });
  const available = confirmed._sum.amount ?? 0;

  if (amount > available) {
    return { error: `출금 가능 금액(${available.toLocaleString()}원)을 초과했습니다.` };
  }

  // 이미 처리 대기 중인 출금 요청 확인
  const pending = await prisma.withdrawRequest.findFirst({
    where: { publisherId: userId, status: "PENDING" },
  });
  if (pending) return { error: "이미 처리 중인 출금 요청이 있습니다." };

  await prisma.$transaction([
    prisma.withdrawRequest.create({
      data: { publisherId: userId, amount, bankName, bankAccount, bankHolder },
    }),
    // 계좌 정보 저장 (다음 출금 시 자동 입력용)
    prisma.user.update({
      where: { id: userId },
      data: { bankName, bankAccount, bankHolder },
    }),
  ]);

  revalidatePath("/publisher/withdraw");
  return { success: true };
}
