import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(req: Request) {
  const url = new URL(req.url); const code = url.searchParams.get("code");
  if (code) { const { error } = await (await createClient()).auth.exchangeCodeForSession(code); if (!error) return NextResponse.redirect(new URL("/admin/reset-password", url.origin)); }
  return NextResponse.redirect(new URL("/admin/login?error=link", url.origin));
}
