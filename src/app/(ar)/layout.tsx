import { Document } from "@/components/document";
import type { ReactNode } from "react";

export default function ArabicLayout({ children }: { children: ReactNode }) {
  return <Document locale="ar">{children}</Document>;
}
