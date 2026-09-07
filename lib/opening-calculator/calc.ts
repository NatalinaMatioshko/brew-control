import {
  CUP_CATALOG,
  CUP_SOURCE,
  LID_CATALOG,
  LID_SOURCE,
  PACK,
  type CupSize,
  type LidId,
  type MenuRow,
} from "@/lib/opening-calculator/constants";
import {
  CHAMPS,
  CHAMPS_URL,
  EXTRA_SUPPLIES,
  EXTRA_USAGE,
  PETROVKA_URL,
  SUPPLIES,
  USAGE,
  WISHLIST,
  WISHLIST_USAGE,
} from "@/lib/opening-calculator/supplies";
import { formatMoney, formatNumber, formatOne, formatPackBuy, plural } from "@/lib/opening-calculator/format";

type CatalogInput = {
  pack: number;
  packPrice: number;
  unitPrice: number;
  sku: string;
  title: string;
  url?: string;
  minPacks?: number;
};

export type PricedItem = {
  needed: number;
  buy: number;
  packs: number;
  pack: number;
  packPrice: number;
  unitPrice: number;
  sku: string;
  title: string;
  url?: string;
  cost: number;
};

export type PricedCup = {
  key: string | number;
  total: number;
  size: number;
  names: string[];
  needed: number;
  buy: number;
  packs: number;
  pack: number;
  sku?: string;
  unitPrice: number;
  packPrice: number;
  lidId: LidId | null;
  cost: number;
};

export type PricedLid = {
  key: string | number;
  total: number;
  lidId: string;
  names: string[];
  needed: number;
  buy: number;
  packs: number;
  pack: number;
  title: string;
  forCups: string;
  diameter?: number;
  sku?: string;
  unitPrice: number;
  packPrice: number;
  url?: string;
  cost: number;
};

export type PricedMilk = PricedItem & { share: number; icon: string };
export type PricedTea = PricedItem & { share: number; icon?: string; note?: string };
export type PricedWishlistTea = PricedItem & { icon?: string; note?: string };

export type ComputeResult = {
  days: number;
  reserve: number;
  takeaway: number;
  totalDaily: number;
  totalPeriod: number;
  takeawayDrinks: number;
  takeawayHot: number;
  cups: PricedCup[];
  cupsCost: number;
  lids: PricedLid[];
  lidsCost: number;
  coffee: PricedItem;
  coffeeMenuKg: number;
  matcha: PricedItem;
  teas: PricedTea[];
  milkCleaner: PricedItem;
  groupCleaner: PricedItem;
  milks: PricedMilk[];
  napkin: PricedItem;
  stirrer: PricedItem;
  straw: PricedItem;
  maika: PricedItem;
  sugar: PricedItem;
  sleeve: PricedItem;
  carrier2: PricedItem;
  carrier4: PricedItem;
  coffeeCost: number;
  champsCost: number;
  milkCost: number;
  smallCost: number;
  grandTotal: number;
  extras: {
    cloth: PricedItem;
    gloves: PricedItem;
    sanitizer: PricedItem;
    dishSoap: PricedItem;
    kraftBag: PricedItem;
    dessertBox: PricedItem;
    dessertLid: PricedItem;
    toiletSoap: PricedItem;
    toiletPaper: PricedItem;
    wetWipes: PricedItem;
    cleaningWipes: PricedItem;
    paperTowel: PricedItem;
  };
  extraCost: number;
  wishlist: {
    trash60: PricedItem;
    trash120: PricedItem;
    matchaSet: PricedItem;
    matchaSieve: PricedItem;
    towelHolder: PricedItem;
  };
  wishlistTeas: PricedWishlistTea[];
  wishlistCost: number;
  combinedTotal: number;
};

export type ResultCard = {
  title: string;
  icon: string;
  amount: string;
  price: string;
  detail: string[];
};

export type ResultGroup = {
  title: string;
  items: ResultCard[];
  total: {
    label: string;
    amount: string;
    hint: string;
    href: string;
    linkLabel: string;
  } | null;
};

export function roundUp(value: number, step = 1) {
  if (value <= 0) return 0;
  return Math.ceil(value / step) * step;
}

function bump<T extends { total: number }>(
  map: Record<string, T>,
  key: string | number,
  amount: number,
  extra: Omit<T, "key" | "total"> & Record<string, unknown>,
) {
  const id = String(key);
  if (!map[id]) {
    map[id] = { key, total: 0, ...extra } as T;
  }
  map[id].total += amount;
}

function line(needed: number, pack: number) {
  const buy = roundUp(needed, pack);
  return { needed, buy, packs: pack ? buy / pack : 0 };
}

function priced(needed: number, catalog: CatalogInput): PricedItem {
  const qty = line(needed, catalog.pack);
  const packs = needed > 0 && catalog.minPacks
    ? Math.max(catalog.minPacks, qty.packs)
    : qty.packs;
  const buy = packs * catalog.pack;
  return {
    needed,
    buy,
    packs,
    pack: catalog.pack,
    packPrice: catalog.packPrice,
    unitPrice: catalog.unitPrice,
    sku: catalog.sku,
    title: catalog.title,
    url: catalog.url,
    cost: packs * catalog.packPrice,
  };
}

type SupplyCardInput = {
  title: string;
  icon?: string;
  amount: string;
  cost: number;
  buy: number;
};

function supplyCard(item: SupplyCardInput | null | undefined, extraDetail: Array<string | undefined | false> = []): ResultCard | null {
  if (!item || item.buy <= 0) return null;
  return {
    title: item.title,
    icon: item.icon || "package",
    amount: item.amount,
    price: item.cost > 0 ? formatMoney(item.cost) : "",
    detail: extraDetail.filter((line) => Boolean(line)) as string[],
  };
}

function isPresent<T>(item: T | null): item is T {
  return item !== null;
}

function isCupSize(value: number): value is CupSize {
  return value === 110 || value === 180 || value === 250 || value === 340;
}

function isLidId(value: string): value is LidId {
  return value === "r71" || value === "r79" || value === "r80";
}

export function compute(
  rows: MenuRow[],
  { days, reserve, takeaway }: { days: number; reserve: number; takeaway: number },
): ComputeResult {
  const cups: Record<string, { key: string | number; total: number; size: number; names: string[] }> = {};
  const lids: Record<string, { key: string | number; total: number; lidId: string; names: string[] }> = {};
  let coffeeFromMenuG = 0;
  let milkMl = 0;
  let teaCups = 0;
  let napkins = 0;
  let stirrers = 0;
  let straws = 0;
  let sugar = 0;
  let sleeves = 0;
  let takeawayDrinks = 0;
  let takeawayHot = 0;

  rows.forEach((row) => {
    const takeawayQty = row.total * takeaway;
    takeawayDrinks += takeawayQty;
    coffeeFromMenuG += (row.coffeeG || 0) * row.total;
    milkMl += (row.milkMl || 0) * row.total;
    teaCups += (row.teaBags || 0) * row.total;
    napkins += row.total * USAGE.napkinPerDrink;
    sugar += row.total * USAGE.sugarShare;

    if (row.daily > 0 && takeawayQty > 0) {
      bump(cups, row.cupSize, takeawayQty, { size: row.cupSize, names: [] });
      if (!cups[String(row.cupSize)].names.includes(row.name)) {
        cups[String(row.cupSize)].names.push(row.name);
      }
      if (row.lidId) {
        bump(lids, row.lidId, takeawayQty, { lidId: row.lidId, names: [] });
        if (!lids[row.lidId].names.includes(row.name)) {
          lids[row.lidId].names.push(row.name);
        }
      }
    }

    if (row.hot) {
      stirrers += takeawayQty;
      if (row.cupSize !== 110) sleeves += takeawayQty;
      takeawayHot += takeawayQty;
    }
    if (row.cupSize !== 110) straws += takeawayQty;
  });

  const add = (value: number) => value * (1 + reserve);
  const totalDaily = rows.reduce((sum, row) => sum + row.daily, 0);
  const totalPeriod = rows.reduce((sum, row) => sum + row.total, 0);
  const scale14 = days / 14;

  const pricedCups = Object.values(cups)
    .sort((a, b) => a.size - b.size)
    .map((cup) => {
      const catalog = isCupSize(cup.size) ? CUP_CATALOG[cup.size] : undefined;
      const pack = catalog?.pack ?? PACK.cup;
      const qty = line(add(cup.total), pack);
      const cost = catalog ? qty.packs * catalog.packPrice : 0;
      return {
        ...cup,
        ...qty,
        pack,
        sku: catalog?.sku,
        unitPrice: catalog?.unitPrice ?? 0,
        packPrice: catalog?.packPrice ?? 0,
        lidId: catalog?.lidId ?? null,
        cost,
      };
    });

  const pricedLids = Object.values(lids)
    .map((lid) => {
      const catalog = isLidId(lid.lidId) ? LID_CATALOG[lid.lidId] : undefined;
      const pack = catalog?.pack ?? PACK.lid;
      const qty = line(add(lid.total), pack);
      const cost = catalog ? qty.packs * catalog.packPrice : 0;
      return {
        ...lid,
        ...qty,
        pack,
        title: catalog?.title ?? lid.lidId,
        forCups: catalog?.forCups ?? "",
        diameter: catalog?.diameter,
        sku: catalog?.sku,
        unitPrice: catalog?.unitPrice ?? 0,
        packPrice: catalog?.packPrice ?? 0,
        url: catalog?.url,
        cost,
      };
    })
    .sort((a, b) => (a.diameter ?? 0) - (b.diameter ?? 0));

  const coffeeMenuKg = add(coffeeFromMenuG) / 1000;
  const coffeePlanKg = CHAMPS.coffeeKgPer14Days * scale14;
  const coffee = priced(Math.max(coffeeMenuKg, coffeePlanKg) * 1000, CHAMPS.coffee);

  const matcha = priced(CHAMPS.matchaGPer14Days * scale14, CHAMPS.matcha);
  const teaNeeded = add(teaCups * USAGE.teaGPerCup);
  const teaShare = CHAMPS.teas.length ? 1 / CHAMPS.teas.length : 0;
  const teas = CHAMPS.teas.map((catalog) => ({
    ...priced(teaNeeded * teaShare, catalog),
    share: teaShare,
    icon: catalog.icon,
    note: catalog.note,
  }));
  const milkCleaner = priced(Math.max(1, Math.ceil(scale14)), CHAMPS.milkCleaner);
  const groupCleaner = priced(Math.max(1, Math.ceil(scale14)), CHAMPS.groupCleaner);

  const milkNeeded = add(milkMl);
  const milks = [
    { key: "regular", share: USAGE.milk.regular, catalog: SUPPLIES.milkRegular, icon: "milk" },
    { key: "lactoseFree", share: USAGE.milk.lactoseFree, catalog: SUPPLIES.milkLactoseFree, icon: "milkOff" },
    { key: "oat", share: USAGE.milk.oat, catalog: SUPPLIES.milkOat, icon: "wheat" },
    { key: "almond", share: USAGE.milk.almond, catalog: SUPPLIES.milkAlmond, icon: "nut" },
    { key: "coconut", share: USAGE.milk.coconut, catalog: SUPPLIES.milkCoconut, icon: "nut" },
    { key: "banana", share: USAGE.milk.banana, catalog: SUPPLIES.milkBanana, icon: "banana" },
  ].map((entry) => ({
    ...priced(milkNeeded * entry.share, entry.catalog),
    share: entry.share,
    icon: entry.icon,
  }));

  const napkin = priced(add(napkins), SUPPLIES.napkin);
  const stirrer = priced(add(stirrers), SUPPLIES.stirrer);
  const straw = priced(add(straws * USAGE.strawShare), SUPPLIES.straw);
  const maika = priced(add(takeawayDrinks * USAGE.maikaShare), SUPPLIES.maika);
  const sugarItem = priced(add(sugar), SUPPLIES.sugar);
  const sleeve = priced(add(sleeves), SUPPLIES.sleeve);
  const carrier2 = priced(add(takeawayDrinks * USAGE.carrier2Share / 2), SUPPLIES.carrier2);
  const carrier4 = priced(add(takeawayDrinks * USAGE.carrier4Share / 4), SUPPLIES.carrier4);

  const cupsCost = pricedCups.reduce((sum, cup) => sum + cup.cost, 0);
  const lidsCost = pricedLids.reduce((sum, lid) => sum + lid.cost, 0);
  const coffeeCost = coffee.cost;
  const champsCost = matcha.cost
    + teas.reduce((sum, item) => sum + item.cost, 0)
    + milkCleaner.cost
    + groupCleaner.cost;
  const milkCost = milks.reduce((sum, item) => sum + item.cost, 0);
  const smallCost = napkin.cost + stirrer.cost + straw.cost + maika.cost + sugarItem.cost + sleeve.cost + carrier2.cost + carrier4.cost;
  const grandTotal = cupsCost + lidsCost + champsCost + milkCost + smallCost;

  const weeks = days / 7;
  const extras = {
    cloth: priced(EXTRA_USAGE.clothsPerWeek * weeks, EXTRA_SUPPLIES.cloth),
    gloves: priced(EXTRA_USAGE.glovesPerWeek * weeks, EXTRA_SUPPLIES.gloves),
    sanitizer: priced(EXTRA_USAGE.sanitizerLPerWeek * weeks, EXTRA_SUPPLIES.sanitizer),
    dishSoap: priced(EXTRA_USAGE.dishSoapLPerWeek * weeks, EXTRA_SUPPLIES.dishSoap),
    kraftBag: priced(EXTRA_USAGE.kraftBagPerDay * days, EXTRA_SUPPLIES.kraftBag),
    dessertBox: priced(EXTRA_USAGE.dessertBoxPerDay * days, EXTRA_SUPPLIES.dessertBox),
    dessertLid: priced(EXTRA_USAGE.dessertBoxPerDay * days, EXTRA_SUPPLIES.dessertLid),
    toiletSoap: priced(EXTRA_USAGE.toiletSoapLPerWeek * weeks, EXTRA_SUPPLIES.toiletSoap),
    toiletPaper: priced(EXTRA_USAGE.toiletPaperRollsPerWeek * weeks, EXTRA_SUPPLIES.toiletPaper),
    wetWipes: priced(EXTRA_USAGE.wetWipesPerWeek * weeks, EXTRA_SUPPLIES.wetWipes),
    cleaningWipes: priced(EXTRA_USAGE.cleaningWipesPerWeek * weeks, EXTRA_SUPPLIES.cleaningWipes),
    paperTowel: priced(EXTRA_USAGE.paperTowelPerWeek * weeks, EXTRA_SUPPLIES.paperTowel),
  };
  const extraCost = Object.values(extras).reduce((sum, item) => sum + item.cost, 0);

  const wishlist = {
    trash60: priced(WISHLIST_USAGE.trash60PerWeek * weeks, WISHLIST.trash60),
    trash120: priced(WISHLIST_USAGE.trash120PerWeek * weeks, WISHLIST.trash120),
    matchaSet: priced(1, WISHLIST.matchaSet),
    matchaSieve: priced(1, WISHLIST.matchaSieve),
    towelHolder: priced(1, WISHLIST.towelHolder),
  };
  const wishlistTeas = WISHLIST.teas.map((catalog) => ({
    ...priced(catalog.pack, catalog),
    icon: catalog.icon,
    note: catalog.note,
  }));
  const wishlistCost = Object.values(wishlist).reduce((sum, item) => sum + item.cost, 0)
    + wishlistTeas.reduce((sum, item) => sum + item.cost, 0);

  return {
    days,
    reserve,
    takeaway,
    totalDaily,
    totalPeriod,
    takeawayDrinks: add(takeawayDrinks),
    takeawayHot: add(takeawayHot),
    cups: pricedCups,
    cupsCost,
    lids: pricedLids,
    lidsCost,
    coffee,
    coffeeMenuKg,
    matcha,
    teas,
    milkCleaner,
    groupCleaner,
    milks,
    napkin,
    stirrer,
    straw,
    maika,
    sugar: sugarItem,
    sleeve,
    carrier2,
    carrier4,
    coffeeCost,
    champsCost,
    milkCost,
    smallCost,
    grandTotal,
    extras,
    extraCost,
    wishlist,
    wishlistTeas,
    wishlistCost,
    combinedTotal: grandTotal + extraCost + coffeeCost,
  };
}

export function buildResultGroups(data: ComputeResult): ResultGroup[] {
  const reservePct = Math.round(data.reserve * 100);

  const cups = data.cups
    .filter((cup) => cup.buy > 0)
    .map((cup) => ({
      title: `Стакан ${cup.size} мл`,
      icon: "cupSoda",
      amount: formatPackBuy(cup.packs, cup.buy, "шт."),
      price: cup.cost > 0 ? formatMoney(cup.cost) : "",
      detail: [
        `Напої: ${cup.names.join(", ")}`,
        `Потрібно ${formatNumber(Math.round(cup.needed))} шт. · запас ${reservePct}% · фасовка ${cup.pack} шт.`,
        `${formatMoney(cup.unitPrice)}/шт · ${formatMoney(cup.packPrice)} за упаковку · арт. ${cup.sku}`,
        cup.lidId ? `Кришка: ${LID_CATALOG[cup.lidId]?.title}` : "Кришки для 110 мл немає",
      ],
    }));

  const lids = data.lids
    .filter((lid) => lid.buy > 0)
    .map((lid) => ({
      title: `${lid.title} · ${lid.forCups}`,
      icon: "circleDot",
      amount: formatPackBuy(lid.packs, lid.buy, "шт."),
      price: lid.cost > 0 ? formatMoney(lid.cost) : "",
      detail: [
        `Напої: ${lid.names.join(", ")}`,
        `Потрібно ${formatNumber(Math.round(lid.needed))} шт. · запас ${reservePct}% · фасовка ${lid.pack} шт.`,
        `${formatMoney(lid.unitPrice)}/шт · ${formatMoney(lid.packPrice)} за упаковку · арт. ${lid.sku}`,
      ],
    }));

  const champs = [
    supplyCard({
      ...data.matcha,
      icon: "leaf",
      amount: formatPackBuy(data.matcha.packs, data.matcha.buy, "г"),
    }, [
      `Орієнтир закладу: ${CHAMPS.matchaGRange} / 14 днів`,
      `Потрібно ${formatNumber(Math.round(data.matcha.needed))} г · фасовка ${data.matcha.pack} г × ${formatMoney(data.matcha.packPrice)}`,
      CHAMPS.matcha.note,
    ]),
    ...data.teas.map((item) => {
      return supplyCard(
        {
          ...item,
          amount: formatPackBuy(item.packs, item.buy, "г"),
        },
        [
          item.note,
          `${USAGE.teaGPerCup} г на порцію · порівну між 4 основними чаями · потрібно ${formatNumber(Math.round(item.needed))} г`,
          `Фасовка ${item.pack} г × ${formatMoney(item.packPrice)}`,
        ],
      );
    }),
    supplyCard({
      ...data.milkCleaner,
      icon: "droplets",
      amount: formatPackBuy(
        data.milkCleaner.packs,
        null,
        null,
        "пляшка",
        "пляшки",
        "пляшок",
      ),
    }, [
      CHAMPS.milkCleaner.note,
      `${formatMoney(data.milkCleaner.packPrice)} / пляшка 0,5 л`,
    ]),
    supplyCard({
      ...data.groupCleaner,
      icon: "flaskConical",
      amount: formatPackBuy(
        data.groupCleaner.packs,
        null,
        null,
        "пляшка",
        "пляшки",
        "пляшок",
      ),
    }, [
      CHAMPS.groupCleaner.note,
      `${formatMoney(data.groupCleaner.packPrice)} / пляшка 1 л`,
    ]),
  ].filter(isPresent);

  const milks = data.milks
    .filter((item) => item.buy > 0)
    .map((item) => {
      return supplyCard(
        {
          ...item,
          amount: `${formatNumber(item.packs)} ${plural(item.packs, "літр", "літри", "літрів")}`,
        },
        [
          `${Math.round(item.share * 100)}% від молочних напоїв`,
          `Потрібно ${formatOne(item.needed / 1000)} л · закупівля по 1 л, як продають`,
          `${formatMoney(item.packPrice)} / л`,
        ],
      );
    })
    .filter(isPresent);

  const small = [
    supplyCard({
      ...data.sleeve,
      icon: "shirt",
      amount: formatPackBuy(data.sleeve.packs, data.sleeve.buy, "шт."),
    }, [
      "Лише гарячі takeaway, без стаканів 110 мл",
      `Потрібно ${formatNumber(Math.round(data.sleeve.needed))} шт. · фасовка ${data.sleeve.pack} шт.`,
    ]),
    supplyCard({
      ...data.napkin,
      icon: "layers",
      amount: formatPackBuy(data.napkin.packs, data.napkin.buy, "шт."),
    }, [
      `${USAGE.napkinPerDrink} на напій`,
      `Потрібно ${formatNumber(Math.round(data.napkin.needed))} шт. · фасовка ${formatNumber(data.napkin.pack)} шт.`,
    ]),
    supplyCard({
      ...data.stirrer,
      icon: "utensils",
      amount: formatPackBuy(data.stirrer.packs, data.stirrer.buy, "шт."),
    }, [
      "Гарячі takeaway",
      `Потрібно ${formatNumber(Math.round(data.stirrer.needed))} шт. · фасовка ${data.stirrer.pack} шт.`,
    ]),
    supplyCard({
      ...data.straw,
      icon: "cylinder",
      amount: formatPackBuy(data.straw.packs, data.straw.buy, "шт."),
    }, [
      "Takeaway без стаканів 110 мл, індивід. упаковка",
      `Потрібно ${formatNumber(Math.round(data.straw.needed))} шт. · фасовка ${data.straw.pack} шт.`,
    ]),
    supplyCard({
      ...data.maika,
      icon: "shoppingBag",
      amount: formatPackBuy(data.maika.packs, data.maika.buy, "шт."),
    }, [
      `${Math.round(USAGE.maikaShare * 100)}% takeaway — пакет-майка на кілька позицій`,
      `Потрібно ${formatNumber(Math.round(data.maika.needed))} шт. · фасовка ${data.maika.pack} шт.`,
    ]),
    supplyCard({
      ...data.sugar,
      icon: "candy",
      amount: formatPackBuy(data.sugar.packs, data.sugar.buy, "шт."),
    }, [
      `${Math.round(USAGE.sugarShare * 100)}% напоїв, стіки 5 г`,
      `Потрібно ${formatNumber(Math.round(data.sugar.needed))} шт. · фасовка ${data.sugar.pack} шт.`,
    ]),
    supplyCard({
      ...data.carrier2,
      icon: "package",
      amount: formatPackBuy(data.carrier2.packs, data.carrier2.buy, "шт."),
    }, [
      `${Math.round(USAGE.carrier2Share * 100)}% takeaway як замовлення на 2`,
      `Потрібно ${formatNumber(Math.round(data.carrier2.needed))} шт. · фасовка ${data.carrier2.pack} шт.`,
    ]),
    supplyCard({
      ...data.carrier4,
      icon: "package",
      amount: formatPackBuy(data.carrier4.packs, data.carrier4.buy, "шт."),
    }, [
      `${Math.round(USAGE.carrier4Share * 100)}% takeaway як замовлення на 4`,
      `Потрібно ${formatNumber(Math.round(data.carrier4.needed))} шт. · фасовка ${data.carrier4.pack} шт.`,
    ]),
  ].filter(isPresent);

  return [
    {
      title: "Стакани (лише із собою)",
      items: cups,
      total: data.cupsCost > 0 ? {
        label: "Сума за всі стакани",
        amount: formatMoney(data.cupsCost),
        hint: `${CUP_SOURCE.note}. Джерело: ${CUP_SOURCE.name}`,
        href: CUP_SOURCE.url,
        linkLabel: "Прайс стаканів Petrovka",
      } : null,
    },
    {
      title: "Кришки (без 110 мл)",
      items: lids,
      total: data.lidsCost > 0 ? {
        label: "Сума за всі кришки",
        amount: formatMoney(data.lidsCost),
        hint: `${LID_SOURCE.note}. Джерело: ${LID_SOURCE.name}`,
        href: LID_SOURCE.url,
        linkLabel: "Прайс кришок Petrovka",
      } : null,
    },
    {
      title: "3 Champs — матча, чай, хімія",
      items: champs,
      total: data.champsCost > 0 ? {
        label: "Сума 3 Champs без кави",
        amount: formatMoney(data.champsCost),
        hint: "Матча Kokochiyoi, 4 основні чаї та хімія 3 Champs. Кава в зернах — окремо в кінці",
        href: CHAMPS_URL,
        linkLabel: "Відкрити 3champsroastery.com.ua",
      } : null,
    },
    {
      title: "Молоко",
      items: milks,
      total: data.milkCost > 0 ? {
        label: "Сума за молоко",
        amount: formatMoney(data.milkCost),
        hint: "Звичайне, безлактозне та рослинні Alpro",
        href: "https://petrovka-horeca.com.ua/uk/moloko-slivki/",
        linkLabel: "Прайс молока Petrovka",
      } : null,
    },
    {
      title: "Дрібні розхідники",
      items: small,
      total: data.smallCost > 0 ? {
        label: "Сума за дрібницю",
        amount: formatMoney(data.smallCost),
        hint: "Серветки, мішалки, трубочки, майки, цукор, манжети, тримачі",
        href: PETROVKA_URL,
        linkLabel: "Каталог Petrovka HoReCa",
      } : null,
    },
  ].filter((group) => group.items.length > 0);
}

export function buildExtraItems(data: ComputeResult): ResultCard[] {
  return [
    supplyCard({
      ...data.extras.cloth,
      icon: "paintbrush",
      amount: formatPackBuy(data.extras.cloth.packs, data.extras.cloth.buy, "шт."),
    }, [
      EXTRA_SUPPLIES.cloth.note,
      `${EXTRA_USAGE.clothsPerWeek} шт. на тиждень · фасовка ${data.extras.cloth.pack} шт.`,
    ]),
    supplyCard({
      ...data.extras.gloves,
      icon: "hand",
      amount: formatPackBuy(data.extras.gloves.packs, data.extras.gloves.buy, "шт."),
    }, [
      EXTRA_SUPPLIES.gloves.note,
      `${EXTRA_USAGE.glovesPerWeek} шт. на тиждень · фасовка ${data.extras.gloves.pack} шт.`,
    ]),
    supplyCard({
      ...data.extras.sanitizer,
      icon: "sprayCan",
      amount: formatPackBuy(
        data.extras.sanitizer.packs,
        data.extras.sanitizer.buy,
        "л",
        "пляшка",
        "пляшки",
        "пляшок",
      ),
    }, [
      EXTRA_SUPPLIES.sanitizer.note,
      `${formatOne(EXTRA_USAGE.sanitizerLPerWeek)} л на тиждень · продають по 1 л`,
    ]),
    supplyCard({
      ...data.extras.dishSoap,
      icon: "bath",
      amount: formatPackBuy(
        data.extras.dishSoap.packs,
        data.extras.dishSoap.buy,
        "л",
        "каністра",
        "каністри",
        "каністр",
      ),
    }, [
      EXTRA_SUPPLIES.dishSoap.note,
      `${formatOne(EXTRA_USAGE.dishSoapLPerWeek)} л на тиждень · фасовка 5 л`,
    ]),
    supplyCard({
      ...data.extras.kraftBag,
      icon: "shoppingBag",
      amount: formatPackBuy(data.extras.kraftBag.packs, data.extras.kraftBag.buy, "шт."),
    }, [
      EXTRA_SUPPLIES.kraftBag.note,
      `${EXTRA_USAGE.kraftBagPerDay} шт. на день · фасовка ${data.extras.kraftBag.pack} шт.`,
    ]),
    supplyCard({
      ...data.extras.dessertBox,
      icon: "box",
      amount: formatPackBuy(data.extras.dessertBox.packs, data.extras.dessertBox.buy, "шт."),
    }, [
      EXTRA_SUPPLIES.dessertBox.note,
      `${EXTRA_USAGE.dessertBoxPerDay} шт. на день · фасовка ${data.extras.dessertBox.pack} шт.`,
    ]),
    supplyCard({
      ...data.extras.dessertLid,
      icon: "circle",
      amount: formatPackBuy(data.extras.dessertLid.packs, data.extras.dessertLid.buy, "шт."),
    }, [
      EXTRA_SUPPLIES.dessertLid.note,
      `По 1 кришці на контейнер · фасовка ${data.extras.dessertLid.pack} шт.`,
    ]),
    supplyCard({
      ...data.extras.toiletSoap,
      icon: "droplets",
      amount: formatPackBuy(
        data.extras.toiletSoap.packs,
        data.extras.toiletSoap.buy,
        "л",
        "бутель",
        "бутелі",
        "бутелів",
      ),
    }, [
      EXTRA_SUPPLIES.toiletSoap.note,
      `${formatOne(EXTRA_USAGE.toiletSoapLPerWeek)} л на тиждень · фасовка 5 л`,
    ]),
    supplyCard({
      ...data.extras.toiletPaper,
      icon: "scrollText",
      amount: formatPackBuy(data.extras.toiletPaper.packs, data.extras.toiletPaper.buy, "рул."),
    }, [
      EXTRA_SUPPLIES.toiletPaper.note,
      `${EXTRA_USAGE.toiletPaperRollsPerWeek} рулони на тиждень · фасовка ${data.extras.toiletPaper.pack} рул.`,
    ]),
    supplyCard({
      ...data.extras.wetWipes,
      icon: "droplet",
      amount: formatPackBuy(data.extras.wetWipes.packs, data.extras.wetWipes.buy, "шт."),
    }, [
      EXTRA_SUPPLIES.wetWipes.note,
      `${EXTRA_USAGE.wetWipesPerWeek} шт. на тиждень · фасовка ${data.extras.wetWipes.pack} шт.`,
      `${formatMoney(data.extras.wetWipes.packPrice)} / уп. · арт. ${EXTRA_SUPPLIES.wetWipes.sku}`,
    ]),
    supplyCard({
      ...data.extras.cleaningWipes,
      icon: "sparkles",
      amount: formatPackBuy(data.extras.cleaningWipes.packs, data.extras.cleaningWipes.buy, "шт."),
    }, [
      EXTRA_SUPPLIES.cleaningWipes.note,
      `${EXTRA_USAGE.cleaningWipesPerWeek} шт. на тиждень · фасовка ${data.extras.cleaningWipes.pack} шт.`,
      `${formatMoney(data.extras.cleaningWipes.packPrice)} / уп. · арт. ${EXTRA_SUPPLIES.cleaningWipes.sku}`,
    ]),
    supplyCard({
      ...data.extras.paperTowel,
      icon: "scrollText",
      amount: formatPackBuy(data.extras.paperTowel.packs, data.extras.paperTowel.buy, "шт."),
    }, [
      EXTRA_SUPPLIES.paperTowel.note,
      `${EXTRA_USAGE.paperTowelPerWeek} шт. на тиждень · фасовка ${data.extras.paperTowel.pack} шт.`,
      `${formatMoney(data.extras.paperTowel.packPrice)} / уп. · арт. ${EXTRA_SUPPLIES.paperTowel.sku}`,
    ]),
  ].filter(isPresent);
}

export function buildCoffeeItem(data: ComputeResult) {
  return supplyCard({
    ...data.coffee,
    icon: "bean",
    amount: `${formatNumber(data.coffee.packs)} кг`,
  }, [
    `Орієнтир закладу: ${CHAMPS.coffeeKgRange} / 14 днів · пакети по 1 кг, опт від 2 кг`,
    `З меню ≈ ${formatOne(data.coffeeMenuKg)} кг · потрібно ${formatOne(data.coffee.needed / 1000)} кг`,
    `${formatMoney(data.coffee.packPrice)} / кг · ${CHAMPS.coffee.note}`,
  ]);
}

export function buildWishlistItems(data: ComputeResult): ResultCard[] {
  return [
    supplyCard({
      ...data.wishlist.trash60,
      icon: "trash2",
      amount: formatPackBuy(data.wishlist.trash60.packs, data.wishlist.trash60.buy, "шт."),
    }, [
      WISHLIST.trash60.note,
      `${WISHLIST_USAGE.trash60PerWeek} шт. на тиждень · фасовка ${data.wishlist.trash60.pack} шт.`,
      `${formatMoney(data.wishlist.trash60.packPrice)} / уп. · арт. ${WISHLIST.trash60.sku}`,
    ]),
    supplyCard({
      ...data.wishlist.trash120,
      icon: "trash2",
      amount: formatPackBuy(data.wishlist.trash120.packs, data.wishlist.trash120.buy, "шт."),
    }, [
      WISHLIST.trash120.note,
      `${WISHLIST_USAGE.trash120PerWeek} шт. на тиждень · фасовка ${data.wishlist.trash120.pack} шт.`,
      `${formatMoney(data.wishlist.trash120.packPrice)} / уп. · арт. ${WISHLIST.trash120.sku}`,
    ]),
    supplyCard({
      ...data.wishlist.matchaSet,
      icon: "leaf",
      amount: formatPackBuy(
        data.wishlist.matchaSet.packs,
        null,
        null,
        "набір",
        "набори",
        "наборів",
      ),
    }, [
      WISHLIST.matchaSet.note,
      `Одноразово на заклад · ${formatMoney(data.wishlist.matchaSet.packPrice)} · арт. ${WISHLIST.matchaSet.sku}`,
    ]),
    supplyCard({
      ...data.wishlist.matchaSieve,
      icon: "funnel",
      amount: formatPackBuy(
        data.wishlist.matchaSieve.packs,
        null,
        null,
        "сито",
        "сита",
        "сит",
      ),
    }, [
      WISHLIST.matchaSieve.note,
      `Одноразово на бар · ${formatMoney(data.wishlist.matchaSieve.packPrice)} · арт. ${WISHLIST.matchaSieve.sku}`,
    ]),
    supplyCard({
      ...data.wishlist.towelHolder,
      icon: "paperclip",
      amount: formatPackBuy(
        data.wishlist.towelHolder.packs,
        null,
        null,
        "холдер",
        "холдери",
        "холдерів",
      ),
    }, [
      WISHLIST.towelHolder.note,
      `Одноразово на бар · ${formatMoney(data.wishlist.towelHolder.packPrice)} · арт. ${WISHLIST.towelHolder.sku}`,
    ]),
    ...data.wishlistTeas.map((item) => {
      return supplyCard(
        {
          ...item,
          amount: formatPackBuy(item.packs, item.buy, "г"),
        },
        [
          item.note,
          `Wish list, 1 пачка в асортимент · ${formatMoney(item.packPrice)} / ${item.pack} г`,
        ],
      );
    }),
  ].filter(isPresent);
}
