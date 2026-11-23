import { count } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import { articles as articleSeed, content, treatments } from "@/lib/content";
import * as schema from "./schema";

const serviceIcons = ["activity", "syringe", "droplet", "dumbbell"];

const caseSeed: (typeof schema.cases.$inferInsert)[] = [
  {
    image: "photo:movement-assessment",
    conditionAr: "التأهيل الرياضي",
    conditionEn: "Sports rehabilitation",
    titleAr: "العودة إلى كرة القدم بعد التواء الكاحل",
    titleEn: "Back to weekend football after an ankle sprain",
    summaryAr:
      "لاعب هاوٍ تكرّر التواء كاحله وأراد العودة إلى المباريات من دون تردّد.",
    summaryEn:
      "A recreational player with repeated ankle sprains wanted to play again without hesitating.",
    treatmentAr:
      "تمارين توازن وتقوية متدرّجة، ثم عودة تدريجية إلى الجري وتغيير الاتجاه، مع برنامج تمارين منزلي.",
    treatmentEn:
      "Progressive balance and strength work, a staged return to running and changing direction, and a home exercise plan.",
    outcomeAr:
      "عاد إلى مباريات نهاية الأسبوع وفق خطة متدرّجة، ويتابع روتيناً منزلياً للمحافظة على قوّته.",
    outcomeEn:
      "Returned to weekend matches through a staged plan, with a home routine to keep his strength up.",
    sessions: 8,
    illustrative: true,
    sortOrder: 1,
  },
  {
    image: "photo:demo-entrance",
    conditionAr: "التأهيل بعد الجراحة · رعاية منزلية",
    conditionEn: "Post-surgery rehabilitation · Home care",
    titleAr: "استعادة المشي بعد جراحة الركبة في المنزل",
    titleEn: "Walking again after knee surgery, at home",
    summaryAr:
      "بعد عملية استبدال مفصل الركبة، احتاج المريض إلى جلسات في المنزل تراعي تعليمات الجرّاح.",
    summaryEn:
      "After a knee replacement, the patient needed home sessions that followed the surgeon’s instructions.",
    treatmentAr:
      "زيارات منزلية لتحسين مدى الحركة والتدرّب على المشي وصعود الدرج، بالتنسيق مع تعليمات الجرّاح.",
    treatmentEn:
      "Home visits for range of motion, walking practice and stairs, coordinated with the surgeon’s instructions.",
    outcomeAr: "عاد إلى المشي في الحيّ ويصعد الدرج في منزله بثقة أكبر.",
    outcomeEn:
      "Walking around the neighbourhood again and managing the stairs at home with more confidence.",
    sessions: 12,
    illustrative: true,
    sortOrder: 2,
  },
  {
    image: "photo:first-visit",
    conditionAr: "آلام الظهر والرقبة",
    conditionEn: "Back and neck pain",
    titleAr: "تيبّس الرقبة خلال ساعات العمل المكتبي",
    titleEn: "Neck stiffness through long desk days",
    summaryAr: "موظّفة مكتبية يزداد تيبّس رقبتها مع ساعات العمل الطويلة.",
    summaryEn:
      "An office worker whose neck stiffness built up through long workdays.",
    treatmentAr:
      "تقييم وضعية الجلوس ومكان العمل، وتمارين حركة، وخطة استراحات قصيرة خلال اليوم.",
    treatmentEn:
      "A review of her desk setup, mobility exercises and a plan for short movement breaks.",
    outcomeAr: "نوبات انزعاج أقل خلال يوم العمل، وروتين واضح للتعامل معها.",
    outcomeEn:
      "Fewer flare-ups during the workday and a clear routine for handling them.",
    sessions: 5,
    illustrative: true,
    sortOrder: 3,
  },
];

/** Default week: Monday–Friday 09:00–13:00 and 15:00–18:00, Saturday 09:00–13:00. */
const weekSeed = [1, 2, 3, 4, 5]
  .flatMap((weekday) => [
    { weekday, start: "09:00", end: "13:00" },
    { weekday, start: "15:00", end: "18:00" },
  ])
  .concat([{ weekday: 6, start: "09:00", end: "13:00" }]);

export const defaultSettings = {
  slotMinutes: "60",
  horizonDays: "21",
  minNoticeHours: "3",
  bookingEnabled: "true",
};

async function isEmpty(db: LibSQLDatabase<typeof schema>, table: SQLiteTable) {
  const [row] = await db.select({ n: count() }).from(table);
  return !row || row.n === 0;
}

/** Fills empty tables with the site's original content. Never overwrites existing rows. */
export async function seed(db: LibSQLDatabase<typeof schema>) {
  const [marker] = await db
    .select()
    .from(schema.settings)
    .limit(1);
  if (marker) return;

  if (await isEmpty(db, schema.services)) {
    await db.insert(schema.services).values(
      treatments.map((t, i) => ({
        icon: serviceIcons[i] ?? "activity",
        titleAr: t.ar[0],
        titleEn: t.en[0],
        summaryAr: t.ar[1],
        summaryEn: t.en[1],
        sortOrder: i + 1,
      })),
    );
  }

  if (await isEmpty(db, schema.articles)) {
    const body = (sections: readonly (readonly [string, string])[]) =>
      sections.map(([h, p]) => `## ${h}\n\n${p}`).join("\n\n");
    await db.insert(schema.articles).values(
      articleSeed.map((a, i) => ({
        slug: a.slug,
        image: `photo:${a.photo}`,
        categoryAr: a.ar.category,
        categoryEn: a.en.category,
        titleAr: a.ar.title,
        titleEn: a.en.title,
        introAr: a.ar.intro,
        introEn: a.en.intro,
        bodyAr: body(a.ar.sections),
        bodyEn: body(a.en.sections),
        sortOrder: i + 1,
      })),
    );
  }

  if (await isEmpty(db, schema.testimonials)) {
    await db.insert(schema.testimonials).values(
      content.ar.quotes.map(([quoteAr, subjectAr], i) => ({
        quoteAr,
        subjectAr,
        quoteEn: content.en.quotes[i]?.[0] ?? "",
        subjectEn: content.en.quotes[i]?.[1] ?? "",
        illustrative: true,
        sortOrder: i + 1,
      })),
    );
  }

  if (await isEmpty(db, schema.cases)) {
    await db.insert(schema.cases).values(caseSeed);
  }

  if (await isEmpty(db, schema.weeklyHours)) {
    await db.insert(schema.weeklyHours).values(weekSeed);
  }

  await db
    .insert(schema.settings)
    .values(
      Object.entries(defaultSettings).map(([key, value]) => ({ key, value })),
    )
    .onConflictDoNothing();
}
