# Writing 文章頁面改版設計

日期：2026-09-03
範圍：`src/pages/writing/[slug].astro`、相關樣式（`src/styles/global.css`）、`src/content.config.ts`（writing schema）、`src/lib/format.ts`（新增輔助函式）

## 背景 / 目標

`writing` 頁面目前的文章頁（單篇 `[slug].astro`）已經有部分基礎（頂部品牌列、TOC 含 scroll-spy、blockquote、行內小字註解、`hr` 分隔線），但版面順序與方格子/Medium 類長文閱讀骨架不同，且缺少文末的社群/導覽區塊。本次改版目標：

1. 調整頁面資訊順序，符合「單欄置中＋目錄獨立成一區、置於標題之前」的骨架
2. 補齊文章標題區（作者頭像＋暱稱、閱讀時間、更新時間）
3. 目錄加入可收合互動（保留既有的平滑捲動＋scroll-spy）
4. 文末新增：標籤（從標題區搬移）、留言（Giscus）、上一篇/下一篇、「更多文章」（合併原本的「作者其他文章」與「你可能也想看」）
5. 空狀態要優雅隱藏，不留空區塊（目前 `writing` collection 只有 1 篇文章）

不在本次範圍內：TOC 手機版「捲動時縮成浮動按鈕、點擊展開浮層」的進階效果（先不做，日後有需要再加）；文末真正的「文末註解清單」footnote 重構（保留現行行內小字註解樣式，只做視覺潤飾）。

## 1. 頁面順序

**現況**：封面圖 → meta bar（日期＋類型）→ H1 → tags → TOC → 內文 → 返回連結

**改版後**：

```
頂部品牌列（BaseLayout，不變）
──────────────────────────
目錄區塊（獨立卡片，標題「目錄」）
──────────────────────────
文章標題區
  H1 大標題
  作者頭像 + 暱稱
  發布時間 · （更新時間，若有）· 閱讀時間
──────────────────────────
封面圖（全寬）+ 圖說（caption，小字灰階，圖片正下方）
──────────────────────────
內文（Content）
──────────────────────────
文末
  標籤
  留言（Giscus）
  上一篇 / 下一篇
  更多文章（最多 3 篇，排除本篇，依日期新到舊）
  返回 /writing/ 連結
```

若某文章沒有封面圖（`post.data.image` 未設），沿用現有的漸層色塊 fallback，位置一樣搬到標題區之後。

## 2. 目錄（TOC）

- 沿用現有邏輯：`headings.filter(h => h.depth >= 2 && h.depth <= 3)`，H2 對應第一層、H3 縮排第二層
- 沿用現有的平滑捲動與 `IntersectionObserver` scroll-spy（`rootMargin: '-15% 0px -70% 0px'`），高亮目前章節連結
- 新增可收合：用原生 `<details>`/`<summary>` 語意化實作（不需額外 JS 就能收合展開，可用純 CSS 做箭頭旋轉動畫），標題文字固定為「目錄」
- 預設展開狀態：桌面版（≥720px）預設展開；手機版（<720px）預設收合。用一小段 inline script 在頁面載入時依 `matchMedia('(max-width: 720px)')` 設定 `<details>` 的 `open` 屬性（避免手機版一進來目錄佔滿版面）
- 不做：捲動時 TOC 縮成浮動按鈕/浮層（明確排除，見背景段落）
- 若文章沒有任何 H2/H3（`toc.length === 0`），整個目錄區塊不渲染（沿用現有行為）

## 3. 文章標題區

- H1 大標題（不變）
- 作者頭像 + 暱稱：頭像沿用首頁 `/profile.png`，暱稱固定文字「Yun-Jie Wu」，整列可點擊連到 `/#about`
- 發布時間／更新時間／閱讀時間，一列小字 meta：
  - 發布時間：`post.data.date`，用現有 `fmtDate`
  - 更新時間：`post.data.updated`（新增的 optional frontmatter 欄位），只有存在且與 `date` 不同時才顯示「· 更新於 {fmtDate(updated)}」
  - 閱讀時間：新輔助函式 `readingTime(rawContent)`，以「中文字數 / 400 字每分鐘」＋「英文單字數 / 200 字每分鐘」的合併估算，無條件進位到分鐘，顯示為「約 N 分鐘閱讀」
- 移除現有依 `type` 上色的 `meta-bar`／文章類型徽章（原本是「類型」，不在新設計的標題區規格內；`type` 分類徽章保留在封面圖右上角的既有 tag pill 位置，不變動）

## 4. 封面圖

- 全寬圖片，位置改到標題區之後（原本在最頂端）
- 圖說（`post.data.imageCredit`）維持置於圖片正下方、小字、灰階（沿用現有 `.credit` 樣式，只是連帶搬移位置）
- 無封面圖時的漸層色塊 fallback 邏輯不變，只搬移位置

## 5. 內文排版微調

- Blockquote：加粗字重（`font-weight` 提升，例如 500），左側色條與底色沿用現有
- 行內小字註解（`<p class="note">`）：保留現行「顯示在該段落正下方」的行為與 Markdown 寫法（`<sup class="note-ref">[註N]</sup>` + 緊接著的 `<p class="note">`），不遷移成文末清單。清理現有 `margin:-10px 0 18px` 的負 margin 寫法，改成靠段落間距自然銜接的寫法（拿掉負值，改用縮小的 `margin-top`）
- 其餘（H2/H3 字級階層、圖片+圖說、`hr` 分隔線、table）沿用現有樣式，不改

## 6. 文末區塊

### 6.1 標籤

- 從標題區搬到文末，樣式沿用現有 `.tags`
- `post.data.tags` 為空/未設時不渲染

### 6.2 留言（Giscus）

- 用 [giscus](https://giscus.app) 嵌入，對應 GitHub repo `yunjiewuw/personal_website`
- 實作方式：在文章頁底部插入 giscus 的 `<script>` 標籤（`src="https://giscus.app/client.js"`），用 `data-repo`／`data-repo-id`／`data-category`／`data-category-id` 等屬性設定
- `data-repo-id`／`data-category-id` 需要使用者自己到 giscus.app 走一次設定流程才能取得（見下方「Giscus 設定指南」），程式碼裡先放明確的 placeholder 常數（例如 `src/lib/giscus.ts` 匯出一個設定物件，值先填 `'REPLACE_ME'`），並在檔案開頭寫清楚的 TODO 註解
- `data-mapping="pathname"`（每篇文章各自對應一個 Discussion）、`data-theme` 用一個貼近現有 Morandi 配色的 light theme（先用 giscus 內建的 `light` 主題，不特別客製化）

### 6.3 上一篇 / 下一篇

- 在 `getStaticPaths` 階段，把整個 `writing` collection 依 `date` 新到舊排序後，算出每篇文章的 `prev`（更舊的一篇）／`next`（更新的一篇），透過 `props` 傳給頁面
- 只有 1 篇文章、或本篇已經是最新/最舊時，對應的一側不渲染；兩側都沒有時，整個「上一篇/下一篇」區塊不渲染

### 6.4 更多文章（合併區塊）

- 標題「更多文章」
- 資料來源：`writing` collection 依 `date` 新到舊排序，排除本篇，取前 3 篇
- 卡片樣式沿用 `/writing/` 列表頁的 `.card`／`.thumb`／`.tagtr`／`.avatar` 既有樣式（不重新設計一套新卡片）
- 空集合（目前只有 1 篇文章時就是這個狀態）：整塊不渲染

## 7. Schema / 程式碼變更清單

- `src/content.config.ts`：`writing` collection schema 新增 `updated: z.coerce.date().optional()`
- `src/lib/format.ts`：新增 `readingTime(raw: string): number`（回傳分鐘數）
- `src/lib/giscus.ts`（新檔）：匯出 giscus 設定常數，含 placeholder 待填欄位
- `src/pages/writing/[slug].astro`：
  - `getStaticPaths` 計算 `prev`/`next` 並傳入 `props`
  - 重新排列版面區塊順序（見第 1 節）
  - TOC 改用 `<details>`／`<summary>`，加 `matchMedia` 初始展開/收合的 inline script
  - 新增作者頭像/暱稱、閱讀時間、更新時間的標記
  - 新增文末標籤／Giscus／上下篇／更多文章區塊
- `src/styles/global.css`：新增/調整對應樣式（TOC details 樣式、作者列樣式、閱讀時間 meta 樣式、上下篇區塊、更多文章區塊標題、giscus 容器間距、blockquote 字重、`.prose p.note` 間距修正）

## 8. 空狀態總覽

| 區塊 | 觸發空狀態的條件 | 行為 |
|---|---|---|
| 目錄 | 文章內無 H2/H3 | 不渲染 |
| 更新時間 | `post.data.updated` 未設或等於 `date` | 不顯示「更新於」片段 |
| 標籤 | `post.data.tags` 未設或空陣列 | 不渲染 |
| 上一篇/下一篇 | 該側不存在 | 該側連結不渲染；兩側都無則整區不渲染 |
| 更多文章 | 排除本篇後沒有其他文章 | 整區不渲染 |

## 9. 明確排除（Out of scope）

- TOC 手機版「捲動後縮成浮動按鈕，點擊展開浮層」的進階互動
- 文末「註解清單」footnote 重構（保留行內小字註解）
- Giscus 的 GitHub Discussions 啟用、App 安裝、`repo-id`/`category-id` 取得（需使用者自行在 giscus.app 走一次流程，見另外提供的設定指南）
