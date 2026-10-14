import { Home } from "@/components/home";
import { companyMetadata } from "@/lib/company";
export const metadata = companyMetadata("technology", "ru");
export default function Page() {
  return <Home locale="ru" page="technology" />;
}
