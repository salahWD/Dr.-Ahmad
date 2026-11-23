import { readFile } from "node:fs/promises";
import path from "node:path";
import { dataDir } from "@/db";

const types: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/** Serves images uploaded from the admin. Names are random, so files are cached forever. */
export async function GET(_request: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params;
  const match = /^[a-f0-9-]{36}\.(jpg|png|webp)$/.exec(file);
  if (!match) return new Response("Not found", { status: 404 });
  try {
    const body = await readFile(path.join(dataDir, "uploads", file));
    return new Response(body, {
      headers: {
        "Content-Type": types[match[1]],
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
