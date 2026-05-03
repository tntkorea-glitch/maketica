import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role === "ADVERTISER") redirect("/advertiser");
  if (role === "ADMIN") redirect("/admin");
  redirect("/publisher");
}
