import {
  hasInstagram,
  hasPhone,
  siteConfig,
} from "@/lib/site-config";

export function SiteFooter() {
  const showPhone = hasPhone();
  const showInstagram = hasInstagram();

  return (
    <footer
      id="kontakty"
      className="scroll-mt-24 border-t border-[var(--cafe-border)] bg-[var(--cafe-ink)] text-[var(--cafe-bg)]"
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <div>
          <p className="text-sm font-medium text-[var(--cafe-cream)]">Кав’ярня</p>
          <p className="mt-2 text-lg font-semibold tracking-tight">
            {siteConfig.displayName}
          </p>
          <p className="mt-2 text-sm text-[var(--cafe-cream)]">
            {siteConfig.openingDateLabel}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-[var(--cafe-cream)]">Контакти</h2>
          <p className="mt-2 text-sm leading-relaxed">
            {siteConfig.addressLine}
            <br />
            Метро {siteConfig.neighborhood}
            <br />
            {siteConfig.hoursLabel}
          </p>
          {showPhone ? (
            <p className="mt-3 text-sm">
              <a
                href={`tel:${siteConfig.phone!.replace(/\s+/g, "")}`}
                className="underline-offset-4 hover:underline"
              >
                {siteConfig.phone}
              </a>
            </p>
          ) : null}
        </div>

        <div>
          <h2 className="text-sm font-medium text-[var(--cafe-cream)]">Онлайн</h2>
          {showInstagram ? (
            <p className="mt-2 text-sm">
              {siteConfig.instagramUrl ? (
                <a
                  href={siteConfig.instagramUrl}
                  className="underline-offset-4 hover:underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Instagram
                  {siteConfig.instagramHandle
                    ? ` · @${siteConfig.instagramHandle.replace(/^@/, "")}`
                    : ""}
                </a>
              ) : (
                <>@{siteConfig.instagramHandle!.replace(/^@/, "")}</>
              )}
            </p>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-[var(--cafe-cream)]">
              Соцмережі оголосимо ближче до відкриття.
            </p>
          )}
          <p className="mt-4 text-sm leading-relaxed text-[var(--cafe-cream)]">
            Маршрут на карті з’явиться ближче до відкриття.
          </p>
        </div>
      </div>
    </footer>
  );
}
