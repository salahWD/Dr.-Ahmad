import { redirect } from "next/navigation";
import { ActionForm, SubmitButton } from "@/components/admin/forms";
import { login, setAdminLang } from "@/lib/admin-actions";
import { getAdminDict } from "@/lib/admin-lang";
import { adminConfigured, isAdmin } from "@/lib/auth";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin/");
  const { lang, t: d } = await getAdminDict();
  return (
    <main className="a-login">
      <div className="a-login-card">
        <img src="/mark.svg" width={52} height={52} alt="" />
        <h1>{d.loginTitle}</h1>
        <p>{adminConfigured() ? d.loginLead : d.notConfigured}</p>
        <ActionForm action={login} className="a-form">
          <label className="a-field">
            <span>{d.password}</span>
            <input type="password" name="password" autoComplete="current-password" required autoFocus dir="ltr" />
          </label>
          <SubmitButton className="a-btn a-btn-wide">{d.login}</SubmitButton>
        </ActionForm>
        <form action={setAdminLang} className="a-login-lang">
          <input type="hidden" name="lang" value={lang === "ar" ? "en" : "ar"} />
          <button type="submit" lang={lang === "ar" ? "en" : "ar"}>
            {d.switchLang}
          </button>
        </form>
      </div>
    </main>
  );
}
