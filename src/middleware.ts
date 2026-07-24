import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Auth session refresh is only needed for the admin area. Running it on every
  // public route makes navigation block on a Supabase round-trip per click.
  matcher: ["/admin/:path*"],
};
