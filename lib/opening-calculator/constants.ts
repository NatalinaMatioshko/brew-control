export const PACK = {
  cup: 50,
  lid: 50,
  coffeeG: 1000,
  milkMl: 1000,
  matchaG: 50,
  cocoaG: 250,
  tea: 25,
  napkin: 200,
  stirrer: 250,
  straw: 100,
  sugar: 200,
  sleeve: 50,
  carrier: 50,
};

export const CUP_SOURCE = {
  name: "Petrovka HoReCa",
  url: "https://petrovka-horeca.com.ua/uk/stakany-bumazhnye-dvuhsloynye-kraft/",
  note: "Двошарові крафт, ціна зі знижкою",
};

export const LID_SOURCE = {
  name: "Petrovka HoReCa",
  url: "https://petrovka-horeca.com.ua/uk/kryshki-na-stakany-250-evro-340-ml-78-79-80-81-mm/",
  note: "Пластикові кришки під крафт-стакани",
};

export const LID_CATALOG = {
  r71: {
    title: "R-71 чорна",
    forCups: "180 мл",
    sku: "105137",
    pack: 50,
    packPrice: 41,
    unitPrice: 0.82,
    diameter: 71,
    url: "https://petrovka-horeca.com.ua/uk/kryshki-na-stakany-175-ml-69-70-71-mm/",
  },
  r79: {
    title: "R-79 чорна",
    forCups: "250 мл євро",
    sku: "104465",
    pack: 50,
    packPrice: 47,
    unitPrice: 0.94,
    diameter: 79,
    url: "https://petrovka-horeca.com.ua/uk/kryshki-na-stakany-250-evro-340-ml-78-79-80-81-mm/",
  },
  r80: {
    title: "R-80 чорна",
    forCups: "340 мл",
    sku: "103568",
    pack: 50,
    packPrice: 47,
    unitPrice: 0.94,
    diameter: 80,
    url: "https://petrovka-horeca.com.ua/uk/kryshki-na-stakany-250-evro-340-ml-78-79-80-81-mm/",
  },
} as const;

export type LidId = keyof typeof LID_CATALOG;
export type CupSize = 110 | 180 | 250 | 340;

export const CUP_CATALOG: Record<
  CupSize,
  {
    sku: string;
    pack: number;
    packPrice: number;
    unitPrice: number;
    title: string;
    lidId: LidId | null;
  }
> = {
  110: {
    sku: "23009",
    pack: 50,
    packPrice: 85,
    unitPrice: 1.7,
    title: "110 мл двошаровий крафт",
    lidId: null,
  },
  180: {
    sku: "22942",
    pack: 50,
    packPrice: 99.5,
    unitPrice: 1.99,
    title: "180 мл двошаровий крафт",
    lidId: "r71",
  },
  250: {
    sku: "22180",
    pack: 30,
    packPrice: 79,
    unitPrice: 2.63,
    title: "250 мл євро двошаровий крафт",
    lidId: "r79",
  },
  340: {
    sku: "20629",
    pack: 15,
    packPrice: 51,
    unitPrice: 3.4,
    title: "340 мл двошаровий крафт",
    lidId: "r80",
  },
};

export const RESERVE_OPTIONS = [
  { value: 0.1, label: "10%" },
  { value: 0.15, label: "15%" },
  { value: 0.2, label: "20%" },
] as const;

export const TAKEAWAY_OPTIONS = [
  { value: 0.5, label: "50%" },
  { value: 0.6, label: "60%" },
  { value: 0.7, label: "70%" },
  { value: 0.8, label: "80%" },
  { value: 1, label: "100%" },
] as const;

export type MenuItem = {
  id: string;
  name: string;
  icon: string;
  cupSize: CupSize;
  daily: number;
  hot: boolean;
  coffeeG: number;
  milkMl: number;
  matchaG: number;
  cocoaG: number;
  teaBags: number;
  lidId: LidId | null;
};

export type MenuRow = MenuItem & { total: number };

function drink(
  item: Pick<MenuItem, "id" | "name" | "icon" | "cupSize" | "daily"> &
    Partial<Omit<MenuItem, "id" | "name" | "icon" | "cupSize" | "daily">>,
): MenuItem {
  return {
    hot: true,
    coffeeG: 0,
    milkMl: 0,
    matchaG: 0,
    cocoaG: 0,
    teaBags: 0,
    lidId: CUP_CATALOG[item.cupSize]?.lidId ?? null,
    ...item,
  };
}

export const MENU_ITEMS: MenuItem[] = [
  drink({ id: "espresso", name: "Еспресо", icon: "coffee", cupSize: 110, coffeeG: 9, daily: 10 }),
  drink({ id: "doppio", name: "Допіо", icon: "coffee", cupSize: 110, coffeeG: 18, daily: 5 }),
  drink({ id: "macchiato", name: "Макіато", icon: "milk", cupSize: 110, coffeeG: 9, milkMl: 20, daily: 3 }),
  drink({ id: "ristretto", name: "Рістрето", icon: "coffee", cupSize: 110, coffeeG: 7, daily: 2 }),
  drink({ id: "cortado", name: "Кортадо", icon: "milk", cupSize: 110, coffeeG: 18, milkMl: 40, daily: 3 }),

  drink({ id: "cappuccino", name: "Капучино", icon: "milk", cupSize: 180, coffeeG: 18, milkMl: 120, daily: 18 }),
  drink({ id: "flatwhite", name: "Флет-вайт", icon: "milk", cupSize: 180, coffeeG: 18, milkMl: 110, daily: 8 }),
  drink({ id: "filterSmall", name: "Фільтр мал.", icon: "funnel", cupSize: 180, coffeeG: 12, daily: 6 }),
  drink({ id: "americano", name: "Американо", icon: "coffee", cupSize: 180, coffeeG: 18, daily: 4 }),
  drink({ id: "moka", name: "Мокачино", icon: "cookie", cupSize: 180, coffeeG: 18, cocoaG: 10, milkMl: 100, daily: 2 }),

  drink({ id: "latte", name: "Лате", icon: "cupSoda", cupSize: 250, coffeeG: 18, milkMl: 180, daily: 12 }),
  drink({ id: "raf", name: "Раф", icon: "milk", cupSize: 250, coffeeG: 18, milkMl: 180, daily: 4 }),
  drink({ id: "cocoaSmall", name: "Какао мал.", icon: "cookie", cupSize: 250, cocoaG: 20, milkMl: 200, daily: 3 }),
  drink({ id: "longBlack", name: "Лонг блек", icon: "coffee", cupSize: 250, coffeeG: 18, daily: 5 }),
  drink({ id: "filterMedium", name: "Фільтр сер.", icon: "funnel", cupSize: 250, coffeeG: 16, daily: 5 }),

  drink({ id: "cocoaLarge", name: "Какао вел.", icon: "cookie", cupSize: 340, cocoaG: 30, milkMl: 280, daily: 2 }),
  drink({ id: "filterLarge", name: "Фільтр вел.", icon: "funnel", cupSize: 340, coffeeG: 20, daily: 3 }),
  drink({ id: "tea", name: "Чай", icon: "leaf", cupSize: 340, teaBags: 1, daily: 4 }),
  drink({ id: "doubleCappuccino", name: "Дабл капучино", icon: "milk", cupSize: 340, coffeeG: 18, milkMl: 250, daily: 3 }),
  drink({ id: "latteLarge", name: "Лате вел.", icon: "cupSoda", cupSize: 340, coffeeG: 18, milkMl: 260, daily: 5 }),
];

export const DEFAULT_CUPS_PER_DAY = MENU_ITEMS.reduce((sum, item) => sum + item.daily, 0);
