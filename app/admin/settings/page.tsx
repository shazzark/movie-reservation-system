import type { Metadata } from "next";
import { AdminSidebar } from "../../../component/admin/admin-sidebar";
import { Card } from "../../../component/ui/card";
import { Button } from "../../../component/ui/button";
import { Input } from "../../../component/ui/input";

export const metadata: Metadata = {
  title: "Settings - Admin - CineBook",
  description: "Admin settings for the reservation system",
};

export default function AdminSettingsPage() {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-8">Settings</h1>

          {/* General Settings */}
          <Card className="p-8 border-border mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              General Settings
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Business Name
                </label>
                <Input
                  defaultValue="CineBook"
                  placeholder="Enter business name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Support Email
                </label>
                <Input
                  type="email"
                  defaultValue="support@cinebook.com"
                  placeholder="Enter support email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  placeholder="Enter phone number"
                />
              </div>
              <Button>Save Changes</Button>
            </div>
          </Card>

          {/* Payment Settings */}
          <Card className="p-8 border-border mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Payment Settings
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Base Ticket Price
                </label>
                <Input
                  type="number"
                  defaultValue="12.00"
                  placeholder="Enter base price"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Premium Seat Surcharge
                </label>
                <Input
                  type="number"
                  defaultValue="3.00"
                  placeholder="Enter surcharge amount"
                  step="0.01"
                />
              </div>
              <Button>Save Changes</Button>
            </div>
          </Card>

          {/* System Settings */}
          <Card className="p-8 border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              System Settings
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Advance Booking Days
                </label>
                <Input
                  type="number"
                  defaultValue="30"
                  placeholder="Days in advance for booking"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cancellation Window (Hours)
                </label>
                <Input
                  type="number"
                  defaultValue="2"
                  placeholder="Hours before showtime"
                />
              </div>
              <Button>Save Changes</Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
