import type { Metadata } from "next";
import { Card } from "@/component/ui/card";

export const metadata: Metadata = {
  title: "Settings - CineBook Studio",
};

export default function AdminSettingsPage() {
  return (
    <Card className="max-w-2xl p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">CineBook Studio</p>
      <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
      <p className="max-w-xl text-sm leading-6 text-muted-foreground">
        Global settings are outside the scope of this demo. Movie information,
        theater layouts, and showtime pricing will be managed in their own CMS sections.
      </p>
    </Card>
  );
}
