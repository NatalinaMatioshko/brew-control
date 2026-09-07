import { OpeningCalculator } from "@/components/opening-calculator/opening-calculator";
import { getAdminAccess } from "@/lib/admin-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Калькулятор розхідників · Brew Control",
};

export default async function OpeningCalculatorPage() {
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

  return <OpeningCalculator />;
}
