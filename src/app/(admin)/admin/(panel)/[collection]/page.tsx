import Link from "next/link";
import { notFound } from "next/navigation";
import { asc } from "drizzle-orm";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { getDb } from "@/db";
import { ConfirmButton } from "@/components/admin/forms";
import { deleteItem } from "@/lib/admin-actions";
import { getAdminDict } from "@/lib/admin-lang";
import { requireAdmin } from "@/lib/auth";
import { collections, isCollection } from "@/lib/collections";
import { Photo, serviceIcons } from "@/lib/media";

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { collection } = await params;
  if (!isCollection(collection)) notFound();
  const { saved } = await searchParams;
  const { t: d } = await getAdminDict();
  const config = collections[collection];
  const db = await getDb();
  const rows = (await db
    .select()
    .from(config.table)
    .orderBy(asc(config.table.sortOrder), asc(config.table.id))) as Record<string, unknown>[];

  const titleOf = (row: Record<string, unknown>, suffix: "Ar" | "En") =>
    String(row[`title${suffix}`] ?? row[`quote${suffix}`] ?? "");

  return (
    <>
      <header className="a-head">
        <h1>{d[config.label]}</h1>
        <Link className="a-btn" href={`/admin/${collection}/new/`}>
          <Plus size={18} aria-hidden="true" />
          {d.addNew}
        </Link>
      </header>
      {saved && <p className="a-flash a-flash-ok">{d.saved}</p>}
      {rows.length ? (
        <ul className="a-items">
          {rows.map((row) => {
            const id = Number(row.id);
            const image = typeof row.image === "string" ? row.image : "";
            const Icon = typeof row.icon === "string" ? serviceIcons[row.icon] : undefined;
            return (
              <li key={id} className="a-item" data-hidden={!row.published || undefined}>
                <div className="a-thumb">
                  {image ? <Photo src={image} sizes="96px" /> : Icon ? <Icon size={26} strokeWidth={1.5} aria-hidden="true" /> : null}
                </div>
                <div className="a-item-text">
                  <Link href={`/admin/${collection}/${id}/`}>
                    <strong dir="rtl" lang="ar">{titleOf(row, "Ar")}</strong>
                  </Link>
                  {titleOf(row, "En") && (
                    <span className="a-muted" dir="ltr" lang="en">
                      {titleOf(row, "En")}
                    </span>
                  )}
                </div>
                <div className="a-item-meta">
                  <span className="a-status" data-status={row.published ? "approved" : "cancelled"}>
                    {row.published ? d.published : d.hidden}
                  </span>
                  <small className="a-muted">
                    {d.order}: <bdi>{String(row.sortOrder)}</bdi>
                  </small>
                </div>
                <div className="a-item-actions">
                  <Link className="a-btn a-btn-sm a-btn-ghost" href={`/admin/${collection}/${id}/`}>
                    <Pencil size={16} aria-hidden="true" />
                    {d.edit}
                  </Link>
                  <form action={deleteItem}>
                    <input type="hidden" name="collection" value={collection} />
                    <input type="hidden" name="id" value={id} />
                    <ConfirmButton message={d.confirmDelete} className="a-btn a-btn-sm a-btn-icon">
                      <Trash2 size={16} aria-label={d.delete} />
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="a-empty">{d.empty}</p>
      )}
    </>
  );
}
