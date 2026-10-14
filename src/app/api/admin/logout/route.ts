import { cookies } from "next/headers";
import { json, guard, apiError } from "@/lib/admin/http";
import { getRepository } from "@/lib/admin/repository";
import { SESSION_COOKIE, digest } from "@/lib/admin/security";
export async function POST(request: Request) {
  try {
    const denied = await guard(request);
    if (denied) return denied;
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (token) await getRepository().deleteSession(digest(token));
    const response = json({ ok: true });
    response.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch (error) {
    return apiError(error);
  }
}
