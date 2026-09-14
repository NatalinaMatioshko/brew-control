"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS, isAdminNavActive } from "@/components/admin/admin-nav";

type AdminNavLinksProps = {
  onNavigate?: () => void;
};

export function AdminNavLinks({ onNavigate }: AdminNavLinksProps) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1">
      {ADMIN_NAV_ITEMS.map((item) => {
        const active = isAdminNavActive(pathname, item);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-[#efe3d3] font-semibold text-[#3c2a21]"
                  : "text-[#5c4638] hover:bg-[#f6efe6] hover:text-[#3c2a21]"
              }`}
            >
              <span>{item.label}</span>
              {item.soon ? (
                <span className="shrink-0 rounded-full bg-[#e8d5c4] px-2 py-0.5 text-[11px] font-medium text-[#5c4638]">
                  Незабаром
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
