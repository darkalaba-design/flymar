import { Home } from "@/components/home";
import { companyMetadata } from "@/lib/company";
export const metadata = companyMetadata("contacts", "ru");
export default function Page() {
  return <Home locale="ru" page="contacts" />;
}
