import { auth } from "@/auth";
import type { UserRole } from "@/app/generated/prisma/enums";
import type { Session } from "next-auth";

const ADMIN_PANEL_ROLES: readonly UserRole[] = ["ADMIN", "MANAGER"];

export type AdminAccess =
  | { status: "unauthenticated" }
  | { status: "forbidden"; session: Session }
  | { status: "authorized"; session: Session };

export function canAccessAdminPanel(role: UserRole | undefined): boolean {
  return role !== undefined && ADMIN_PANEL_ROLES.includes(role);
}

export async function getAdminAccess(): Promise<AdminAccess> {
  const session = await auth();

  if (!session?.user?.id) {
    return { status: "unauthenticated" };
  }

  if (!canAccessAdminPanel(session.user.role)) {
    return { status: "forbidden", session };
  }

  return { status: "authorized", session };
}

export function roleLabel(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "Адміністратор";
    case "MANAGER":
      return "Менеджер";
    case "BARISTA":
      return "Бариста";
  }
}
