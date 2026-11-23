import { connection } from "next/server";
import { PracticePage } from "@/components/practice-page";
import { buildMetadata } from "@/lib/routes";

export const metadata = buildMetadata("ar");

export default async function HomePage() {
  // Rendered per request: content and free times come from the database.
  await connection();
  return <PracticePage locale="ar" />;
}
