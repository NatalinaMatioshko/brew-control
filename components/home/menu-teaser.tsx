import Link from "next/link";

export type MenuTeaserCategory = {
  id: string;
  name: string;
  productCount: number;
};

type MenuTeaserProps = {
  categories: MenuTeaserCategory[];
};

function formatProductCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return `${count} позиція`;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} позиції`;
  }
  return `${count} позицій`;
}

export function MenuTeaser({ categories }: MenuTeaserProps) {
  const hasCategories = categories.length > 0;

  return (
    <section id="menu" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--cafe-ink)]">
              Меню
            </h2>
            <p className="mt-3 max-w-xl text-[var(--cafe-body)]">
              {hasCategories
                ? "Категорії, які вже готуємо до відкриття. Повний список — на сторінці меню."
                : "Меню готуємо до відкриття. Деталі з’являться тут і на окремій сторінці."}
            </p>
          </div>
          <Link
            href="/menu"
            className="rounded-full bg-[var(--cafe-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--cafe-surface)] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cafe-ink)]"
          >
            Переглянути меню
          </Link>
        </div>

        {hasCategories ? (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <li
                key={category.id}
                className="rounded-2xl border border-[var(--cafe-border)] bg-[var(--cafe-surface)] px-5 py-6"
              >
                <h3 className="text-xl font-semibold text-[var(--cafe-ink)]">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-[var(--cafe-muted)]">
                  {formatProductCount(category.productCount)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-[var(--cafe-border-strong)] bg-[var(--cafe-surface)] px-6 py-12 text-center">
            <p className="mx-auto max-w-md text-base leading-relaxed text-[var(--cafe-body)]">
              Меню готуємо до відкриття. Завітайте на сторінку меню трохи пізніше —
              або слідкуйте за новинами ближче до 12 жовтня.
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-flex text-sm font-semibold text-[var(--cafe-ink)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cafe-ink)]"
            >
              Відкрити сторінку меню
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
