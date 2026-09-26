import type { Metadata } from "next";
import { AboutClient } from "../../component/about/about-client";
import { CustomerShell } from "@/component/layout/customer-shell";

export const metadata: Metadata = {
  title: "About Us - CineBook",
  description: "Learn about the CineBook movie reservation portfolio project.",
};

export default function AboutPage() {
  return <CustomerShell><AboutClient /></CustomerShell>;
}
