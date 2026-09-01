import { signIn } from "@/auth";
import { getAdminAccess } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

type AdminLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const access = await getAdminAccess();
  const { error } = await searchParams;

  if (access.status === "authorized") {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 p-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-medium text-amber-700">Brew Control</p>
        <h1 className="text-3xl font-bold text-stone-900">Вхід для персоналу</h1>
        <p className="mt-3 text-stone-600">
          Увійти можуть лише запрошені співробітники з активним обліковим
          записом.
        </p>

        {access.status === "forbidden" ? (
          <p className="mt-6 text-sm text-red-700">
            У вас немає доступу до адмін-панелі.
          </p>
        ) : null}

        {error === "AccessDenied" || error === "OAuthAccountNotLinked" ? (
          <p className="mt-6 text-sm text-red-700">
            Вхід заборонено. Цей Google-акаунт не додано до Brew Control або
            його не вдалося прив’язати.
          </p>
        ) : null}

        {access.status === "unauthenticated" ? (
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/admin" });
            }}
            className="mt-8"
          >
            <button
              className="w-full rounded-xl bg-amber-600 px-4 py-3 font-semibold text-white transition hover:bg-amber-700"
              type="submit"
            >
              Увійти через Google
            </button>
          </form>
        ) : null}
      </section>
    </main>
  );
}
