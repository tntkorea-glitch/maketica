import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;
  const { id } = await params;

  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign || campaign.advertiserId !== userId) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">캠페인 수정</h1>
        <p className="text-sm text-gray-500 mt-1">{campaign.title}</p>
      </div>
      <EditForm campaign={campaign} />
    </div>
  );
}
