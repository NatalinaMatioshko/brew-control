import { AdminNavLinks } from "@/components/admin/admin-nav-links";

export function AdminSidebar() {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-[#e4d5c5] lg:bg-[#fbf6f0]">
      <div className="px-5 py-5">
        <p className="text-lg font-semibold tracking-tight text-[#3c2a21]">
          Brew Control
        </p>
        <p className="mt-1 text-sm text-[#8a7262]">Адмін-панель</p>
      </div>
      <nav aria-label="Розділи адмін-панелі" className="flex-1 px-3 pb-6">
        <AdminNavLinks />
      </nav>
    </aside>
  );
}
