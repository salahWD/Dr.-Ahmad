import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "./schema";
import { seed } from "./seed";

export type Db = LibSQLDatabase<typeof schema>;

/** Folder for the SQLite file and uploaded images. Back this folder up. */
export const dataDir = path.resolve(process.env.DATA_DIR?.trim() || "data");

function connectionUrl() {
  const url = process.env.DATABASE_URL?.trim();
  if (url) return url;
  mkdirSync(dataDir, { recursive: true });
  return `file:${path.join(dataDir, "clinic.db").split(path.sep).join("/")}`;
}

async function open(): Promise<Db> {
  const url = connectionUrl();
  const client: Client = createClient({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN?.trim() || undefined,
  });
  const db = drizzle(client, { schema });
  if (url.startsWith("file:")) {
    await client.execute("PRAGMA journal_mode = WAL");
    await client.execute("PRAGMA busy_timeout = 5000");
  }
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), "drizzle"),
  });
  await client.execute("PRAGMA foreign_keys = ON");
  await seed(db);
  return db;
}

const cache = globalThis as unknown as { __clinicDb?: Promise<Db> };

/** Returns the migrated, seeded database. The connection is shared across requests. */
export function getDb(): Promise<Db> {
  if (!cache.__clinicDb) {
    cache.__clinicDb = open().catch((error) => {
      cache.__clinicDb = undefined;
      throw error;
    });
  }
  return cache.__clinicDb;
}
