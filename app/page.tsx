import { SiteHeader } from "@/components/site-header";

const spacePlaceholders = [
  { title: "До ремонту", tone: "from-[#d7c4ae] to-[#b08968]" },
  { title: "Після ремонту", tone: "from-[#efe3d3] to-[#c9a227]/40" },
  { title: "Бар", tone: "from-[#6f4e37] to-[#3c2a21]" },
  { title: "Інтер’єр", tone: "from-[#e8d5c4] to-[#a98467]" },
  { title: "Напої та десерти", tone: "from-[#c4a484] to-[#8d6e4c]" },
] as const;

const menuCategories = ["Кава", "Авторські напої", "Десерти"] as const;

export default function Home() {
  return (
    <div id="top" className="min-h-full bg-[#f6efe6] text-[#3c2a21]">
      <a
        href="#prostir"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
      >
        Перейти до вмісту
      </a>
      <SiteHeader />

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:py-20">
          <div>
            <p className="text-sm font-medium tracking-wide text-[#8a7262]">
              Кав’ярня
            </p>
            <h1 className="mt-2 max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Назва кав’ярні
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[#5c4638]">
              Тихе місце для ранкової чашки, розмови й паузи посеред дня. Свіжа
              кава, неспішний ритм і тепле світло — так ми уявляємо простір, який
              незабаром відкриється.
            </p>

            <dl className="mt-8 space-y-3 text-[#5c4638]">
              <div>
                <dt className="text-sm font-medium text-[#8a7262]">Адреса</dt>
                <dd>вул. Прикладна, 1, місто (замінити)</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-[#8a7262]">Графік</dt>
                <dd>Пн–Пт 08:00–20:00, Сб–Нд 09:00–18:00 (замінити)</dd>
              </div>
            </dl>

            {/* TODO: enable when a real maps URL for the café address is available */}
            <button
              type="button"
              disabled
              className="mt-8 inline-flex cursor-not-allowed rounded-full bg-[#6f4e37] px-5 py-3 text-sm font-semibold text-[#fbf6f0] opacity-60"
            >
              Прокласти маршрут
            </button>
          </div>

          <div className="rounded-3xl border border-[#e4d5c5] bg-[#fbf6f0] p-4 shadow-sm sm:p-6">
            <div
              aria-hidden="true"
              className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#e8dccd]"
            >
              <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(#d7c4ae_1px,transparent_1px),linear-gradient(90deg,#d7c4ae_1px,transparent_1px)] [background-size:28px_28px]" />
              <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6f4e37] ring-8 ring-[#6f4e37]/20" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#5c4638]">
              Тут буде інтерактивна карта. Поки що це легкий макет локації — без
              Google Maps, iframe і сторонніх ключів.
            </p>
          </div>
        </section>

        <section
          id="prostir"
          className="scroll-mt-24 border-t border-[#e4d5c5] bg-[#fbf6f0]"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight">Простір</h2>
            <p className="mt-3 max-w-2xl text-[#5c4638]">
              Фото інтер’єру з’являться після зйомки. Нижче — тимчасові макети
              кадрів, які ви зможете замінити локальними зображеннями.
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {spacePlaceholders.map((item) => (
                <li key={item.title}>
                  <figure className="overflow-hidden rounded-2xl bg-white ring-1 ring-[#e4d5c5]">
                    <div
                      className={`aspect-[4/3] bg-gradient-to-br ${item.tone}`}
                      role="img"
                      aria-label={item.title}
                    />
                    <figcaption className="px-4 py-3 text-sm font-medium text-[#3c2a21]">
                      {item.title}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="menu" className="scroll-mt-24">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">Меню</h2>
                <p className="mt-3 max-w-xl text-[#5c4638]">
                  Короткий попередній перегляд категорій. Позиції та ціни
                  з’являться пізніше, коли меню буде готове.
                </p>
              </div>
              <p className="rounded-full bg-[#efe3d3] px-4 py-2 text-sm font-medium text-[#5c4638]">
                Інтерактивне 3D-меню — незабаром
              </p>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {menuCategories.map((category) => (
                <li
                  key={category}
                  className="rounded-2xl border border-[#e4d5c5] bg-[#fbf6f0] px-5 py-8 text-center"
                >
                  <h3 className="text-xl font-semibold">{category}</h3>
                  <p className="mt-2 text-sm text-[#8a7262]">Незабаром</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer
        id="kontakty"
        className="scroll-mt-24 border-t border-[#e4d5c5] bg-[#3c2a21] text-[#f6efe6]"
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
          <div>
            <p className="text-sm font-medium text-[#d7c4ae]">Brew Control</p>
            <p className="mt-2 text-lg font-semibold">Назва кав’ярні</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-[#d7c4ae]">Контакти</h2>
            <p className="mt-2 text-sm leading-relaxed">
              вул. Прикладна, 1, місто (замінити)
              <br />
              Пн–Пт 08:00–20:00, Сб–Нд 09:00–18:00 (замінити)
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-[#d7c4ae]">Instagram</h2>
            <p className="mt-2 text-sm">@instagram (замінити)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
