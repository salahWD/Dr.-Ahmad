import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getDb } from "@/db";
import { ItemForm, type ResolvedField } from "@/components/admin/item-form";
import { saveItem } from "@/lib/admin-actions";
import { getAdminDict } from "@/lib/admin-lang";
import { requireAdmin } from "@/lib/auth";
import { collections, isCollection, labelText, type Field } from "@/lib/collections";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ collection: string; id: string }>;
}) {
  await requireAdmin();
  const { collection, id: rawId } = await params;
  if (!isCollection(collection)) notFound();
  const id = rawId === "new" ? null : Number.parseInt(rawId, 10);
  if (id !== null && !Number.isFinite(id)) notFound();
  const { lang, t: d } = await getAdminDict();
  const config = collections[collection];
  const db = await getDb();
  const [row] = id ? await db.select().from(config.table).where(eq(config.table.id, id)).limit(1) : [];
  if (id && !row) notFound();

  const fields: ResolvedField[] = (config.fields as Field[]).map((f) => ({
    name: f.name,
    kind: f.kind,
    label: labelText(f.label, d, lang),
    hint: "hint" in f && f.hint ? labelText(f.hint, d, lang) : undefined,
    required: "required" in f ? f.required : undefined,
    max: "max" in f ? f.max : undefined,
    min: "min" in f ? f.min : undefined,
  }));
  // Timestamps stay on the server; the form only needs field values.
  const values = Object.fromEntries(
    Object.entries(row ?? { published: true, sortOrder: 0 }).filter(([, v]) => !(v instanceof Date)),
  ) as Record<string, string | number | boolean | null>;
  const Back = lang === "ar" ? ArrowRight : ArrowLeft;

  return (
    <>
      <header className="a-head">
        <div>
          <Link className="a-back" href={`/admin/${collection}/`}>
            <Back size={16} aria-hidden="true" />
            {d[config.label]}
          </Link>
          <h1>{id ? d.edit : d.addNew}</h1>
        </div>
      </header>
      <section className="a-panel">
        <ItemForm
          action={saveItem.bind(null, collection, id)}
          fields={fields}
          values={values}
          text={{
            arabic: d.arabic,
            english: d.englishOptional,
            save: d.save,
            saving: d.saving,
            noImage: d.noImage,
            uploadImage: d.uploadImage,
            bundled: d.bundled,
            current: d.current,
            required: d.required,
          }}
        />
      </section>
    </>
  );
}
