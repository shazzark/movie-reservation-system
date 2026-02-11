// types/user.ts
import { Types } from "mongoose";

export interface DbUser {
  _id: Types.ObjectId; // ✅ instead of `any`
  email: string;
  name: string;
  password: string;
  role: "user" | "admin";
}
