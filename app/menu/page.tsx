import { SiteHeader } from "@/components/site-header";
import { formatPriceUah } from "@/lib/menu/money";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Меню · Brew Control",
  description: "Меню кав’ярні Brew Control: напої та десерти.",
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
    <div className="min-h-full bg-[#f6efe6] text-[#3c2a21]">
      <a
        href="#menu-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
      >
        Перейти до меню
      </a>
      <SiteHeader />

      <main id="menu-content" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium tracking-wide text-[#8a7262]">Brew Control</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Меню</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#5c4638]">
          Свіжа кава, авторські напої й невеликі солодощі — обирайте спокійно, без поспіху.
        </p>

        {categories.length === 0 ? (
          <section
            aria-label="Меню незабаром"
            className="mt-14 rounded-3xl border border-dashed border-[#d9c7b5] bg-[#fbf6f0] px-6 py-16 text-center"
          >
            <p className="mx-auto max-w-md text-lg leading-relaxed text-[#5c4638]">
              Меню незабаром з’явиться. Завітайте до нас на каву.
            </p>
          </section>
        ) : (
          <div className="mt-14 space-y-12">
            {categories.map((category) => (
              <section key={category.id} aria-labelledby={`category-${category.id}`}>
                <h2
                  id={`category-${category.id}`}
                  className="border-b border-[#e4d5c5] pb-3 text-2xl font-semibold tracking-tight"
                >
                  {category.name}
                </h2>

                <ul className="mt-6 space-y-4">
                  {category.products.map((product) => (
                    <li key={product.id}>
                      <article className="rounded-2xl border border-[#e4d5c5] bg-[#fbf6f0] px-5 py-5 sm:px-6">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                          <h3 className="text-lg font-semibold text-[#3c2a21]">
                            {product.name}
                          </h3>
                          <p className="text-base font-semibold tabular-nums text-[#3c2a21]">
                            {formatPriceUah(product.priceInKopecks)}
                          </p>
                        </div>
                        {product.description ? (
                          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5c4638]">
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
    </div>
  );
}
