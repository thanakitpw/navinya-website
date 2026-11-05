import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <p className="adm-brand">NAVINYA 1979</p>
        <h1>เข้าสู่ระบบจัดการเนื้อหา</h1>
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="adm-hint">ลืมรหัสผ่านหรือยังไม่มีบัญชี ติดต่อผู้ดูแลระบบ</p>
      </div>
    </div>
  );
}
