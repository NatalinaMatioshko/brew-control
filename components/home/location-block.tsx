import {
  hasMapsUrl,
  locationSummary,
  siteConfig,
} from "@/lib/site-config";

export function LocationBlock() {
  const mapsReady = hasMapsUrl();

  return (
    <section
      aria-labelledby="location-heading"
      className="rounded-3xl border border-[var(--cafe-border)] bg-[var(--cafe-surface)] p-6 sm:p-8"
    >
      <h2
        id="location-heading"
        className="text-sm font-medium tracking-wide text-[var(--cafe-muted)]"
      >
        Локація
      </h2>
      <p className="mt-3 text-xl font-semibold tracking-tight text-[var(--cafe-ink)]">
        {locationSummary()}
      </p>
      <p className="mt-2 text-sm text-[var(--cafe-body)]">{siteConfig.addressLine}</p>
      <p className="mt-4 text-sm text-[var(--cafe-body)]">{siteConfig.hoursLabel}</p>
      <p className="mt-6 text-sm leading-relaxed text-[var(--cafe-body)]">
        Детальний маршрут на карті з’явиться ближче до відкриття. Поки що орієнтир —
        вул. Німанська, 4 біля метро {siteConfig.neighborhood}.
      </p>

      {mapsReady ? (
        <a
          href={siteConfig.mapsUrl!}
          className="mt-6 inline-flex rounded-full bg-[var(--cafe-accent)] px-5 py-3 text-sm font-semibold text-[var(--cafe-surface)] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cafe-ink)]"
          rel="noopener noreferrer"
          target="_blank"
        >
          Прокласти маршрут
        </a>
      ) : null}
    </section>
  );
}
