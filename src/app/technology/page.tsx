import { Home } from "@/components/home";
import { companyMetadata } from "@/lib/company";
export const metadata = companyMetadata("technology", "en");
export default function Page() {
  return <Home locale="en" page="technology" />;
}
