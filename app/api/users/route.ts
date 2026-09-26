import { NextResponse } from "next/server";
import { withDb } from "@/lib/routeHandler";
import { withAdmin } from "@/lib/adminHandler";
import { User } from "@/models/user";
import { BookingModel } from "@/models/booking";
import { toAdminUserResponse } from "@/lib/admin-user-response";

export const GET = withDb(withAdmin(async () => {
  const [users, bookingCounts] = await Promise.all([
    User.find().select("name email role createdAt").sort({ createdAt: -1 }).lean(),
    BookingModel.aggregate([{ $group: { _id: "$userId", count: { $sum: 1 } } }]),
  ]);
  const countMap = new Map(bookingCounts.map((item) => [String(item._id), item.count as number]));
  return NextResponse.json(users.map((user) => toAdminUserResponse(
    user,
    countMap.get(String(user._id)) ?? 0,
  )));
}));
