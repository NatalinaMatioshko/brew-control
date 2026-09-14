import { AdminHeader } from "@/components/admin/admin-header";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

type AdminShellProps = {
  displayName: string;
  roleText: string;
  children: React.ReactNode;
};

export function AdminShell({
  displayName,
  roleText,
  children,
}: AdminShellProps) {
  return (
    <div className="min-h-full bg-[#f6efe6] text-[#3c2a21]">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader displayName={displayName} roleText={roleText} />
        <AdminMobileNav />
        <div>{children}</div>
      </div>
    </div>
  );
}
