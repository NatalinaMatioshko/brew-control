import { signOut } from "@/auth";
import { getAdminAccess, roleLabel } from "@/lib/admin-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const access = await getAdminAccess();

  if (access.status === "unauthenticated") {
    redirect("/admin/login");
  }

  if (access.status === "forbidden") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-100 p-6">
        <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-stone-900">Немає доступу</h1>
          <p className="mt-3 text-sm text-red-700">
            У вас немає доступу до адмін-панелі.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex font-semibold text-amber-700 hover:text-amber-800"
          >
            На головну
          </Link>
        </section>
      </main>
    );
  }

  const { user } = access.session;
  const displayName = user.name ?? user.email ?? "Користувач";

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 p-6">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-medium text-amber-700">Brew Control</p>
        <h1 className="text-3xl font-bold text-stone-900">Адмін-панель</h1>
        <p className="mt-4 text-stone-700">
          Ви увійшли як <span className="font-semibold">{displayName}</span>
          {user.role ? (
            <>
              {" "}
              · роль:{" "}
              <span className="font-semibold">{roleLabel(user.role)}</span>
            </>
          ) : null}
          .
        </p>
        <p className="mt-3 text-stone-500">
          Дашборд меню, складу й витрат з’явиться на наступних етапах.
        </p>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
          className="mt-8"
        >
          <button
            className="w-full rounded-xl bg-stone-900 px-4 py-3 font-semibold text-white transition hover:bg-stone-700"
            type="submit"
          >
            Вийти
          </button>
        </form>
      </section>
    </main>
  );
}
