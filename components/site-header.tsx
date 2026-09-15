import Link from "next/link";

const navItems = [
  { href: "/#prostir", label: "Простір" },
  { href: "/menu", label: "Меню" },
  { href: "/#kontakty", label: "Контакти" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e4d5c5]/80 bg-[#f6efe6]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-[#3c2a21]"
        >
          Brew Control
        </Link>

        <nav
          aria-label="Навігація сайтом"
          className="hidden items-center gap-8 md:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[#5c4638] transition hover:text-[#3c2a21]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="text-sm text-[#8a7262] underline-offset-4 transition hover:text-[#5c4638] hover:underline"
          >
            Вхід для персоналу
          </Link>
        </nav>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-lg px-3 py-2 text-sm font-medium text-[#3c2a21] ring-1 ring-[#d9c7b5]">
            Меню
          </summary>
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#e4d5c5] bg-[#fbf6f0] p-3 shadow-sm">
            <nav aria-label="Мобільна навігація" className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm text-[#5c4638] hover:bg-[#f0e4d6]"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/admin/login"
                className="rounded-lg px-3 py-2 text-sm text-[#8a7262] hover:bg-[#f0e4d6]"
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
