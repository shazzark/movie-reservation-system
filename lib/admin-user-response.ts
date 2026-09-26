export interface AdminUserRecord {
  _id: unknown;
  name?: string | null;
  email: string;
  role: string;
  createdAt?: Date | string;
}

export function toAdminUserResponse(user: AdminUserRecord, bookingCount: number) {
  return {
    id: String(user._id),
    name: user.name ?? "",
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    bookingCount,
  };
}
