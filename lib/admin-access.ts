export type AdminAccessState = "unauthenticated" | "forbidden" | "allowed";

export function getAdminAccessState(
  user: { id?: unknown; role?: unknown } | null | undefined,
): AdminAccessState {
  if (!user?.id) return "unauthenticated";
  return user.role === "admin" ? "allowed" : "forbidden";
}
