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

// In services/user.service.ts - update the loginUser function:
export const loginUser = async (
  email: string,
  password: string,
): Promise<DbUser> => {
  try {
    console.log(`🔍 loginUser called for email: ${email}`);

    // Clean email
    const cleanEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      console.log(`❌ No user found with email: ${cleanEmail}`);
      throw new Error("Invalid email or password");
    }

    console.log(`✅ User found: ${user._id}`);

    // Check if user has password (social login users might not have one)
    if (!user.password) {
      console.log(`❌ User ${user._id} has no password set`);
      throw new Error("Please use a different login method");
    }

    // Verify password
    console.log(`🔐 Comparing password for user: ${user._id}`);
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      console.log(`❌ Invalid password for user: ${user._id}`);
      throw new Error("Invalid email or password");
    }

    console.log(`✅ Password valid for user: ${user._id}`);
    return user;
  } catch (error) {
    console.error(`🔥 loginUser error for email ${email}:`, error);
    throw error;
  }
};
// FORGOT PASSWORD (generates token / returns dummy message for now)
export const forgotPassword = async (
  email: string,
): Promise<{ message: string }> => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  // Here you would generate a reset token & send email
  return { message: "Reset password link sent (mock)" };
};

export const signupUser = createUser;
