import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPriceUah } from "@/lib/menu/money";
import { siteConfig } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Меню",
  description: `Меню кав’ярні ${siteConfig.displayName}: напої та десерти.`,
};

export default async function PublicMenuPage() {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
      products: {
        some: {
          isActive: true,
          isAvailable: true,
        },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      products: {
        where: {
          isActive: true,
          isAvailable: true,
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          description: true,
          priceInKopecks: true,
        },
      },
    },
  });

  return (
    <div className="min-h-full bg-[var(--cafe-bg)] text-[var(--cafe-ink)]">
      <a
        href="#menu-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--cafe-ink)]"
      >
        Перейти до меню
      </a>
      <SiteHeader />

      <main
        id="menu-content"
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16"
      >
        <p className="text-sm font-medium tracking-wide text-[var(--cafe-muted)]">
          {siteConfig.displayName}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Меню
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--cafe-body)]">
          {categories.length === 0
            ? "Меню готуємо до відкриття. Позиції з’являться тут, щойно все буде готово."
            : "Свіжа кава, напої й невеликі солодощі — обирайте спокійно, без поспіху."}
        </p>

        {categories.length === 0 ? (
          <section
            aria-label="Меню незабаром"
            className="mt-14 rounded-3xl border border-dashed border-[var(--cafe-border-strong)] bg-[var(--cafe-surface)] px-6 py-16 text-center"
          >
            <p className="mx-auto max-w-md text-lg leading-relaxed text-[var(--cafe-body)]">
              Меню готуємо до відкриття. {siteConfig.openingDateLabel}. Деталі
              оголосимо ближче до старту.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex rounded-full bg-[var(--cafe-accent)] px-5 py-3 text-sm font-semibold text-[var(--cafe-surface)] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cafe-ink)]"
              >
                На головну
              </Link>
              <Link
                href="/#kontakty"
                className="text-sm font-semibold text-[var(--cafe-ink)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cafe-ink)]"
              >
                Контакти
              </Link>
            </div>
          </section>
        ) : (
          <div className="mt-14 space-y-12">
            {categories.map((category) => (
              <section
                key={category.id}
                aria-labelledby={`category-${category.id}`}
              >
                <h2
                  id={`category-${category.id}`}
                  className="border-b border-[var(--cafe-border)] pb-3 text-2xl font-semibold tracking-tight"
                >
                  {category.name}
                </h2>

                <ul className="mt-6 space-y-4">
                  {category.products.map((product) => (
                    <li key={product.id}>
                      <article className="rounded-2xl border border-[var(--cafe-border)] bg-[var(--cafe-surface)] px-5 py-5 sm:px-6">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                          <h3 className="text-lg font-semibold text-[var(--cafe-ink)]">
                            {product.name}
                          </h3>
                          <p className="text-base font-semibold tabular-nums text-[var(--cafe-ink)]">
                            {formatPriceUah(product.priceInKopecks)}
                          </p>
                        </div>
                        {product.description ? (
                          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--cafe-body)]">
                            {product.description}
                          </p>
                        ) : null}
                      </article>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
