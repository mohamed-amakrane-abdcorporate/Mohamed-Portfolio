/**
 * Uploads everything under /public/assets to Vercel Blob.
 *
 * Prereqs:
 *   1. npm install            (installs @vercel/blob)
 *   2. Create a Blob store on Vercel and get its Read/Write token:
 *        vercel link
 *        vercel blob create-store portfolio-media
 *        vercel env pull .env.local        # pulls BLOB_READ_WRITE_TOKEN
 *   3. Run:
 *        node --env-file=.env.local scripts/upload-videos.mjs
 *
 * After it finishes it prints NEXT_PUBLIC_MEDIA_BASE_URL — add that value to
 * your Vercel project env vars (Production + Preview + Development).
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { put } from "@vercel/blob";

const ROOT = "public/assets";
const MEDIA_RE = /\.(mp4|mov|webm|png|jpe?g|webp|gif)$/i;

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error(
    "\n❌ BLOB_READ_WRITE_TOKEN is not set.\n" +
      "   Create a store and pull env first:\n" +
      "     vercel link\n" +
      "     vercel blob create-store portfolio-media\n" +
      "     vercel env pull .env.local\n" +
      "   Then: node --env-file=.env.local scripts/upload-videos.mjs\n",
  );
  process.exit(1);
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let base = "";
let count = 0;

for await (const file of walk(ROOT)) {
  if (!MEDIA_RE.test(file)) continue;
  // pathname mirrors the public folder, e.g. "assets/youtube video.mp4"
  const pathname = relative("public", file).split(sep).join("/");
  const data = await readFile(file);
  const { url } = await put(pathname, data, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    token,
  });
  base = new URL(url).origin;
  count++;
  console.log(`✓ ${pathname}  →  ${url}`);
}

console.log(`\nDone. Uploaded ${count} file(s).`);
if (base) {
  console.log(
    `\nAdd this to your Vercel project environment variables:\n` +
      `  NEXT_PUBLIC_MEDIA_BASE_URL=${base}\n`,
  );
}
