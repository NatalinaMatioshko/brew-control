import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const navItems = [
  { href: "/#prostir", label: "Простір" },
  { href: "/menu", label: "Меню" },
  { href: "/#kontakty", label: "Контакти" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--cafe-border)]/80 bg-[var(--cafe-bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-[var(--cafe-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cafe-ink)]"
        >
          {siteConfig.displayName}
        </Link>

        <nav
          aria-label="Навігація сайтом"
          className="hidden items-center gap-8 md:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--cafe-body)] transition hover:text-[var(--cafe-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cafe-ink)]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="text-sm text-[var(--cafe-muted)] underline-offset-4 transition hover:text-[var(--cafe-body)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cafe-ink)]"
          >
            Вхід для персоналу
          </Link>
        </nav>

        <details className="group relative md:hidden">
          <summary className="cursor-pointer list-none rounded-lg px-3 py-2 text-sm font-medium text-[var(--cafe-ink)] ring-1 ring-[var(--cafe-border-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cafe-ink)]">
            Меню
          </summary>
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-[var(--cafe-border)] bg-[var(--cafe-surface)] p-3 shadow-sm">
            <nav aria-label="Мобільна навігація" className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm text-[var(--cafe-body)] hover:bg-[#f0e4d6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cafe-ink)]"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/admin/login"
                className="rounded-lg px-3 py-2 text-sm text-[var(--cafe-muted)] hover:bg-[#f0e4d6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cafe-ink)]"
              >
                Вхід для персоналу
              </Link>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
