import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 p-6">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-medium text-amber-700">Brew Control</p>
        <h1 className="text-3xl font-bold text-stone-900">Кав’ярня</h1>
        <p className="mt-4 text-stone-600 leading-relaxed">
          Облік меню, витратників і закупівель для щоденної роботи кав’ярні.
          Гостьове меню з’явиться тут пізніше. Персонал входить у захищену
          адмін-панель.
        </p>
        <Link
          href="/admin/login"
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-amber-600 px-4 py-3 font-semibold text-white transition hover:bg-amber-700"
        >
          Вхід для персоналу
        </Link>
      </section>
    </main>
  );
}
