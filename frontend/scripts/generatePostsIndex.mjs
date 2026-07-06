// public/posts/*.md の frontmatter から記事インデックス (src/generated/postsIndex.ts) を生成する。
// 記事の追加は「frontmatter 付きの md を public/posts/ に置くだけ」。
// npm run dev / build の前に自動実行される (predev / prebuild)。

import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const postsDir = path.resolve(frontendRoot, "public/posts");
const outFile = path.resolve(frontendRoot, "src/generated/postsIndex.ts");

const DEFAULT_IMAGE = "/images/technology.png";

// YAML は 2024-07-05 を Date にパースするので YYYY-MM-DD 文字列へ正規化する
const toIsoDate = (value) => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.toISOString().slice(0, 10);
    }
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }
    return null;
};

const files = (await readdir(postsDir)).filter((f) => f.endsWith(".md")).sort();

const posts = [];
const errors = [];

for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const raw = await readFile(path.join(postsDir, file), "utf8");
    const { data } = matter(raw);

    const title = typeof data.title === "string" ? data.title.trim() : "";
    const date = toIsoDate(data.date);

    if (!title) errors.push(`${file}: frontmatter に title がありません`);
    if (!date) errors.push(`${file}: frontmatter の date が不正です (YYYY-MM-DD で指定)`);

    posts.push({
        slug,
        title,
        date: date ?? "",
        image: typeof data.image === "string" && data.image ? data.image : DEFAULT_IMAGE,
    });
}

if (errors.length > 0) {
    console.error("[generatePostsIndex] エラー:");
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
}

posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));

const banner = `// このファイルは scripts/generatePostsIndex.mjs により自動生成される。直接編集しないこと。
// 記事の追加: frontmatter (title/date/image) 付きの md を public/posts/ に置く。`;

const body = `${banner}
import type { BlogPost } from "../lib/posts";

export const posts: BlogPost[] = ${JSON.stringify(posts, null, 4)};
`;

await mkdir(path.dirname(outFile), { recursive: true });
await writeFile(outFile, body);
console.log(`[generatePostsIndex] ${posts.length} 記事 -> ${path.relative(process.cwd(), outFile)}`);
