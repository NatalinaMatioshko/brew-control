import { getAdminAccess } from "@/lib/admin-auth";

export type MenuActionResult =
  | { ok: true }
  | { ok: false; error: string };

const FORBIDDEN_ERROR = "Недостатньо прав.";

export async function requireAdminWriter(): Promise<
  { ok: true; userId: string } | { ok: false; error: string }
> {
  const access = await getAdminAccess();

  if (access.status !== "authorized") {
    return { ok: false, error: FORBIDDEN_ERROR };
  }

  if (access.session.user.role !== "ADMIN") {
    return { ok: false, error: FORBIDDEN_ERROR };
  }

  const userId = access.session.user.id;
  if (!userId) {
    return { ok: false, error: FORBIDDEN_ERROR };
  }

  return { ok: true, userId };
}

export function validationError(message: string): MenuActionResult {
  return { ok: false, error: message };
}
