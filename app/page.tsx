import { LocationBlock } from "@/components/home/location-block";
import { MenuTeaser } from "@/components/home/menu-teaser";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
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
      _count: {
        select: {
          products: {
            where: {
              isActive: true,
              isAvailable: true,
            },
          },
        },
      },
    },
  });

  const teaserCategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
    productCount: category._count.products,
  }));

  const hasSpaceImages = siteConfig.spaceImages.length > 0;

  return (
    <div id="top" className="min-h-full bg-[var(--cafe-bg)] text-[var(--cafe-ink)]">
      <a
        href="#prostir"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--cafe-ink)]"
      >
        Перейти до вмісту
      </a>
      <SiteHeader />

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:py-20">
          <div>
            <p className="text-sm font-medium tracking-wide text-[var(--cafe-muted)]">
              Незабаром у Києві
            </p>
            <h1 className="mt-2 max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {siteConfig.displayName}
            </h1>
            <p className="mt-4 text-base font-medium text-[var(--cafe-body)]">
              {siteConfig.openingDateLabel}
            </p>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[var(--cafe-body)]">
              {siteConfig.heroLead}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="inline-flex rounded-full bg-[var(--cafe-accent)] px-5 py-3 text-sm font-semibold text-[var(--cafe-surface)] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cafe-ink)]"
              >
                Переглянути меню
              </Link>
            </div>
          </div>

          <LocationBlock />
        </section>

        <section
          id="prostir"
          className="scroll-mt-24 border-t border-[var(--cafe-border)] bg-[var(--cafe-surface)]"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--cafe-ink)]">
              Простір
            </h2>
            {hasSpaceImages ? (
              <>
                <p className="mt-3 max-w-2xl text-[var(--cafe-body)]">
                  Кілька кадрів інтер’єру NOCE.
                </p>
                <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {siteConfig.spaceImages.map((image) => (
                    <li key={image.src}>
                      <figure className="overflow-hidden rounded-2xl bg-white ring-1 ring-[var(--cafe-border)]">
                        {/* Local paths only when provided in site-config */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="aspect-[4/3] w-full object-cover"
                        />
                        {image.caption ? (
                          <figcaption className="px-4 py-3 text-sm font-medium text-[var(--cafe-ink)]">
                            {image.caption}
                          </figcaption>
                        ) : null}
                      </figure>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--cafe-body)]">
                Фото простору з’являться ближче до відкриття. Ми готуємо тихий куточок
                біля метро {siteConfig.neighborhood} — без поспіху й зайвого шуму.
              </p>
            )}
          </div>
        </section>

        <MenuTeaser categories={teaserCategories} />
      </main>

      <SiteFooter />
    </div>
  );
}
