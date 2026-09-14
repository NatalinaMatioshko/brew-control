export type AdminNavItem = {
  href: string;
  label: string;
  exact?: boolean;
  soon?: boolean;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Огляд", exact: true },
  { href: "/admin/opening-calculator", label: "Калькулятор розхідників" },
  { href: "/admin/menu", label: "Меню" },
  { href: "/admin/inventory", label: "Склад", soon: true },
  { href: "/admin/orders", label: "Замовлення", soon: true },
  { href: "/admin/staff", label: "Команда", soon: true },
];

export function isAdminNavActive(pathname: string, item: AdminNavItem) {
  if (item.exact) {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
