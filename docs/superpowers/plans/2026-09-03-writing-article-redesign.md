# Writing 文章頁面改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 依 `docs/superpowers/specs/2026-09-03-writing-article-redesign-design.md` 改版 `src/pages/writing/[slug].astro`，調整版面順序、加入可收合目錄、標題區作者資訊、閱讀時間，並補上文末標籤／Giscus 留言／上下篇／更多文章。

**Architecture:** Astro 靜態站台（無伺服器邏輯、無現有測試框架）。改動集中在四個檔案：`src/content.config.ts`（schema）、`src/lib/format.ts`（新增 `readingTime` 純函式）、`src/lib/giscus.ts`（新檔，giscus 設定常數）、`src/pages/writing/[slug].astro`（版面主體）、`src/styles/global.css`（樣式）。

**Tech Stack:** Astro 5、TypeScript、原生 CSS（無框架）、`astro:content` collections。

**關於測試**：這個 repo 目前沒有裝任何測試框架（`package.json` 裡只有 `astro check`，沒有 vitest/jest）。幫一個純函式（`readingTime`）新裝一整套測試框架不符合 YAGNI，所以本計畫用「`npm run check` 型別檢查 + 手動在瀏覽器裡驗證渲染結果」取代自動化測試，會在對應步驟寫清楚要看什麼、預期看到什麼。

---

### Task 1: Schema 加欄位 + `readingTime` 輔助函式

**Files:**
- Modify: `src/content.config.ts`
- Modify: `src/lib/format.ts`

- [ ] **Step 1: 在 `writing` collection schema 加上 `updated` 欄位**

在 `src/content.config.ts` 裡找到：

```ts
const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
```

改成：

```ts
const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),  // set when the article gets a substantive revision
```

（其餘欄位不動。）

- [ ] **Step 2: 型別檢查**

Run: `cd C:\Users\yunji\personal-site && npm run check`
Expected: 沒有新的型別錯誤（既有文章 `next-idea-prediction.md` 沒有 `updated` 欄位，因為是 optional 所以不會報錯）。

- [ ] **Step 3: 在 `src/lib/format.ts` 最後加上 `readingTime`**

在檔案結尾（`fmtDate` 之後）加上：

```ts
// --- reading time ---
// Rough estimate for mixed CJK/Latin text: CJK counts by character (~400/min),
// everything else counts by word (~200/min). Good enough for a "~N min read" label.
export const readingTime = (raw: string): number => {
  const cjk = raw.match(/[\u4e00-\u9fff\u3040-\u30ff]/g) ?? [];
  const nonCjk = raw.replace(/[\u4e00-\u9fff\u3040-\u30ff]/g, ' ');
  const words = nonCjk.match(/[A-Za-z0-9']+/g) ?? [];
  const minutes = cjk.length / 400 + words.length / 200;
  return Math.max(1, Math.ceil(minutes));
};
```

- [ ] **Step 4: 型別檢查**

Run: `cd C:\Users\yunji\personal-site && npm run check`
Expected: 沒有新的型別錯誤。

- [ ] **Step 5: Commit**

```bash
cd C:/Users/yunji/personal-site
git add src/content.config.ts src/lib/format.ts
git commit -m "feat(writing): add updated field + readingTime helper"
```

---

### Task 2: Giscus 設定模組

**Files:**
- Create: `src/lib/giscus.ts`
- Create: `docs/superpowers/specs/giscus-setup-guide.md`

- [ ] **Step 1: 建立 `src/lib/giscus.ts`**

```ts
// Giscus (GitHub Discussions-based comments) configuration.
//
// SETUP REQUIRED before comments will actually work — see
// docs/superpowers/specs/giscus-setup-guide.md for the full walkthrough.
// Until repoId/categoryId below are filled in, the embed script will render
// but show a "Configuration error" message instead of a comment box.
export const giscusConfig = {
  repo: 'yunjiewuw/personal_website' as const,
  repoId: 'REPLACE_ME', // from giscus.app, after connecting the repo
  category: 'Comments',
  categoryId: 'REPLACE_ME', // from giscus.app, after picking the Discussion category
  mapping: 'pathname' as const,
  theme: 'light' as const,
};
```

- [ ] **Step 2: 建立設定指南文件**

```markdown
# Giscus 設定指南

（內容見本次對話最後附上的 step-by-step guide，同一份文字。）
```

（這個檔案的完整內容在下面「Giscus 設定指南」章節，實作時直接照那份內容寫入 `docs/superpowers/specs/giscus-setup-guide.md`。）

- [ ] **Step 3: 型別檢查**

Run: `cd C:\Users\yunji\personal-site && npm run check`
Expected: 沒有新的型別錯誤。

- [ ] **Step 4: Commit**

```bash
cd C:/Users/yunji/personal-site
git add src/lib/giscus.ts docs/superpowers/specs/giscus-setup-guide.md
git commit -m "feat(writing): add giscus config module + setup guide"
```

---

### Task 3: 重寫 `src/pages/writing/[slug].astro`

這個檔案的版面順序、TOC 互動、文末區塊是同一個檔案裡互相依賴的改動（`getStaticPaths` 要同時算出 `prev`/`next`/`more`），拆成多個 task 意義不大，一次整檔改完，用瀏覽器驗證。

**Files:**
- Modify: `src/pages/writing/[slug].astro` (整檔改寫)

- [ ] **Step 1: 整檔改寫成以下內容**

```astro
---
import { getCollection, render } from 'astro:content';
import type { GetStaticPaths } from 'astro';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { gradient, avatarClass, writingLabel, writingTagClass, fmtDate, readingTime } from '../../lib/format';
import { giscusConfig } from '../../lib/giscus';

export const getStaticPaths = (async () => {
  const allPosts = await getCollection('writing');
  const publicPosts = allPosts
    .filter((p) => (import.meta.env.PROD ? !p.data.draft : true))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return allPosts.map((post) => {
    const i = publicPosts.findIndex((p) => p.id === post.id);
    return {
      params: { slug: post.id },
      props: {
        post,
        prev: i >= 0 ? (publicPosts[i + 1] ?? null) : null, // older post
        next: i >= 0 ? (publicPosts[i - 1] ?? null) : null, // newer post
        more: publicPosts.filter((p) => p.id !== post.id).slice(0, 3),
      },
    };
  });
}) satisfies GetStaticPaths;

const { post, prev, next, more } = Astro.props;
const { Content, headings } = await render(post);
const toc = headings.filter((h) => h.depth >= 2 && h.depth <= 3);
const minutes = readingTime(post.body ?? '');
const showUpdated = Boolean(post.data.updated && post.data.updated.valueOf() !== post.data.date.valueOf());
---
<BaseLayout title={`${post.data.title} — Yun-Jie Wu`} description={post.data.summary} active="writing">
  <article class="article">
    {toc.length > 0 && (
      <details class="toc" open>
        <summary class="toc-head">目錄</summary>
        <ol class="toc-list">
          {toc.map((h) => (
            <li class:list={[`toc-d${h.depth}`]}>
              <a href={`#${h.slug}`} data-target={h.slug}>{h.text}</a>
            </li>
          ))}
        </ol>
      </details>
    )}

    <div class="article-head">
      <h1>{post.data.title}</h1>
      <a class="byline" href="/#about">
        <img class="byline-avatar" src="/profile.png" alt="" />
        <span class="byline-name">Yun-Jie Wu</span>
      </a>
      <div class="meta">
        <time datetime={post.data.date.toISOString()}>{fmtDate(post.data.date)}</time>
        {showUpdated && (
          <>
            <span aria-hidden="true">·</span>
            <span>更新於 {fmtDate(post.data.updated as Date)}</span>
          </>
        )}
        <span aria-hidden="true">·</span>
        <span>約 {minutes} 分鐘閱讀</span>
      </div>
    </div>

    {post.data.image ? (
      <div class="hero-thumb hero-photo">
        <img src={post.data.image} alt={post.data.title} />
        <span class:list={['tagtr', writingTagClass(post.data.type)]}>{writingLabel(post.data.type)}</span>
      </div>
    ) : (
      <div class:list={['hero-thumb', gradient(post.data.color)]}>
        <span class:list={['tagtr', writingTagClass(post.data.type)]}>{writingLabel(post.data.type)}</span>
      </div>
    )}
    {post.data.imageCredit && <p class="credit" set:html={post.data.imageCredit} />}

    <div class="prose">
      <Content />
    </div>

    <footer class="article-foot">
      {post.data.tags && post.data.tags.length > 0 && (
        <div class="tags">
          {post.data.tags.map((tag) => <span>{tag}</span>)}
        </div>
      )}

      <section class="comments" id="comments">
        <script
          is:inline
          src="https://giscus.app/client.js"
          data-repo={giscusConfig.repo}
          data-repo-id={giscusConfig.repoId}
          data-category={giscusConfig.category}
          data-category-id={giscusConfig.categoryId}
          data-mapping={giscusConfig.mapping}
          data-theme={giscusConfig.theme}
          data-strict="0"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="bottom"
          data-lang="zh-TW"
          crossorigin="anonymous"
          async
        ></script>
      </section>

      {(prev || next) && (
        <nav class="post-nav">
          {prev ? (
            <a class="post-nav-link prev" href={`/writing/${prev.id}/`}>
              <span class="post-nav-label">← 上一篇</span>
              <span class="post-nav-title">{prev.data.title}</span>
            </a>
          ) : <span />}
          {next ? (
            <a class="post-nav-link next" href={`/writing/${next.id}/`}>
              <span class="post-nav-label">下一篇 →</span>
              <span class="post-nav-title">{next.data.title}</span>
            </a>
          ) : <span />}
        </nav>
      )}

      {more.length > 0 && (
        <section class="more-posts">
          <h2 class="more-posts-head">更多文章</h2>
          <div class="gallery">
            {more.map((p) => (
              <a class="card" href={`/writing/${p.id}/`}>
                <div class:list={['thumb', gradient(p.data.color)]}>
                  {p.data.image && <img src={p.data.image} alt="" loading="lazy" />}
                  <span class:list={['tagtr', writingTagClass(p.data.type)]}>{writingLabel(p.data.type)}</span>
                </div>
                <div class="body">
                  <h3>{p.data.title}</h3>
                  <p class="one">{p.data.summary}</p>
                </div>
                <div class="foot">
                  <span class="readmore">{fmtDate(p.data.date)}</span>
                  <span class:list={['avatar', avatarClass(p.data.color)]}>YW</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <a class="back" href="/writing/">← All writing</a>
    </footer>
  </article>
</BaseLayout>

<script>
  // Scroll-spy: highlight the current section's TOC link.
  const links = document.querySelectorAll<HTMLAnchorElement>('.toc-list a[data-target]');
  if (links.length > 0) {
    const map = new Map<string, HTMLAnchorElement>();
    links.forEach((a) => {
      const target = a.dataset.target;
      if (target) map.set(target, a);
    });

    const setActive = (id: string) => {
      links.forEach((a) => a.classList.remove('active'));
      map.get(id)?.classList.add('active');
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    );

    document.querySelectorAll('.prose h2[id], .prose h3[id]').forEach((h) => observer.observe(h));
  }

  // Default TOC state: collapsed on narrow viewports, expanded on desktop.
  const toc = document.querySelector<HTMLDetailsElement>('details.toc');
  if (toc && window.matchMedia('(max-width: 720px)').matches) {
    toc.open = false;
  }
</script>
```

要點：
- `getStaticPaths` 用 `publicPosts`（依 build 環境過濾 draft、依日期新到舊排序）算 `prev`/`next`/`more`，但 `allPosts.map` 還是對「全部」文章（含 draft）產生頁面——跟現有行為一致：直接連結還能看到 draft 文章本人，只是它不會出現在別篇文章的上下篇/更多文章清單裡。
- `prev` = 陣列中下一個索引（比較舊），`next` = 上一個索引（比較新），因為 `publicPosts` 是新到舊排序。
- `showUpdated` 用 `Boolean(...)` 包起來確保是純 boolean，`{showUpdated && (...)}` 分支裡用 `post.data.updated as Date` 斷言（因為 `showUpdated` 為 true 時 TS 沒辦法自動窄化 `post.data.updated` 的型別）。

- [ ] **Step 2: 型別檢查**

Run: `cd C:\Users\yunji\personal-site && npm run check`
Expected: 沒有型別錯誤。如果報 `post.body` 相關錯誤，檢查 `astro:content` 版本（`node_modules/astro/dist/content/loaders/glob.d.ts` 應該有 `retainContent`/`body` 相關型別，本專案已確認存在）。

- [ ] **Step 3: 啟動 dev server 手動檢查**

Run: `cd C:\Users\yunji\personal-site && npm run dev`
開啟 `http://localhost:4321/writing/next-idea-prediction/`，確認：
- 頁面最上方（品牌列之後）先看到「目錄」區塊，裡面有 5 個左右的連結
- 目錄之後才是大標題、頭像+「Yun-Jie Wu」、日期 + 「約 N 分鐘閱讀」（沒有「更新於」，因為這篇沒設 `updated`）
- 再來才是封面圖 + 圖說
- 文章最下面依序看到：標籤（opinion / science_tech / ...）→ 留言區（可能顯示 giscus 的 configuration error，這是預期的，Task 2 的 placeholder 還沒填）→（沒有上一篇/下一篇區塊，因為現在只有這一篇文章）→（沒有「更多文章」區塊）→「← All writing」連結
- 點目錄裡任一項，會平滑捲動到對應標題，且標題沒有被固定 header 擋住

- [ ] **Step 4: 停掉 dev server，跑 production build 確認沒有壞掉**

Run: `cd C:\Users\yunji\personal-site && npm run build`
Expected: build 成功完成，沒有 error（`npm run build` 內部會先做 `astro check` 相當的型別轉譯，任何 schema/型別問題會在這裡炸出來）。

- [ ] **Step 5: Commit**

```bash
cd C:/Users/yunji/personal-site
git add src/pages/writing/[slug].astro
git commit -m "feat(writing): restructure article page layout + collapsible toc + footer sections"
```

---

### Task 4: 樣式（`src/styles/global.css`）

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: 取代 `/* ---- article / post page ---- */` 區塊**

把現有這段：

```css
/* ---- article / post page ---- */
.article{max-width:720px; margin:0 auto}
.article .hero-thumb{aspect-ratio:16/6; border-radius:16px; position:relative; margin-bottom:28px; overflow:hidden}
.article .hero-thumb.hero-photo{margin-bottom:8px}
.article .hero-thumb img{width:100%; height:100%; object-fit:cover; display:block}
.credit{font-size:12px; color:var(--muted); margin:0 0 28px; font-family:system-ui,sans-serif}
.credit a{color:var(--muted)}
.article h1{font-size:34px; font-weight:700; line-height:1.2; margin:0 0 10px}
.article .meta{font-family:system-ui,sans-serif; font-size:13px; color:var(--muted); display:flex; gap:12px; align-items:center; margin-bottom:8px}
.article .meta.meta-bar{margin:0 0 20px; padding:9px 16px; border-radius:8px}
.article .meta.meta-bar.t-reflective{background:var(--mauve-soft); color:var(--mauve-ink)}
.article .meta.meta-bar.t-science-observation{background:var(--sage-soft); color:var(--sage-ink)}
.article .meta.meta-bar.t-industry-observation{background:var(--sand-soft); color:var(--sand-ink)}
.article .meta.meta-bar.t-opinion{background:var(--slate-soft); color:var(--slate-ink)}
.prose{font-size:18px; line-height:1.75}
.prose p{margin:0 0 18px}
.prose h2{font-size:24px; font-weight:700; margin:36px 0 12px; scroll-margin-top:90px}
.prose h3{font-size:19.5px; font-weight:700; margin:28px 0 10px; scroll-margin-top:90px}
.prose a{color:var(--sage-ink)}
.prose strong{font-weight:700}
.prose blockquote{margin:20px 0; padding:4px 20px; border-left:3px solid var(--highlight);
  color:#4a4436; font-style:italic; background:var(--highlight-soft); border-radius:0 10px 10px 0}
.prose blockquote p{margin:0 0 10px}
.prose blockquote p:last-child{margin-bottom:0}
.prose ul,.prose ol{margin:0 0 18px; padding-left:24px}
.prose li{margin:0 0 10px}
.prose li:last-child{margin-bottom:0}
.prose hr{border:none; border-top:1px solid var(--rule); margin:40px 0}
.prose img{width:100%; border-radius:12px; margin:8px 0 2px; box-shadow:0 12px 28px -20px rgba(70,60,50,.5)}
.prose table{width:100%; border-collapse:collapse; table-layout:fixed;
  margin:8px 0 22px; font-family:system-ui,sans-serif; font-size:14.5px}
.prose th,.prose td{border:1px solid var(--rule); padding:9px 12px; text-align:left; vertical-align:top; word-break:break-word}
.prose th{background:var(--highlight-soft); color:var(--sage-ink); font-weight:600}
.prose .note-ref{font-family:system-ui,sans-serif; font-size:0.7em; color:var(--sage-ink); font-style:normal}
.prose p.note{font-family:system-ui,sans-serif; font-size:13.5px; line-height:1.6; color:var(--muted);
  margin:-10px 0 18px}
.prose del{color:var(--muted)}
```

換成：

```css
/* ---- article / post page ---- */
.article{max-width:720px; margin:0 auto}
.article-head{margin:0 0 24px}
.article h1{font-size:34px; font-weight:700; line-height:1.2; margin:0 0 14px}
.byline{display:inline-flex; align-items:center; gap:10px; text-decoration:none; margin-bottom:8px}
.byline-avatar{width:32px; height:32px; border-radius:50%; object-fit:cover; display:block}
.byline-name{font-family:system-ui,sans-serif; font-size:14.5px; font-weight:600; color:var(--ink)}
.article .meta{font-family:system-ui,sans-serif; font-size:13px; color:var(--muted); display:flex; gap:8px; align-items:center; margin-top:2px}
.article .hero-thumb{aspect-ratio:16/6; border-radius:16px; position:relative; margin-bottom:8px; overflow:hidden}
.article .hero-thumb img{width:100%; height:100%; object-fit:cover; display:block}
.credit{font-size:12px; color:var(--muted); margin:0 0 28px; font-family:system-ui,sans-serif}
.credit a{color:var(--muted)}
.prose{font-size:18px; line-height:1.75}
.prose p{margin:0 0 18px}
.prose h2{font-size:24px; font-weight:700; margin:36px 0 12px; scroll-margin-top:90px}
.prose h3{font-size:19.5px; font-weight:700; margin:28px 0 10px; scroll-margin-top:90px}
.prose a{color:var(--sage-ink)}
.prose strong{font-weight:700}
.prose blockquote{margin:20px 0; padding:4px 20px; border-left:3px solid var(--highlight);
  color:#4a4436; font-weight:500; font-style:italic; background:var(--highlight-soft); border-radius:0 10px 10px 0}
.prose blockquote p{margin:0 0 10px}
.prose blockquote p:last-child{margin-bottom:0}
.prose ul,.prose ol{margin:0 0 18px; padding-left:24px}
.prose li{margin:0 0 10px}
.prose li:last-child{margin-bottom:0}
.prose hr{border:none; border-top:1px solid var(--rule); margin:40px 0}
.prose img{width:100%; border-radius:12px; margin:8px 0 2px; box-shadow:0 12px 28px -20px rgba(70,60,50,.5)}
.prose table{width:100%; border-collapse:collapse; table-layout:fixed;
  margin:8px 0 22px; font-family:system-ui,sans-serif; font-size:14.5px}
.prose th,.prose td{border:1px solid var(--rule); padding:9px 12px; text-align:left; vertical-align:top; word-break:break-word}
.prose th{background:var(--highlight-soft); color:var(--sage-ink); font-weight:600}
.prose .note-ref{font-family:system-ui,sans-serif; font-size:0.7em; color:var(--sage-ink); font-style:normal}
.prose p.note{font-family:system-ui,sans-serif; font-size:13.5px; line-height:1.6; color:var(--muted);
  margin:4px 0 18px}
.prose del{color:var(--muted)}

/* ---- article footer: tags / comments / prev-next / more posts ---- */
.article-foot{margin-top:48px}
.comments{margin:36px 0}
.post-nav{display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:36px 0; padding-top:28px; border-top:1px solid var(--rule)}
.post-nav-link{display:flex; flex-direction:column; gap:6px; text-decoration:none; padding:16px 18px;
  border:1px solid var(--rule); border-radius:12px; transition:border-color .15s,background .15s}
.post-nav-link:hover{border-color:var(--sage); background:var(--highlight-soft)}
.post-nav-link.next{text-align:right; align-items:flex-end}
.post-nav-label{font-family:system-ui,sans-serif; font-size:11px; text-transform:uppercase; letter-spacing:.1em; color:var(--muted)}
.post-nav-title{font-size:15px; color:var(--ink); line-height:1.4}
.more-posts{margin:36px 0}
.more-posts-head{font-family:system-ui,sans-serif; font-size:12px; text-transform:uppercase; letter-spacing:.14em; color:var(--muted); margin:0 0 16px; font-weight:600}
.more-posts .gallery{display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:20px}
```

- [ ] **Step 2: 取代 `/* ---- table of contents ---- */` 區塊**

把現有這段：

```css
/* ---- table of contents ---- */
.toc{border:1px solid var(--rule); background:var(--card); border-radius:12px; padding:16px 20px; margin:0 0 32px}
.toc-head{font-family:system-ui,sans-serif; font-size:12px; text-transform:uppercase; letter-spacing:.12em; color:var(--muted); margin:0 0 10px}
.toc-list{list-style:none; margin:0; padding:0; font-family:system-ui,sans-serif; font-size:14.5px}
.toc-list li{margin:0 0 8px}
.toc-list li:last-child{margin-bottom:0}
.toc-list .toc-d3{padding-left:18px; font-size:13.5px}
.toc-list a{text-decoration:none; color:var(--muted); transition:color .15s}
.toc-list a:hover{color:var(--sage-ink)}
.toc-list a.active{color:var(--sage-ink); font-weight:600}
.back{display:inline-block; margin-top:40px; font-family:system-ui,sans-serif; font-size:13px; color:var(--sage-ink); text-decoration:none}
.back:hover{color:var(--clay-ink)}
```

換成：

```css
/* ---- table of contents ---- */
details.toc{border:1px solid var(--rule); background:var(--card); border-radius:12px; padding:16px 20px; margin:0 0 32px}
.toc-head{font-family:system-ui,sans-serif; font-size:12px; text-transform:uppercase; letter-spacing:.12em; color:var(--muted);
  margin:0; cursor:pointer; list-style:none; display:flex; align-items:center; justify-content:space-between; gap:8px}
.toc-head::-webkit-details-marker{display:none}
.toc-head::marker{content:""}
.toc-head::after{content:"▾"; font-size:11px; color:var(--muted); transition:transform .15s}
details.toc:not([open]) .toc-head::after{transform:rotate(-90deg)}
details.toc[open] .toc-head{margin-bottom:10px}
.toc-list{list-style:none; margin:0; padding:0; font-family:system-ui,sans-serif; font-size:14.5px}
.toc-list li{margin:0 0 8px}
.toc-list li:last-child{margin-bottom:0}
.toc-list .toc-d3{padding-left:18px; font-size:13.5px}
.toc-list a{text-decoration:none; color:var(--muted); transition:color .15s}
.toc-list a:hover{color:var(--sage-ink)}
.toc-list a.active{color:var(--sage-ink); font-weight:600}
.back{display:inline-block; margin-top:40px; font-family:system-ui,sans-serif; font-size:13px; color:var(--sage-ink); text-decoration:none}
.back:hover{color:var(--clay-ink)}
```

- [ ] **Step 3: 在既有的 `@media(max-width:720px){...}` 區塊裡加上手機版調整**

找到檔案最後：

```css
@media(max-width:720px){
  .about{grid-template-columns:1fr}
  .about .photo{min-height:280px}
  .topbar .inner{padding:12px 18px}
  .page{padding:28px 18px 80px}
}
```

改成：

```css
@media(max-width:720px){
  .about{grid-template-columns:1fr}
  .about .photo{min-height:280px}
  .topbar .inner{padding:12px 18px}
  .page{padding:28px 18px 80px}
  .post-nav{grid-template-columns:1fr}
  .post-nav-link.next{text-align:left; align-items:flex-start}
}
```

- [ ] **Step 4: 啟動 dev server 檢視樣式**

Run: `cd C:\Users\yunji\personal-site && npm run dev`
開啟 `http://localhost:4321/writing/next-idea-prediction/`，確認：
- 目錄區塊右側有一個向下箭頭，點擊「目錄」整條可以收合/展開，收合時箭頭轉向（旋轉成朝右）
- 把瀏覽器窄化到手機寬度（<720px）重新整理頁面，目錄預設是收合的
- 頭像是圓形、和暱稱同一行、點下去會連到首頁的 About 區塊
- 引言（blockquote）看起來字重比正文粗一點
- 行內註解小字（`[註1]` 附近）跟段落之間的間距看起來自然，不是硬擠在一起

- [ ] **Step 5: Commit**

```bash
cd C:/Users/yunji/personal-site
git add src/styles/global.css
git commit -m "style(writing): article page layout for redesigned skeleton"
```

---

### Task 5: 驗證上一篇/下一篇 + 更多文章的「有內容」狀態，然後跑完整 build

現在 `writing` collection 只有 1 篇文章，Task 3 的手動檢查只驗證得到「空狀態正確隱藏」。這個 task 用一篇暫時的假文章驗證「有內容時」正常顯示，驗證完刪掉，不留在 repo 裡。

**Files:**
- Create (暫時，驗證完刪除): `src/content/writing/_tmp-verify-post.md`

- [ ] **Step 1: 建立暫時文章**

```markdown
---
title: 暫時驗證用文章
date: 2026-01-01
type: reflective
summary: 用來驗證上一篇/下一篇與更多文章區塊的暫時文章，驗證完就刪除。
tags: [tmp]
---

## 第一節

驗證用內容。
```

存成 `src/content/writing/_tmp-verify-post.md`。

- [ ] **Step 2: 啟動 dev server，檢查兩篇文章互相的上下篇/更多文章**

Run: `cd C:\Users\yunji\personal-site && npm run dev`

開啟 `http://localhost:4321/writing/next-idea-prediction/`（日期較新），確認文末看到：
- 「上一篇」連到 `暫時驗證用文章`（因為它日期較舊）
- 沒有「下一篇」（因為這篇已經是最新）
- 「更多文章」區塊出現，卡片是 `暫時驗證用文章`

開啟 `http://localhost:4321/writing/_tmp-verify-post/`，確認文末看到：
- 「下一篇」連到 `Next Idea Prediction ...`
- 沒有「上一篇」
- 「更多文章」出現 `Next Idea Prediction ...` 那張卡

- [ ] **Step 3: 刪除暫時文章**

```bash
cd C:/Users/yunji/personal-site
rm src/content/writing/_tmp-verify-post.md
```

- [ ] **Step 4: 確認刪除後回到空狀態**

重新整理 `http://localhost:4321/writing/next-idea-prediction/`，確認「上一篇/下一篇」和「更多文章」區塊都不見了（回到只有 1 篇文章的狀態）。

- [ ] **Step 5: 停掉 dev server，跑完整 production build**

Run: `cd C:\Users\yunji\personal-site && npm run build`
Expected: build 成功，沒有 error（也確認暫時文章沒有被 commit 進 git：`git status` 應該乾淨，或至少不含 `_tmp-verify-post.md`）。

- [ ] **Step 6: 確認 git 乾淨（沒有殘留暫時檔案），不需要 commit（本 task 沒有留下程式碼變更）**

```bash
cd C:/Users/yunji/personal-site
git status
```

Expected: `nothing to commit, working tree clean`（或只顯示前面 task 已經 commit 過的內容，沒有 `_tmp-verify-post.md`）。

---

## Giscus 設定指南（存到 `docs/superpowers/specs/giscus-setup-guide.md`）

```markdown
# Giscus 留言區設定指南

這份指南是 Task 2 產生的 `src/lib/giscus.ts` 裡 `repoId` / `categoryId` 兩個 `'REPLACE_ME'` 的填法。整個流程需要你用自己的 GitHub 帳號操作，Claude 沒辦法代勞。

## 第 1 步：確認 repo 是 public

Giscus 只能掛在 **public** 的 GitHub repo 上。`yunjiewuw/personal_website` 如果目前是 private，要先到 GitHub repo 的 Settings → General → Danger Zone，改成 Public。

## 第 2 步：開啟 GitHub Discussions

1. 到 `https://github.com/yunjiewuw/personal_website`
2. 點上方 **Settings**
3. 往下找到 **Features** 區塊，勾選 **Discussions**
4. 回到 repo 首頁，應該會多一個 **Discussions** 分頁

## 第 3 步：建立一個叫「Comments」的 Discussion 分類

1. 到 repo 的 **Discussions** 分頁
2. 右側找 **Categories**，點旁邊的編輯（鉛筆）圖示，或是進 repo Settings 裡的 Discussions 設定
3. 新增一個分類，名稱取 `Comments`，格式（Format）選 **Announcement**（只有維護者能開新討論串——giscus 會用程式自動幫每篇文章開一則討論串，選這個格式可以避免訪客自己亂開新討論串）

## 第 4 步：安裝 giscus GitHub App

1. 開 `https://github.com/apps/giscus`
2. 點 **Install**
3. 選擇要授權的帳號/組織，然後指定只授權 `personal_website` 這個 repo（不用給全部 repo 權限）

## 第 5 步：到 giscus.app 產生設定值

1. 開 `https://giscus.app`
2. 在「repository」欄位輸入 `yunjiewuw/personal_website`，網頁會顯示一個綠色勾勾，代表偵測到 Discussions 已開啟、App 已安裝
3. Page ↔ Discussions Mapping 選 **pathname**（對應 `src/lib/giscus.ts` 裡的 `mapping: 'pathname'`，這樣每個文章網址會各自對應一則討論串）
4. Discussion Category 選你在第 3 步建立的 **Comments**
5. 頁面往下會出現一段 `<script src="https://giscus.app/client.js" ...>` 的程式碼，裡面有 `data-repo-id="R_kgxxxxxxx"` 和 `data-category-id="DIC_kwxxxxxxx"` 這兩個值，複製起來

## 第 6 步：填回專案裡

打開 `src/lib/giscus.ts`，把：

```ts
repoId: 'REPLACE_ME',
categoryId: 'REPLACE_ME',
```

換成第 5 步複製到的實際值，例如：

```ts
repoId: 'R_kgDOXXXXXXX',
categoryId: 'DIC_kwDOXXXXXXXXXXX',
```

存檔、`git commit`。

## 第 7 步：驗證

跑 `npm run dev`，開任一篇文章頁面，捲到最下面的留言區，應該會看到 giscus 的留言框（用 GitHub 帳號登入後就能留言），而不是先前的「Configuration error」訊息。

## 常見問題

- **留言區一片空白，Console 有 CORS 或 404 錯誤**：通常是 `repo` 名稱打錯，或是 App 還沒裝到那個 repo 上，回第 4 步檢查。
- **顯示 "Discussion not found" 但沒有留言框**：這是正常的，giscus 會在第一則留言送出時才自動建立對應的 Discussion，不用手動先建。
- **想換佈景（跟現在的 light 主題不搭）**：`src/lib/giscus.ts` 的 `theme` 欄位可以換成 giscus 支援的其他值（例如 `'light_protanopia'`、自訂 CSS URL 等），完整清單在 giscus.app 頁面上的 Theme 下拉選單。
```
