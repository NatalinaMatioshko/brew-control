import { signOut } from "@/auth";

type AdminHeaderProps = {
  displayName: string;
  roleText: string;
};

export function AdminHeader({ displayName, roleText }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#e4d5c5]/80 bg-[#f6efe6]/90 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold tracking-tight text-[#3c2a21] lg:hidden">
            Brew Control
          </p>
          <p className="hidden text-sm text-[#8a7262] lg:block">Brew Control</p>
        </div>
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-medium text-[#3c2a21]">
              {displayName}
            </p>
            <p className="truncate text-xs text-[#8a7262]">{roleText}</p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              className="rounded-xl bg-[#3c2a21] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#5c4638]"
              type="submit"
            >
              Вийти
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
