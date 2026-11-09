import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { currentCmsUser, serverClient } from "@/lib/cms/server";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const user = await currentCmsUser();

  if (!user) {
    // proxy.ts already let this session through, so redirecting to login would loop.
    const { data } = await (await serverClient()).auth.getUser();
    return (
      <div className="adm-login">
        <div className="adm-login-card">
          <h1>บัญชีนี้ยังไม่มีสิทธิ์เข้าหลังบ้าน</h1>
          <p className="adm-hint">{data.user?.email} ยังไม่ได้รับสิทธิ์ ติดต่อผู้ดูแลระบบเพื่อเพิ่มสิทธิ์</p>
          <SignOutButton />
        </div>
      </div>
    );
  }

  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <div className="adm-side-head">
          <p className="adm-brand">NAVINYA 1979</p>
          <p className="adm-side-title">ระบบจัดการเนื้อหา</p>
        </div>
        <AdminNav />
        <div className="adm-side-foot">
          <a href="/" target="_blank" rel="noopener" className="adm-side-link">
            ↗ ดูเว็บไซต์จริง
          </a>
          <p className="adm-user">{user.display_name || user.email}</p>
          <SignOutButton />
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
