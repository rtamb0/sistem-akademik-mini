import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function safeParseUser(cookieValue: string | undefined) {
  if (!cookieValue) {
    return null;
  }

  try {
    return JSON.parse(cookieValue) as { role?: string };
  } catch {
    return null;
  }
}

export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = safeParseUser(cookieStore.get("user")?.value);

  if (!token) {
    redirect("/login");
  }

  if (user?.role !== "admin") {
    redirect("/dashboard/mahasiswa");
  }

  redirect("/dashboard/user");
}
