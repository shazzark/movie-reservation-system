import type { Metadata } from "next";
import { AboutClient } from "../../component/about/about-client";

export const metadata: Metadata = {
  title: "About Us - CineBook",
  description:
    "Learn more about CineBook and our mission to revolutionize movie booking",
};

export default function AboutPage() {
  return <AboutClient />;
}
