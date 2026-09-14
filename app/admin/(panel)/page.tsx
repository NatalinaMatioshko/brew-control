import { auth } from "@/auth";
import { roleLabel } from "@/lib/admin-auth";
import Link from "next/link";

const quickLinks = [
  {
    href: "/admin/menu",
    title: "Меню",
    text: "Позиції напоїв і десертів для зали.",
  },
  {
    href: "/admin/orders",
    title: "Замовлення",
    text: "Закупівлі та внутрішні замовлення закладу.",
  },
  {
    href: "/admin/inventory",
    title: "Склад",
    text: "Залишки розхідників і продуктів.",
  },
  {
    href: "/admin/opening-calculator",
    title: "Калькулятор розхідників",
    text: "Стартова закупівля на період відкриття.",
  },
] as const;

export default async function AdminDashboardPage() {
  const session = await auth();
  const user = session?.user;
  const displayName = user?.name ?? user?.email ?? "Користувач";
  const roleText = user?.role ? roleLabel(user.role) : "";

  return (
    <main className="px-4 py-8 sm:px-6">
      <p className="text-sm font-medium text-[#8a7262]">Огляд</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#3c2a21]">
        Вітаємо, {displayName}
      </h1>
      {roleText ? (
        <p className="mt-3 text-[#5c4638]">
          Роль: <span className="font-semibold">{roleText}</span>
        </p>
      ) : null}
      <p className="mt-2 max-w-2xl text-[#5c4638]">
        Оберіть розділ, щоб продовжити роботу. Дашборд із показниками з’явиться
        пізніше.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {quickLinks.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block h-full rounded-2xl border border-[#e4d5c5] bg-[#fbf6f0] px-5 py-4 transition hover:border-[#c9a227]/50 hover:bg-[#fffaf3]"
            >
              <h2 className="text-lg font-semibold text-[#3c2a21]">{item.title}</h2>
              <p className="mt-2 text-sm text-[#5c4638]">{item.text}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
