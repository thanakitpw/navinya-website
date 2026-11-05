import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Keeps signed-out visitors out of /admin and refreshes the session cookie.
// Whether a user is actually an editor is checked in the admin layout, in every action, and by RLS.
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const onLoginPage = path.startsWith("/admin/login");

  const deny = () => {
    if (path.startsWith("/api/")) return NextResponse.json({ error: "ต้องเข้าสู่ระบบก่อน" }, { status: 401 });
    const to = new URL("/admin/login", request.url);
    to.searchParams.set("next", path);
    return NextResponse.redirect(to);
  };

  const hasSessionCookie = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSessionCookie) return onLoginPage ? NextResponse.next() : deny();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          for (const { name, value } of list) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of list) response.cookies.set(name, value, options);
        },
      },
    },
  );

  // getUser() checks the token with Supabase; reading the cookie alone could be forged.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return onLoginPage ? response : deny();
  if (onLoginPage) return NextResponse.redirect(new URL("/admin", request.url));
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
