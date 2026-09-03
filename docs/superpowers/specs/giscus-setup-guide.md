# Giscus 留言區設定指南

這份指南是 `src/lib/giscus.ts` 裡 `repoId` / `categoryId` 兩個 `'REPLACE_ME'` 的填法。整個流程需要你用自己的 GitHub 帳號操作，Claude 沒辦法代勞。

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
