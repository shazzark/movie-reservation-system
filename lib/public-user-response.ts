export interface PublicUserRecord {
  _id: unknown;
  name?: string | null;
  email: string;
  role: string;
  createdAt?: Date | string;
}

export function toPublicUserResponse(user: PublicUserRecord) {
  return {
    id: String(user._id),
    name: user.name ?? "",
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}
