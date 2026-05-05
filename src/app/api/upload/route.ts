import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase();
  const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
  if (!ext || !allowed.includes(ext)) {
    return NextResponse.json({ error: "jpg/png/webp/gif 파일만 업로드 가능합니다." }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "파일 크기는 5MB 이하여야 합니다." }, { status: 400 });
  }

  const blob = await put(`campaigns/${Date.now()}.${ext}`, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url });
}
