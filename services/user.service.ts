// services/user.service.ts
import { User } from "../models/user";
import { DbUser } from "../types/user";
import bcrypt from "bcryptjs";

// GET all users
export const getAllUsers = async (): Promise<DbUser[]> => {
  return User.find();
};

// GET single user by ID
export const getUserById = async (id: string): Promise<DbUser | null> => {
  return User.findById(id);
};

// UPDATE user role or other fields
export const updateUserRole = async (
  id: string,
  role: "user" | "admin",
): Promise<DbUser | null> => {
  return User.findByIdAndUpdate(id, { role }, { new: true });
};

// DELETE user by ID
export const deleteUser = async (id: string): Promise<DbUser | null> => {
  return User.findByIdAndDelete(id);
};

// CREATE user with hashed password
export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}): Promise<DbUser> => {
  // Hash the password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = new User({
    ...data,
    email: data.email.trim().toLowerCase(),
    password: hashedPassword,
  });

  await user.save();
  return user;
};

// LOGIN (credentials)
// export const loginUser = async (
//   email: string,
//   password: string,
// ): Promise<DbUser> => {
//   const user = await User.findOne({ email });
//   if (!user) throw new Error("User not found");

//   const isValid = await bcrypt.compare(password, user.password);
//   if (!isValid) throw new Error("Invalid password");

//   return user;
// };

export const loginUser = async (
  email: string,
  password: string,
): Promise<DbUser> => {
  const cleanEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail });
  if (!user?.password) throw new Error("Invalid email or password");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid email or password");
  return user;
};
export const signupUser = createUser;
