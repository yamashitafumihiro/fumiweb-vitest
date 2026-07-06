# fumiweb

[https://www.fumiweb.net](https://www.fumiweb.net)

| ディレクトリ | 内容 |
|---|---|
| `frontend/` | Vite + React の SPA。main への push で自動デプロイ (`.github/workflows/deploy.yml`) |
| `backend/` | いいねボタン用の Go Lambda (getLikes / incrementLikes) |
| `infra/` | AWS インフラの Terraform 定義（詳細は `infra/README.md`） |

## 記事の追加方法

frontmatter 付きの markdown を `frontend/public/posts/<slug>.md` に置くだけ。
記事一覧は build/dev 時に自動生成される（`frontend/scripts/generatePostsIndex.mjs`）。

```markdown
---
title: "記事タイトル"
date: 2026-07-07
image: /images/technology.png   # 省略時は technology.png
---

## 本文をここから書く
```

- slug（URL とファイル名）: `/post/<slug>` でアクセスされる
- いいねの DynamoDB キーも slug がそのまま使われる
- サムネイル画像は `frontend/public/images/` に置く
