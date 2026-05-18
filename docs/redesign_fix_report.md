# redesign フォルダ 追加改修レポート

**作成日:** 2026-03-16
**対象:** `aistation-db_20260316/redesign/`
**レビュー手法:** Bootstrap 5 レビューエージェント + フロントエンドデザインエージェントによる全ファイル分析

---

## 修正サマリー

| 優先度 | 件数 | 内容 |
|--------|------|------|
| Critical | 3 | CSRF id重複、aria-labelledby欠落、type="submit"混入 |
| Warning | 13 | モバイルナビ不全、モーダルコントラスト、インラインスタイル/イベント等 |
| UI/UX | 7 | ボタンラベル不統一、バッジコントラスト、アニメーション追加等 |

---

## 1. Critical 修正（機能・セキュリティ影響）

### 1.1 teams.html：モーダル aria-labelledby の参照先 id 欠落

**問題:** `aria-labelledby="key-new-modal-label"` が宣言されているが、対応する `id` を持つ要素が存在せず、スクリーンリーダーがモーダルタイトルを読み上げられなかった。

**修正:**
```html
<!-- Before -->
<h5 class="modal-title">Add API Key</h5>

<!-- After -->
<h5 class="modal-title" id="key-new-modal-label">Add API Key</h5>
<button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
```

### 1.2 teams.html：CSRF トークン id 重複

**問題:** `id="csrf_token"` が keys.html のモーダルと同じ id を使用。同一ページに複数フォームがある場合、jQuery が最初の要素しか取得しない。

**修正:** `id="csrf_token"` → `id="csrf_token_key"`

### 1.3 app.js：type="submit" が意図しないフォーム送信を誘発

**問題:** `userTeamActionFormatter` 内のチーム操作ボタン（4箇所）が `type="submit"` になっており、Bootstrap Table が `<tbody>` 内に注入するため、どの `<form>` に属するかがブラウザ依存だった。

**修正:**
- 全箇所 `type="submit"` → `type="button"` に変更
- イベントハンドラ側で `$el.closest('form').submit()` を明示呼び出し

---

## 2. Warning 修正（ベストプラクティス違反）

### 2.1 style.css：モーダルテキスト色のコントラスト不足

**問題:** `--bs-modal-color: var(--bs-body-bg)` でテキスト色を背景色（#f3f3f3）に設定。モーダル内テキストが見えなくなる致命的な問題。

**修正:** `--bs-modal-color: var(--bs-body-color)` に変更（#1B1B1B、正しいテキスト色）

### 2.2 全HTML：サイドバー .active クラスの付与先

**問題:** `.active` が `<li class="nav-item active">` に付与されていた（Bootstrap 4 パターン）。Bootstrap 5 では `<a class="nav-link active">` が正式。

**修正:** 全9ファイルで `<li>` → `<a>` に移動
```html
<!-- Before -->
<li class="nav-item active"><a class="nav-link" href="...">

<!-- After -->
<li class="nav-item"><a class="nav-link active" href="...">
```

### 2.3 style.css：モバイルでサイドバーにアクセス不能

**問題:** `display: none` のみでモバイル時にサイドバーナビゲーションが消滅。代替手段なし。

**修正:** Offcanvas サイドバー用の CSS クラス `.rd-offcanvas-sidebar` を追加
```css
.rd-offcanvas-sidebar {
    background-color: var(--bs-tertiary);
    width: var(--rd-sidebar-width);
}
```

### 2.4 user_edit.html / deploy_model_form.html：onclick インラインイベント

**問題:** `onclick="location.href='...'"` が CSP 違反。app.js のイベントデリゲーションパターンと不統一。

**修正:**
- `onclick` を削除し、JS クラス（`.js-back-to-user-list`, `.js-back-to-model-select`）を付与
- app.js の `initEventDelegation()` にハンドラを追加

### 2.5 user_edit.html：インラインスタイル残存

**問題:** `style="background: #fafafa;"` と `style="min-width: 100px;"` がハードコード。

**修正:** CSS クラス `.rd-role-section` / `.rd-role-section__label` を新設し置換
```html
<!-- Before -->
<div class="p-3 rounded-2 mb-3" style="background: #fafafa;">
<label class="form-label mb-0 fw-bold" style="min-width: 100px;">

<!-- After -->
<div class="rd-role-section mb-3">
<label class="form-label mb-0 fw-bold rd-role-section__label">
```

### 2.6 deploy_model_select.html / style.css：max-height ハードコード

**問題:** `style="max-height: 560px;"` がインラインで、ビューポート非対応。

**修正:**
- インラインスタイルを削除し、CSS クラス `.rd-model-select-scroll` を追加
- `max-height: calc(100vh - var(--rd-header-height) - 260px)` で動的計算に変更
- `.rd-form-scroll` も同様に `calc()` ベースに変更

### 2.7 deploy_model_select.html：タブの aria 属性欠落

**問題:** `aria-controls` / `aria-labelledby` が未設定。

**修正:**
```html
<button id="tab-btn-vllm" aria-controls="tab-vllm" aria-selected="true">VLLM</button>
<div id="tab-vllm" role="tabpanel" aria-labelledby="tab-btn-vllm">
```

### 2.8 mail_settings.html：中間ブレークポイント欠落

**問題:** `col-xl-3` / `col-xl-9` のみで、xl(1200px)未満でフォームが崩壊。

**修正:** `col-sm-4 col-xl-3` / `col-sm-8 col-xl-9` を追加。radiogroup に `aria-labelledby` も付与。

### 2.9 teams.html：モーダルに btn-close ボタン欠落

**問題:** 他モーダルにはある閉じるボタンが、Add API Key モーダルにのみ存在しなかった。

**修正:** `<button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>` を追加

### 2.10 keys.html：モーダルフッターボタン配置不統一

**問題:** `justify-content-between`（左右広がり）で、他モーダルの `justify-content-center` と不一致。

**修正:** `justify-content-end` に統一

### 2.11 deploy_model_form.html：モデルヘッダーの視覚的区別不明確

**問題:** `bg-light` は body 背景色と同じ #f3f3f3 で、区別がつかない。

**修正:** CSS クラス `.rd-form-model-header` を新設し `background: var(--rd-bg-subtle)` (#fafafa) を適用

---

## 3. UI/UX 改善

### 3.1 app.js：ボタンラベルの表記統一

**問題:** JS 生成ボタンが `addkey`, `edit`（小文字）で、HTML 側の `Add Team`, `Submit` 等と不統一。

**修正:** `addkey` → `Add Key`, `edit` → `Edit`

### 3.2 app.js / style.css：badge bg-info のコントラスト比

**問題:** `#91C8E4`（水色）+ 白テキストの対比は約 2.2:1 で WCAG AA 基準（4.5:1）を大幅に下回る。

**修正:** `bg-info` → `bg-info text-dark` で暗色テキストに変更（3箇所）

### 3.3 全HTML：装飾アイコンの aria-hidden 欠落

**問題:** テキストラベルと共存するアイコンに `aria-hidden="true"` がなく、スクリーンリーダーが重複読み上げ。

**修正:** 全10ファイルのサイドバーアイコン（7種）+ ヘッダーアイコン（2種）+ ソートアイコン + index.html リストアイコン（9種）に `aria-hidden="true"` を追加

### 3.4 model_settings.html：Deploying 行にスピナー追加

**問題:** 「Deploying...」が静的テキストのみで処理中であることが伝わりにくい。

**修正:** Bootstrap スピナー + CSS アニメーションドットを追加
```html
<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
Deploying<span class="c-deploying-text"></span>
```

### 3.5 model_settings.html：ヘッダーフォントサイズ不統一

**問題:** `fs-5`（1.25rem）が付与され他ページの `1rem` と異なっていた。

**修正:** `fs-5` を削除し、`rd-card__header` の CSS 定義（1rem）に統一

### 3.6 model_settings.html：テーブルパディングの二重定義

**問題:** CSS `.rd-card .table th` で定義済みの padding が、HTML の `ps-4 py-3` ユーティリティで上書きされていた。

**修正:** th/td からパディングユーティリティクラスを除去し、CSS ルールに一任

### 3.7 index.html：タイトル・メタタグ

**修正:**
- `<title>` を "Redesign" → "Home" に変更
- `<meta name="robots" content="noindex,nofollow">` を追加（他ページと統一）
- `app.js` の読み込みを追加

---

## 4. CSS ハードコード値の変数化

| 修正前 | 修正後 | ファイル / 箇所 |
|--------|--------|---------------|
| `color: #8d8989` | `var(--bs-secondary-color)` | style.css: `.cpybtn` |
| `border: 1px solid #ccc` | `var(--bs-border-color)` | style.css: `.cpybtn` |
| `color: #fff` | `var(--bs-white)` | style.css: `.c-model-card`, `.c-model-card__tag` |
| `background: #fff` | `var(--bs-white)` | style.css: `.c-form-textarea`, `.c-member-dropdown thead` |
| `background-color: #F5F4D7` | `var(--rd-member-tag-bg)` | style.css: `.c-member-tag` |
| `--bs-border-radius-lg: 8px` | `0.5rem` | style.css: `.form-control-lg` |
| `transition: all 0.2s ease` | 個別プロパティ + `var(--rd-transition)` | style.css: `.c-model-card` |
| `max-height: 460px / 560px` | `calc(100vh - ...)` | style.css: `.rd-form-scroll`, `.rd-model-select-scroll` |

---

## 5. レイアウト改善

### 5.1 `.rd-content` の幅計算を flex-grow に変更

```css
/* Before */
.rd-content {
    width: calc(100% - var(--rd-sidebar-width));
}

/* After */
.rd-content {
    flex-grow: 1;
    min-width: 0;
}
```

**意図:** Flexbox の `flex-grow: 1` を活用し、より宣言的でメンテナブルなレイアウトに。

### 5.2 `.c-member-tag` に display: inline-flex 追加

**問題:** `align-items: center` と `gap` が指定されていたが、`display` プロパティがなく Flex コンテキストが無効だった。

---

## 6. 新設 CSS クラス一覧

| クラス名 | 用途 |
|---------|------|
| `.rd-role-section` | user_edit のロール選択背景エリア |
| `.rd-role-section__label` | ロールラベルの最小幅 |
| `.rd-form-model-header` | deploy_model_form のモデル名ヘッダー |
| `.rd-model-select-scroll` | deploy_model_select のスクロール領域 |
| `.rd-offcanvas-sidebar` | モバイル用オフキャンバスサイドバー |
| `.c-deploying-text` | Deploying アニメーション用 |
| `--rd-member-tag-bg` | メンバータグ背景色の CSS 変数 |

---

## 7. 修正ファイル一覧

| ファイル | 修正数 | 主な修正内容 |
|---------|--------|------------|
| `static/css/style.css` | 15 | モーダル色、変数化、flex-grow、新クラス、calc()、アニメーション |
| `static/js/app.js` | 8 | type="button"統一、ラベル大文字化、badge contrast、イベント追加 |
| `index.html` | 4 | title、robots meta、app.js読込、aria-hidden |
| `keys.html` | 2 | ボタン配置統一、sidebar active |
| `teams.html` | 4 | modal id、btn-close、csrf id、sidebar active |
| `team_management.html` | 2 | ラベルテキスト、sidebar active |
| `user_management.html` | 1 | sidebar active |
| `user_edit.html` | 4 | インラインスタイル/イベント排除、sidebar active |
| `mail_settings.html` | 3 | 中間ブレークポイント、aria-labelledby、sidebar active |
| `model_settings.html` | 5 | font-size統一、sort icon aria、padding統一、spinner、sidebar active |
| `deploy_model_select.html` | 4 | inline style排除、tab aria、sidebar active |
| `deploy_model_form.html` | 3 | model header、onclick排除、sidebar active |

**全12ファイル、計55箇所の修正を実施。**

---

## 8. ボタン群の配置統一（2026-03-17 追加修正）

### 8.1 修正内容：justify-content-end への統一

**問題:** ページ間でボタン群の水平配置が不統一だった。

| ファイル | 修正前 | 修正後 |
|---------|--------|--------|
| `teams.html` (L109) | `justify-content-center` | `justify-content-end` |
| `team_management.html` (L103) | `justify-content-center` | `justify-content-end` |
| `deploy_model_form.html` (L157) | `justify-content-center` | `justify-content-end` |
| `keys.html` | `justify-content-end` | 変更なし（既に統一済み） |
| `user_edit.html` | `justify-content-end` | 変更なし（既に統一済み） |
| `mail_settings.html` | `justify-content-end` | 変更なし（既に統一済み） |

**修正:** 全6ファイルのボタン群を `d-flex justify-content-end`（右寄せ）に統一。

---

### 8.2 レビュー指摘事項（未修正・今後の改善候補）

bootstrap-reviewer および frontend-design エージェントによるレビューで、以下の追加改善点が指摘された。

#### [Warning] keys.html：modal-footer 内の二重 flex コンテナ

**問題:** `.modal-footer` は Bootstrap 5 でデフォルト `display: flex; justify-content: flex-end` が適用されるため、内側の `<div class="d-flex gap-3 justify-content-end">` は冗長。

**推奨:**
```html
<!-- 現状 -->
<div class="modal-footer">
  <div class="d-flex gap-3 justify-content-end">
    <button>...</button>
  </div>
</div>

<!-- 推奨 -->
<div class="modal-footer gap-3">
  <button>...</button>
</div>
```

#### [Warning] ボタン並び順の統一

**問題:** 全モーダルで Submit → Cancel の順（左から右）になっている。右寄せレイアウトでは Cancel が画面最右端に来るため、誤操作リスクがある。

**推奨:** UX ガイドライン上は Cancel → Submit（主アクションを右端）が推奨。deploy_model_form.html の Back → Submit は意味的に自然であり例外として許容。

#### [Warning] gap-3 の有無が不統一

**問題:** ボタンが複数あるコンテナでの `gap-3` の付与にばらつきがある。

| ファイル | gap-3 |
|---------|-------|
| teams.html / team_management.html / deploy_model_form.html / keys.html | あり |
| user_edit.html / mail_settings.html | なし（現状ボタン1つのため実害なし） |

**推奨:** 将来的な拡張を考慮し、全ボタンコンテナに `gap-3` を統一的に付与。

#### [Warning] border-top 前後の余白が不統一

**問題:** フォーム末尾のボタン群で、上下余白の指定が2パターン混在。

| パターン | 使用ファイル |
|---------|------------|
| `py-4 border-top` (上下 1.5rem) | deploy_model_form.html |
| `pt-3 border-top` (上のみ 1rem) | user_edit.html, mail_settings.html |

**推奨:** `pt-3 border-top` に統一、または共通クラス `.rd-form-actions` を新設して一元管理。

#### [Warning] モーダルのボタン配置コンテナが混在

**問題:** keys.html のみ `modal-footer` 内にボタン群があるが、teams.html / team_management.html は `modal-body` 末尾に配置。

**推奨:** 全モーダルで `modal-footer` を使用する構造に統一。

#### [Warning] user_edit.html の Submit / Cancel が分断

**問題:** Role フォームの Submit と、ページ末尾の Cancel が別コンテナに属しており、「ボタン群」として認識しにくい。

**推奨:** Cancel の役割（リスト画面への戻り）を明示するか、Submit と同一グループにまとめる設計変更を検討。

#### [Warning] deploy_model_form.html：advanced-toggle のキーボード操作不可

**問題:** `<div>` に `data-bs-toggle="collapse"` を設定しているため、Tab キーでフォーカスが当たらずキーボードユーザーが操作できない。

**推奨:**
```html
<!-- 現状 -->
<div class="c-advanced-toggle" data-bs-toggle="collapse" ...>

<!-- 推奨 -->
<button type="button" class="c-advanced-toggle w-100 border-0" data-bs-toggle="collapse" ...>
```

#### [Info] モバイル幅でのモーダルはみ出し

**問題:** `.rd-modal--big { min-width: 480px; }` がモバイル幅（320〜480px）で画面をはみ出す可能性。

**推奨:**
```css
@media (max-width: 575.98px) {
    .rd-modal--big {
        min-width: unset;
    }
}
```

#### [Info] 共通クラスの新設提案

**問題:** 各 HTML が `d-flex justify-content-end gap-3 pt-3 border-top` のようなユーティリティクラスの組み合わせで都度対応しており、保守性が低い。

**推奨:** コンポーネントクラス `.rd-form-actions` を新設し、CSS 1箇所での統制を可能にする。
```css
.rd-form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--bs-border-color);
}
```

---

## 9. model_settings.html の改修（2026-03-17 追加修正）

### 9.1 タイトル変更・Managementセクションへの移動

**変更内容:**
- `<title>` を「Model Settings」→「Model Management」に変更
- ページ内タイトルを「Model Settings」→「Model management」に変更
- サイドバーで「Models」リンクを Admin セクションから Management セクションへ移動し、表示名を「Model management」にリネーム
- **全10ファイル** のサイドバーを一括更新
- index.html のページ一覧リンクテキストを「Model Settings」→「Model Management」に修正
- deploy_model_select.html / deploy_model_form.html のパンくずリストを「Model settings」→「Model management」に修正

**背景:** 一般ユーザ用のモデル操作は別途作成予定（制限範囲検討中）のため、admin 用の Management セクションに配置。

**修正前のサイドバー構造:**
```
Admin
├ API Keys
├ Teams
├ Histories
└ Models          ← ここにあった
─────────────
Management
├ Team management
├ User management
└ Mail settings
```

**修正後のサイドバー構造:**
```
Admin
├ API Keys
├ Teams
└ Histories
─────────────
Management
├ Model management  ← ここに移動
├ Team management
├ User management
└ Mail settings
```

### 9.2 テーブルカラム削減

**変更内容:** Overrides〜Reasoning の7カラムを削除し、`table-responsive` ラッパーを除去。

| 削除カラム |
|-----------|
| Overrides |
| Mode |
| Vision |
| Audio |
| Function |
| Tool |
| Reasoning |

**修正後のカラム構成（7列）:**

| Status | Label | Description | Model Name | Engine | Version | 操作 |
|--------|-------|-------------|------------|--------|---------|------|

横スクロールは不要となったため `<div class="table-responsive">` ラッパーを除去。

### 9.3 Deploying 行の削除

**変更内容:** `c-model-row--deploying` クラスの行（スピナー + Deploying アニメーション + Cancel ボタン）をテーブルから削除。

**CSS クリーンアップ:**
- `.c-model-row--deploying` のスタイル定義を削除
- `.c-deploying-text::after` アニメーション定義を削除
- `@keyframes deploying-dots` を削除
- 孤立した `.c-model-progress-row` のスタイル定義も削除

### 9.4 修正ファイル一覧

| ファイル | 修正内容 |
|---------|---------|
| `model_settings.html` | title変更、ページタイトル変更、サイドバー移動、カラム削減、Deploying行削除、table-responsive除去 |
| `index.html` | サイドバー移動、ページ一覧リンクテキスト修正 |
| `keys.html` | サイドバー移動 |
| `teams.html` | サイドバー移動 |
| `team_management.html` | サイドバー移動 |
| `user_management.html` | サイドバー移動 |
| `user_edit.html` | サイドバー移動 |
| `mail_settings.html` | サイドバー移動 |
| `deploy_model_select.html` | サイドバー移動、パンくずリスト修正 |
| `deploy_model_form.html` | サイドバー移動、パンくずリスト修正 |
| `static/css/style.css` | Deploying関連CSS削除（3ルール） |

### 9.5 レビュー指摘事項（未修正・今後の改善候補）

#### [Warning] Description カラムの white-space 制御

**問題:** `white-space: nowrap` が全 `td` に一律適用されている。カラム数が7列に絞られた今、Description 列は `white-space: normal` を許可して折り返し可能にすべき。実データで長い説明文が入ると視認性に影響する可能性あり。

#### [Warning] サイドバーのセクションラベルスタイルが非対称

**問題:** Admin セクションは `rd-sidebar__section-label`（青背景バッジ型）、Management セクションは `rd-sidebar__separator-label`（グレーキャプション型）で、視覚的な重み付けが異なる。意図的でなければどちらかに統一すべき。

#### [Warning] テーブルのアクセシビリティ

**問題:**
- `<table>` に `<caption>` 要素がない
- `<th>` に `scope="col"` 属性がない
- Remove ボタンが3行とも同一テキストで、スクリーンリーダーが操作対象を区別できない（`aria-label` で対象モデル名を明示すべき）

#### [Warning] カードヘッダーの構造

**問題:** `rd-card__header` 内でタイトルとアクションボタンが `<div>` 一枚に内包されているため、`display: flex; justify-content: space-between` のレイアウトが機能していない。

---

## 10. deploy_model_form.html のフォーム内容改修（2026-03-17 追加修正）

### 10.1 固定ヘッダーの変更

**変更内容:** モデル名からエンジン情報へ変更。モデルは上書き可能なため、固定ヘッダーにはバックエンドのエンジン情報を表示する。

```html
<!-- Before -->
<div class="rd-form-model-header">
  Qwen3 0.6B (VLLM, GPU)
</div>

<!-- After -->
<div class="rd-form-model-header">
  Deploy for vllm v0.14.0
</div>
```

### 10.2 フォームフィールドの実データ化

**変更内容:** ダミーフィールドを実際のフィールドに置き換え。

**基本フィールド（スクロール可能エリア）:**

| フィールド | 種別 | 必須 | デフォルト値 | 説明 |
|-----------|------|------|------------|------|
| model_source | text input | *Required | Qwen/Qwen3-0.6B | Model source URI |
| model_name | text input | *Required | qwen3-0.6b-cpu | Display name for the model |

**Advanced settings（折りたたみ）:**

| フィールド | 種別 | 必須 | デフォルト値 | 説明 |
|-----------|------|------|------------|------|
| CPU count | text input | - | 1 | Number of cores or GPUs to allocate |
| CPU memory(gb) | text input | - | 2 | Memory limit in GB |
| Parameters | textarea | - | JSON | Additional engine parameters |

### 10.3 ボタンの変更

| 項目 | Before | After |
|------|--------|-------|
| 左ボタン | Back（bi-arrow-left） | Cancel（bi-x） |
| 右ボタン | Submit（bi-check） | Submit（bi-plus-circle） |

### 10.4 その他の修正

- パンくずリスト: 「Deploy model」→「Model deploy」に変更
- Cancel / Submit ボタンのアイコンに `aria-hidden="true"` を追加

### 10.5 レビュー指摘事項（未修正・今後の改善候補）

#### [Critical] advanced-toggle のキーボード操作不可（既知・セクション8.2と重複）

**問題:** `.c-advanced-toggle` が `<div>` のため Tab キーで到達できない。`<button type="button">` に変更すべき。

#### [Warning] Required フィールドに `required` 属性がない

**問題:** `*Required` を視覚的に表示しているが、`<input>` に `required` 属性がなく HTML5 バリデーションが機能しない。`aria-required="true"` も未設定。

#### [Warning] CPU count / CPU memory に type="number" を使用すべき

**問題:** 数値入力フィールドが `type="text"` のため、モバイルで数値キーボードが表示されない。

#### [Warning] エンジンヘッダーの視覚的階層が弱い

**問題:** `rd-form-model-header` の背景色（#fafafa）が白地カードとの差が小さく、ヘッダーとしての重みが不足。`<h2>` や `<h3>` でのマークアップも検討すべき。

#### [Warning] スクロール領域の max-height が魔法数値に依存

**問題:** `.rd-form-scroll` の `calc(100vh - var(--rd-header-height) - 220px)` の `220px` が経験値。ビューポートが小さい場合にフォーム領域が圧縮される。`min-height` 指定がない。

#### [Info] Parameters textarea の初期高さ不足

**問題:** `min-height: 80px` では3行のJSONでスクロールが発生。`100px`〜`120px` が適切。

#### [Info] chevron アニメーションを CSS 化可能

**問題:** `aria-expanded` の変更に連動して CSS だけで回転を実現でき、JS（`initAdvancedToggle`）を削減できる。
```css
#advanced-toggle[aria-expanded="true"] .bi-chevron-down {
    transform: rotate(180deg);
    transition: transform 0.2s ease;
}
```
