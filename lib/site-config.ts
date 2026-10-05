/**
 * Guest-facing café content. Fill confirmed facts only; leave unknown fields null.
 * No secrets, env vars, or admin data here.
 */

export type SpaceImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type SiteConfig = {
  displayName: string;
  city: string;
  /** District / metro area — not a city name. */
  neighborhood: string;
  addressLine: string;
  hoursLabel: string;
  openingDateLabel: string;
  phone: string | null;
  instagramHandle: string | null;
  instagramUrl: string | null;
  mapsUrl: string | null;
  spaceImages: SpaceImage[];
  /** Short hero supporting copy (Ukrainian). */
  heroLead: string;
};

export const siteConfig: SiteConfig = {
  displayName: "NOCE",
  city: "Київ",
  neighborhood: "Звіринецька",
  addressLine: "вул. Німанська, 4, Київ",
  hoursLabel: "Щодня 08:00–20:00",
  openingDateLabel: "Відкриваємось 12 жовтня",
  phone: null,
  instagramHandle: null,
  instagramUrl: null,
  mapsUrl: null,
  spaceImages: [],
  heroLead:
    "Тихе місце біля метро Звіринецька для ранкової кави, розмови й паузи посеред дня. Свіжа кава, неспішний ритм і тепле світло — так ми готуємо простір до зустрічі з вами.",
};

export function hasMapsUrl(config: SiteConfig = siteConfig): boolean {
  return Boolean(config.mapsUrl?.trim());
}

export function hasPhone(config: SiteConfig = siteConfig): boolean {
  return Boolean(config.phone?.trim());
}

export function hasInstagram(config: SiteConfig = siteConfig): boolean {
  return Boolean(
    config.instagramUrl?.trim() || config.instagramHandle?.trim(),
  );
}

export function locationSummary(config: SiteConfig = siteConfig): string {
  return `Німанська, 4 · ${config.neighborhood} · ${config.city}`;
}
