import { PracticePage } from "@/components/practice-page";
import { buildMetadata, staticParams } from "@/lib/routes";

type Props = { params: Promise<{ path: string[] }> };
export const dynamicParams = false;
export function generateStaticParams() { return staticParams(); }
export async function generateMetadata({ params }: Props) {
  return buildMetadata("ar", (await params).path.join("/"));
}

export default async function Page({ params }: Props) {
  return <PracticePage locale="ar" route={(await params).path.join("/")} />;
}
