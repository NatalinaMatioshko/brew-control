export const PETROVKA_URL = "https://petrovka-horeca.com.ua/uk/";
export const CHAMPS_URL = "https://3champsroastery.com.ua/";

export type SupplyCatalog = {
  title: string;
  pack: number;
  packPrice: number;
  unitPrice: number;
  sku: string;
  url?: string;
  note?: string;
  icon?: string;
  minPacks?: number;
  key?: string;
};

export const USAGE = {
  sugarShare: 0.35,
  napkinPerDrink: 1.2,
  teaGPerCup: 3,
  carrier2Share: 0.18,
  carrier4Share: 0.04,
  strawShare: 1,
  maikaShare: 0.12,
  milk: {
    regular: 0.72,
    lactoseFree: 0.1,
    oat: 0.1,
    almond: 0.04,
    coconut: 0.03,
    banana: 0.01,
  },
};

export const EXTRA_USAGE = {
  clothsPerWeek: 10,
  glovesPerWeek: 100,
  sanitizerLPerWeek: 0.5,
  dishSoapLPerWeek: 1,
  kraftBagPerDay: 12,
  dessertBoxPerDay: 8,
  toiletSoapLPerWeek: 0.5,
  toiletPaperRollsPerWeek: 4,
  wetWipesPerWeek: 120,
  cleaningWipesPerWeek: 120,
  paperTowelPerWeek: 200,
};

export const CHAMPS = {
  coffeeKgPer14Days: 34,
  coffeeKgRange: "33–35 кг",
  matchaGPer14Days: 230,
  matchaGRange: "180–280 г",
  coffee: {
    title: "Кава 3 Champs, зерно 1 кг",
    pack: 1000,
    packPrice: 1050,
    unitPrice: 1.05,
    sku: "Kenya 20 espresso",
    url: "https://3champsroastery.com.ua/shop/keniya-20-espreso/",
    note: "Опт від 2 кг, орієнтир 1 кг еспресо",
    minPacks: 2,
  },
  matcha: {
    title: "Матча Kokochiyoi 3 Champs",
    pack: 70,
    packPrice: 850,
    unitPrice: 12.14,
    sku: "17338801000",
    url: "https://3champsroastery.com.ua/shop/matcha-kokochiyoi/",
    note: "Класичний преміум, яскраво-зелений, горіховий смак",
  },
  teas: [
    {
      key: "kenya",
      title: "Сонячна Кенія 3 Champs",
      pack: 250,
      packPrice: 565,
      unitPrice: 2.26,
      sku: "sonyachna-keniya",
      url: "https://3champsroastery.com.ua/shop/sonyachna-keniya/",
      note: "Кенійський чорний чай. Є також 70 г",
      icon: "sun",
    },
    {
      key: "sencha",
      title: "Сенча класична 3 Champs",
      pack: 70,
      packPrice: 480,
      unitPrice: 6.86,
      sku: "sencha-klasichna",
      url: "https://3champsroastery.com.ua/shop/sencha-klasichna/",
      note: "Трав’янисті та легкі фруктові ноти",
      icon: "leaf",
    },
    {
      key: "milkOolong",
      title: "Молочний улун 3 Champs",
      pack: 70,
      packPrice: 285,
      unitPrice: 4.07,
      sku: "molochniy-ulun",
      url: "https://3champsroastery.com.ua/shop/molochniy-ulun/",
      note: "М’який настій, солодке молоко і жасмин",
      icon: "milk",
    },
    {
      key: "masala",
      title: "Масала 3 Champs",
      pack: 70,
      packPrice: 260,
      unitPrice: 3.71,
      sku: "masala",
      url: "https://3champsroastery.com.ua/shop/masala/",
      note: "Насичений смак з теплими пікантними нотками",
      icon: "flame",
    },
  ],
  milkCleaner: {
    title: "Хімія для молочних систем 3 Champs",
    pack: 1,
    packPrice: 100,
    unitPrice: 100,
    sku: "17710482770",
    url: "https://3champsroastery.com.ua/shop/himiya-dlya-molochnih-sistem/",
    note: "0,5 л, очищення стімера від залишків молока",
  },
  groupCleaner: {
    title: "Хімія для груп кавомашини 3 Champs",
    pack: 1,
    packPrice: 195,
    unitPrice: 195,
    sku: "himiya-dlya-kavovih-masel",
    url: "https://3champsroastery.com.ua/shop/himiya-dlya-kavovih-masel/",
    note: "1 л, очищення груп і холдерів від кавових масел",
  },
} as const satisfies {
  coffeeKgPer14Days: number;
  coffeeKgRange: string;
  matchaGPer14Days: number;
  matchaGRange: string;
  coffee: SupplyCatalog;
  matcha: SupplyCatalog;
  teas: SupplyCatalog[];
  milkCleaner: SupplyCatalog;
  groupCleaner: SupplyCatalog;
};

export const SUPPLIES = {
  napkin: {
    title: "Серветки для диспенсера 17×17",
    pack: 2000,
    packPrice: 218,
    unitPrice: 0.11,
    sku: "диспенсер 2000",
    url: "https://petrovka-horeca.com.ua/uk/p464695123-salfetka-dlya-dispensera.html",
  },
  stirrer: {
    title: "Мішалки дерев’яні 140 мм",
    pack: 500,
    packPrice: 146,
    unitPrice: 0.29,
    sku: "20007",
    url: "https://petrovka-horeca.com.ua/uk/meshalka-derevyannayav-individualnoyupakovke-kraft-140h6h2-mm.html",
  },
  straw: {
    title: "Трубочка крафт в індивід. упаковці 200×6 мм",
    pack: 50,
    packPrice: 43.9,
    unitPrice: 0.88,
    sku: "20862",
    url: "https://petrovka-horeca.com.ua/uk/bumazhnaya-trubochka-v-ind-upak-kraft-50sht-20sm6mm.html",
  },
  maika: {
    title: "Пакет-майка 24×42 см, 6 мкм",
    pack: 100,
    packPrice: 48,
    unitPrice: 0.48,
    sku: "18265",
    url: "https://petrovka-horeca.com.ua/uk/p1357823657-paket-majka-bez.html",
  },
  sugar: {
    title: "Цукор у стіках 5 г",
    pack: 200,
    packPrice: 77,
    unitPrice: 0.39,
    sku: "20378",
    url: "https://petrovka-horeca.com.ua/uk/sahar-sol-perec/",
  },
  sleeve: {
    title: "Манжети крафт 250/340 мл",
    pack: 25,
    packPrice: 23.75,
    unitPrice: 0.95,
    sku: "101059F",
    url: "https://petrovka-horeca.com.ua/uk/termopoyasa-kapholdery/",
  },
  carrier2: {
    title: "Тримач на 2 стакани, крафт",
    pack: 10,
    packPrice: 39,
    unitPrice: 3.9,
    sku: "21927F",
    url: "https://petrovka-horeca.com.ua/uk/holdery-i-keysy/",
  },
  carrier4: {
    title: "Тримач на 4 стакани, крафт",
    pack: 10,
    packPrice: 49.5,
    unitPrice: 4.95,
    sku: "21929F",
    url: "https://petrovka-horeca.com.ua/uk/holdery-i-keysy/",
  },
  milkRegular: {
    title: "Молоко звичайне Галичина Бариста 2,5%",
    pack: 1000,
    packPrice: 49,
    unitPrice: 0.049,
    sku: "бариста 1 л",
    url: "https://petrovka-horeca.com.ua/uk/moloko-slivki/",
  },
  milkLactoseFree: {
    title: "Молоко безлактозне Галичина Бариста 2,5%",
    pack: 1000,
    packPrice: 59.9,
    unitPrice: 0.0599,
    sku: "безлактозне 1 л",
    url: "https://petrovka-horeca.com.ua/uk/moloko-slivki/",
  },
  milkOat: {
    title: "Вівсяне молоко Alpro 3%",
    pack: 1000,
    packPrice: 156,
    unitPrice: 0.156,
    sku: "Alpro овес 1 л",
    url: "https://petrovka-horeca.com.ua/uk/alpro-moloko-rastitelnoe-oves-1-l.html",
  },
  milkAlmond: {
    title: "Мигдалеве молоко Alpro 1,2%",
    pack: 1000,
    packPrice: 156,
    unitPrice: 0.156,
    sku: "Alpro мигдаль 1 л",
    url: "https://petrovka-horeca.com.ua/uk/alpro/",
  },
  milkCoconut: {
    title: "Кокосове молоко Alpro 1,4%",
    pack: 1000,
    packPrice: 154,
    unitPrice: 0.154,
    sku: "Alpro кокос 1 л",
    url: "https://petrovka-horeca.com.ua/uk/alpro/",
  },
  milkBanana: {
    title: "Бананове молоко Alpro 1,8%",
    pack: 1000,
    packPrice: 159,
    unitPrice: 0.159,
    sku: "Alpro банан 1 л",
    url: "https://petrovka-horeca.com.ua/uk/alpro/",
  },
} as const satisfies Record<string, SupplyCatalog>;

export const EXTRA_SUPPLIES = {
  cloth: {
    title: "Ганчірки віскозні PROFIT 30×36 см",
    pack: 10,
    packPrice: 44,
    unitPrice: 4.4,
    sku: "20090",
    url: "https://petrovka-horeca.com.ua/uk/salfetki-viskoznye-profit-30h36-sm-10-sht.html",
    note: "Для столів і техніки, окремо від серветок гостям",
  },
  gloves: {
    title: "Рукавички нітрилові HOFFEN чорні L",
    pack: 100,
    packPrice: 220,
    unitPrice: 2.2,
    sku: "22357",
    url: "https://petrovka-horeca.com.ua/uk/perchatki-nitrilovye-teksturirovannye-hoffen-chernye-l-100sht.html",
    note: "Одноразові для бариста",
  },
  sanitizer: {
    title: "Антисептик для рук ProSept 1 л",
    pack: 1,
    packPrice: 252,
    unitPrice: 252,
    sku: "19316",
    url: "https://petrovka-horeca.com.ua/uk/p1525079899-antisepticheskij-gel-dlya.html",
    note: "Гель з дозатором",
  },
  dishSoap: {
    title: "Засіб для посуду OPTIMAL-PRO 5 л",
    pack: 5,
    packPrice: 320,
    unitPrice: 64,
    sku: "18569",
    url: "https://petrovka-horeca.com.ua/uk/p1406395192-sredstvo-dlya-mytya.html",
    note: "Без фосфатів, каністра 5 л",
  },
  kraftBag: {
    title: "Крафт-пакет з віконцем 310×90 мм",
    pack: 100,
    packPrice: 129,
    unitPrice: 1.29,
    sku: "103160F",
    url: "https://petrovka-horeca.com.ua/uk/p602207288-bumazhnyj-paket-prozrachnoj.html",
    note: "Для сендвічів і випічки",
  },
  dessertBox: {
    title: "Контейнер овальний крафт 1000 мл",
    pack: 50,
    packPrice: 290,
    unitPrice: 5.8,
    sku: "22623",
    url: "https://petrovka-horeca.com.ua/uk/konteyner-ovalniy-kraft-170h120h75mm-1000ml-50sht.html",
    note: "Для десертів і сендвічів",
  },
  dessertLid: {
    title: "Кришка для овального контейнера",
    pack: 50,
    packPrice: 140,
    unitPrice: 2.8,
    sku: "22642",
    url: "https://petrovka-horeca.com.ua/uk/kryshka-dlya-ovalnogo-konteynera-50sht.html",
    note: "Продається окремо від контейнера",
  },
  toiletSoap: {
    title: "Мило рідке Бджілка, квіткове, 5 л",
    pack: 5,
    packPrice: 258,
    unitPrice: 51.6,
    sku: "101721",
    url: "https://petrovka-horeca.com.ua/uk/sredstvo-dlya-mytya-posudy-pchelka-5l-limon-clone.html",
    note: "Для туалету гостей і персоналу",
  },
  toiletPaper: {
    title: "Туалетний папір Grite Family 3 шари",
    pack: 8,
    packPrice: 201,
    unitPrice: 25.13,
    sku: "Grite Family 8",
    url: "https://petrovka-horeca.com.ua/uk/bumaga-tualetnaya-grite-family-3-sloya-150-listov-up-8sht.html",
    note: "8 рулонів, 150 аркушів",
  },
  wetWipes: {
    title: "Серветки вологі Summer Fresh з клапаном 120 шт",
    pack: 120,
    packPrice: 47,
    unitPrice: 0.39,
    sku: "21037",
    url: "https://petrovka-horeca.com.ua/uk/salfetki-vlazhnye-summer-fresh-s-klapanom-120sht.html",
    note: "Велика пачка для рук і гостей",
  },
  cleaningWipes: {
    title: "Серветки вологі Summer Fresh Antibacterial 120 шт",
    pack: 120,
    packPrice: 47,
    unitPrice: 0.39,
    sku: "22254",
    url: "https://petrovka-horeca.com.ua/uk/salfetki-vlazhnye-summer-fresh-antibacterial-s-klapanom-120sht.html",
    note: "Велика пачка для прибирання поверхонь",
  },
  paperTowel: {
    title: "Рушник паперовий целюлоза 100% V-сл 21×21 см 200 шт",
    pack: 200,
    packPrice: 38,
    unitPrice: 0.19,
    sku: "21052",
    url: "https://petrovka-horeca.com.ua/uk/polotence-bumazhnoe-cellyuloza-100-v-skl-21h21sm-up-200sht.html",
    note: "Для бару, V-складання",
  },
} as const satisfies Record<string, SupplyCatalog>;

export const WISHLIST_USAGE = {
  trash60PerWeek: 21,
  trash120PerWeek: 7,
};

export const WISHLIST = {
  trash60: {
    title: "Пакети для сміття 60 л, посилені",
    pack: 40,
    packPrice: 56,
    unitPrice: 1.4,
    sku: "19643",
    url: "https://petrovka-horeca.com.ua/uk/pakety-dlya-musora/",
    note: "Кухня і барна зона, 12 мкм",
  },
  trash120: {
    title: "Пакети для сміття 120 л",
    pack: 25,
    packPrice: 92.5,
    unitPrice: 3.7,
    sku: "102646",
    url: "https://petrovka-horeca.com.ua/uk/pakety-dlya-musora/",
    note: "Великий бак, 20 мкм",
  },
  matchaSet: {
    title: "Набір для матчі подарунковий «Краєвид» 500 мл",
    pack: 1,
    packPrice: 1280,
    unitPrice: 1280,
    sku: "scenery500",
    url: "https://kultura.coffee/nabir-dlia-pryhotuvannia-chaiu-matcha-podarunkovyi-kraievyd-500-ml/",
    note: "Чаван 500 мл, часен, часаку і кусенаоші. Порошок матчі вже в розхідниках 3 Champs",
  },
  matchaSieve: {
    title: "Сито для матчі металеве",
    pack: 1,
    packPrice: 250,
    unitPrice: 250,
    sku: "18792",
    url: "https://kultura.coffee/syto-dlia-chaiu-matcha-metaleve/",
    note: "Нержавіюча сталь, Ø 7 см — просіювання порошку без грудочок",
  },
  towelHolder: {
    title: "Холдер для паперових рушників на бар, V-складання",
    pack: 1,
    packPrice: 684,
    unitPrice: 684,
    sku: "803362.W",
    url: "https://devisan.com.ua/dyspensery-ta-obladnannya/dyspenser-dlya-rushnykiv-v-ukladky-bilyj-tm-devisan/",
    note: "Білий ABS, місткість 200 аркушів — під рушники 21×21 см з розхідників",
  },
  teas: [
    {
      key: "buckwheat",
      title: "Гречаний чай 3 Champs",
      pack: 70,
      packPrice: 345,
      unitPrice: 4.93,
      sku: "grechaniy-chay",
      url: "https://3champsroastery.com.ua/shop/grechaniy-chay/",
      note: "Смажене насіння чорної гречихи з Китаю",
      icon: "wheat",
    },
    {
      key: "daHongPao",
      title: "Да Хун Пао 3 Champs",
      pack: 70,
      packPrice: 395,
      unitPrice: 5.64,
      sku: "da-hun-pao",
      url: "https://3champsroastery.com.ua/shop/da-hun-pao/",
      note: "Димний цитрус і фруктово-пряний післясмак",
      icon: "mountain",
    },
    {
      key: "tieGuanYin",
      title: "Те Гуань Інь 3 Champs",
      pack: 70,
      packPrice: 405,
      unitPrice: 5.79,
      sku: "te-guan-in",
      url: "https://3champsroastery.com.ua/shop/te-guan-in/",
      note: "Тонкий насичений бузковий аромат",
      icon: "flower2",
    },
    {
      key: "bergamot",
      title: "Сицилійський бергамот 3 Champs",
      pack: 250,
      packPrice: 665,
      unitPrice: 2.66,
      sku: "sitsiliyskiy-be",
      url: "https://3champsroastery.com.ua/shop/sitsiliyskiy-be/",
      note: "Канді, глибокий смак з терпкістю. Є також 70 г",
      icon: "citrus",
    },
    {
      key: "grannyJam",
      title: "Бабусине варення 3 Champs",
      pack: 250,
      packPrice: 690,
      unitPrice: 2.76,
      sku: "babusine-varennya",
      url: "https://3champsroastery.com.ua/shop/babusine-varennya/",
      note: "Суданська троянда, ягоди й трави. Є також 70 г",
      icon: "cherry",
    },
    {
      key: "cascara",
      title: "Каскара 3 Champs",
      pack: 200,
      packPrice: 225,
      unitPrice: 1.13,
      sku: "18204135050",
      url: "https://3champsroastery.com.ua/shop/kaskara/",
      note: "Сушена кавова вишня: шипшина, вишня, каркаде",
      icon: "cherry",
    },
    {
      key: "dzen",
      title: "Український Дзен 3 Champs",
      pack: 250,
      packPrice: 575,
      unitPrice: 2.3,
      sku: "ukrainskiy-dzen",
      url: "https://3champsroastery.com.ua/shop/ukrainskiy-dzen/",
      note: "Смородина, чебрець і мате. Є також 70 г",
      icon: "sprout",
    },
  ],
} as const satisfies {
  trash60: SupplyCatalog;
  trash120: SupplyCatalog;
  matchaSet: SupplyCatalog;
  matchaSieve: SupplyCatalog;
  towelHolder: SupplyCatalog;
  teas: SupplyCatalog[];
};
