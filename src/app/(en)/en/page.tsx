import { PracticePage } from "@/components/practice-page";
import { buildMetadata } from "@/lib/routes";

export const metadata = buildMetadata("en");

export default function HomePage() {
  return <PracticePage locale="en" />;
}
