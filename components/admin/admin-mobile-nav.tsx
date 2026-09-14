"use client";

import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminNavLinks } from "@/components/admin/admin-nav-links";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="border-b border-[#e4d5c5] bg-[#fbf6f0] lg:hidden">
      <div className="px-4 py-2 sm:px-6">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#3c2a21] ring-1 ring-[#d9c7b5]"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
        >
          <span aria-hidden className="flex flex-col gap-0.5">
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
          </span>
          Меню
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#3c2a21]/40"
            aria-label="Закрити меню"
            onClick={() => setOpen(false)}
          />
          <div
            id={panelId}
            className="absolute inset-y-0 left-0 flex w-[min(20rem,86vw)] flex-col bg-[#fbf6f0] shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-[#e4d5c5] px-4 py-3">
              <p className="font-semibold text-[#3c2a21]">Розділи</p>
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#5c4638] ring-1 ring-[#d9c7b5]"
                onClick={() => setOpen(false)}
              >
                Закрити
              </button>
            </div>
            <nav aria-label="Мобільна навігація адмін-панелі" className="flex-1 overflow-y-auto px-3 py-4">
              <AdminNavLinks onNavigate={() => setOpen(false)} />
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
