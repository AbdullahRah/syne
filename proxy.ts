import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16 Proxy (formerly Middleware): refreshes the Supabase session and
// guards the dashboard on every matched request.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match everything except:
     * - the public TV display route (/s/...)
     * - Next.js internals and static files
     * - common image/asset extensions
     */
    "/((?!s/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
