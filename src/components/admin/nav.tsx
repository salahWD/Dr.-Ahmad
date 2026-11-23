"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  Clock,
  FileText,
  HandHeart,
  LayoutDashboard,
  MessageSquareQuote,
  ClipboardList,
} from "lucide-react";

const icons = {
  overview: LayoutDashboard,
  bookings: CalendarCheck,
  availability: Clock,
  articles: FileText,
  services: HandHeart,
  testimonials: MessageSquareQuote,
  cases: ClipboardList,
};

export type NavItem = { href: string; label: string; icon: keyof typeof icons; badge?: number };

export function AdminNav({ items }: { items: NavItem[] }) {
  const path = usePathname();
  return (
    <nav className="a-nav">
      {items.map((item) => {
        const Icon = icons[item.icon];
        const active = item.href === "/admin/" ? path === "/admin/" || path === "/admin" : path.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
            <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
            <span>{item.label}</span>
            {item.badge ? <span className="a-badge-count">{item.badge}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
