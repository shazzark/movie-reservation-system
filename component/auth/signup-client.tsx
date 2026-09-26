"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../../component/ui/button";
import { Input } from "../../component/ui/input";
import { Card } from "../../component/ui/card";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { isValidEmail } from "../../lib/utils";
import { authApi } from "../../lib/api"; // ✅ Connected to your API

export function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCallback = searchParams.get("callbackUrl");
  const callbackUrl = requestedCallback?.startsWith("/") && !requestedCallback.startsWith("//") && !requestedCallback.includes("\\")
    ? requestedCallback
    : "/";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Validation (Keep your existing validation)
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }
    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.agreeToTerms) {
      setError("Please acknowledge the demo limitations to continue");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Real API Call
      const response = await authApi.signup({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // --- THE REDIRECT LOGIC ---
      // Check for response.success or check if the response exists/is valid
      if (response) {
        // Redirect to login with the success parameter
        router.push(`/login?success=${encodeURIComponent("Account created successfully! Please sign in.")}&callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Create Account
              </h1>
              <p className="text-slate-400">
                Join CineBook to book your favorite movies
              </p>
            </div>

            {error && (
              <motion.div
                role="alert"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-slate-200 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-slate-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-slate-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    name="password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 rounded text-slate-500 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-slate-200 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                    aria-pressed={showConfirmPassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 rounded text-slate-500 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  id="signup-demo-acknowledgement"
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 rounded border-purple-500/30 accent-purple-600"
                  disabled={isLoading}
                />
                <label htmlFor="signup-demo-acknowledgement" className="text-sm text-slate-400">
                  I understand this demo does not process payments or send email.
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Already have an account?{" "}
                <Link
                  href={callbackUrl === "/" ? "/login" : `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                  className="text-purple-400 hover:text-pink-400 font-medium"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
