import { Document } from "@/components/document";
import type { ReactNode } from "react";

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <Document locale="en">{children}</Document>;
}
