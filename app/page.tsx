import { CustomerShell } from "@/component/layout/customer-shell";
import { HomeDiscovery } from "@/component/home/home-discovery";

export default function Home() {
  return (
    <CustomerShell>
      <HomeDiscovery />
    </CustomerShell>
  );
}
