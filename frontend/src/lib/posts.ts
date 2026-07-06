export interface BlogPost {
    slug: string;
    title: string;
    /** ISO 形式 (YYYY-MM-DD) */
    date: string;
    image: string;
}

// 先頭アンカー必須: 本文中の --- (水平線) を frontmatter と誤認しないため
const FRONTMATTER_PATTERN = /^---\r?\n[\s\S]*?\r?\n---\r?\n/;

/** 実行時に fetch した markdown から frontmatter を取り除く */
export const stripFrontmatter = (markdown: string): string =>
    markdown.replace(FRONTMATTER_PATTERN, "");

/** ISO 日付 (2025-02-17) を表示形式 (2025/02/17) にする */
export const formatDate = (isoDate: string): string => isoDate.replace(/-/g, "/");
