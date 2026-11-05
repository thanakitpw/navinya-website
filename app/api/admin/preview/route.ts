import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { currentCmsUser } from "@/lib/cms/server";

// Turns on Draft Mode for the editor's preview iframe, then redirects to the page being edited.
export async function GET(req: NextRequest) {
  const user = await currentCmsUser();
  if (!user) return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 403 });

  // Same-origin paths only, so this cannot be used as an open redirect.
  const origin = req.nextUrl.origin;
  const target = new URL(req.nextUrl.searchParams.get("path") ?? "/", origin);
  const safe = target.origin === origin ? `${target.pathname}${target.search}` : "/";

  (await draftMode()).enable();
  return NextResponse.redirect(new URL(safe, origin));
}
