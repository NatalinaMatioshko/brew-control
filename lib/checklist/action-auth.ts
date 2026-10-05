import { getAdminAccess } from "@/lib/admin-auth";

export type ChecklistActionResult =
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

/** ADMIN or MANAGER with session userId — for run start / toggle / complete. */
export async function requireChecklistOperator(): Promise<
  { ok: true; userId: string; role: "ADMIN" | "MANAGER" } | { ok: false; error: string }
> {
  const access = await getAdminAccess();

  if (access.status !== "authorized") {
    return { ok: false, error: FORBIDDEN_ERROR };
  }

  const role = access.session.user.role;
  if (role !== "ADMIN" && role !== "MANAGER") {
    return { ok: false, error: FORBIDDEN_ERROR };
  }

  const userId = access.session.user.id;
  if (!userId) {
    return { ok: false, error: FORBIDDEN_ERROR };
  }

  return { ok: true, userId, role };
}

export function validationError(message: string): ChecklistActionResult {
  return { ok: false, error: message };
}
