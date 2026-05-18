# モデル選択画面 フィードバック解読 & 改修まとめ

> **元資料**: `~/Downloads/report.md`
> **対象画面**: `deploy_model_select.html` / `model_catalog.html`（共に `static/js/catalog.js` でレンダリング）
> **改修日**: 2026-04-23

---

## 1. 先方フィードバックの解読

先方の意図を「情報設計」「視覚設計」「フィルタ設計」の 3 軸に整理しました。

### 1-1. 情報設計（何を見せるか）

| # | 先方の指摘 | 真意の解釈 |
|---|---|---|
| A1 | top level に出力モダリティのラベル(Text, Embeddings) が欲しい | **使用目的が違う** Text と Embeddings を混在させない。openrouter のように画面の最上位で分離する。 |
| A2 | 総モデル数は不要（12 models） | 数自体が意思決定に寄与しない。ノイズ。 |
| A3 | 不要：エンジン情報 | 推論エンジン（vLLM/Ollama/...）は管理者の関心事ではない。"どうでも良い条件" カテゴリに分類。 |
| A4 | 重複ラベル: コーディング向け（数値で判別可）/ 軽量向け（サイズで判別可） | **同じ情報を2回出さない**。ラベル or 数値、どちらか一方に揃える。 |
| A5 | リリース日、reasoning の有無 → どうでも良い | フィルタ・カード上で目立たせる必要なし。 |

### 1-2. 視覚設計（どう見せるか）

| # | 先方の指摘 | 真意の解釈 |
|---|---|---|
| B1 | 配色が多くて見づらい。情報の重要性を意識してトーンを調整したい | **重要度の階層**を色で表現する。すべてに色がついていると焦点が定まらない。 |
| B2 | context, model size には配色しない | この2つは"参考情報"。色は付けず無彩色（グレー）に。 |
| B3 | アイコンは一般的なものを使いたい（openrouter, artificialanalysis 参考） | プロバイダーごとのブランドロゴで一目認識できるようにする。 |

### 1-3. フィルタ設計（どう絞り込むか）

先方は「フィルタ条件」を以下 3 種に分類しています:

| 種別 | 内容 | UI 上の役割 |
|---|---|---|
| **フィルタアウト要件**（条件に見合わなければ切り捨て） | context, input modality, license/publisher（欧米 or not） | 候補集合を狭めるための前提条件 |
| **比較条件**（候補内での絞り込み） | + フィルタアウト要件、性能評価（タスク総合・キャパ・速度） | 残った候補を選ぶための判断材料 |
| **どうでも良い条件** | engine, リリース日, reasoning の有無 | 表示しない or 目立たせない |
| **場合によりフィルタアウト** | 価格、消費リソース | 文脈次第。今回スコープ外 |

→ 現状フィルタは "全部並列" だが、先方は **「これは絞り込み用」「これは比較用」と意図を分けて見せたい** と読み取れます。

### 1-4. 悩みどころとして提示された点（=こちらの判断が必要）

| # | 先方の悩み | こちらの判断 |
|---|---|---|
| C1 | filter をアコーディオンで隠すべきか / 一覧上で表示しないか | **アコーディオン維持**。条件が増えた（modality, publisher region 追加）ため常時展開だと縦に長すぎる。代わりにアクティブフィルタは閉じていても表示。 |
| C2 | ラベル or 数値（重複） | **数値を残しラベルを消す**。数値の方が情報量が多く比較もしやすい。ただし数値で判別できない概念（agent, multimodal, reasoning など）はラベル維持。 |

---

## 2. 改修内容（フィードバック → 実装の対応表）

### 2-1. 情報設計の対応

| 先方の指摘 | 対応 | 変更箇所 |
|---|---|---|
| A1 出力モダリティ tab | 画面最上部に Text / Embeddings タブを追加。`catalogState.modality` でフィルタリング | `deploy_model_select.html`, `model_catalog.html` の toolbar 直前 / `catalog.js` `initCatalog`, `filterModels` |
| A1 補強 | Embeddings サンプル 3 件追加（BGE Large EN v1.5, E5 Large v2, Qwen3 Embedding 8B）。MTEB / Retrieval / Classification ベンチマークで表示 | `catalog.js` `CATALOG_DATA` 末尾 |
| A2 総数表示削除 | `catalog-result-count` span を削除、count 更新コードも削除 | 両 HTML L79, `catalog.js` `renderCatalog` |
| A3 エンジン削除 | カード meta バッジ・list view カラム・detail view パネル・modal タグ・filter section をすべて削除 | `catalog.js` `renderCardView`, `renderListView`, `renderDetailView`, `renderDetailPanel`, `showCatalogModal` / 両 HTML filter panel |
| A4 重複ラベル削除 | `coding`, `lightweight` をカード上の use-case tag から非表示（数値・サイズが既に表現） | `catalog.js` `REDUNDANT_USECASES_ON_CARD` 定数で制御 |
| A5 リリース日 | カードからは元から非表示。detail panel から削除 | `catalog.js` `renderDetailPanel` |

### 2-2. 視覚設計の対応

| 先方の指摘 | 対応 | 変更箇所 |
|---|---|---|
| B1 配色を絞る | カード上の色付き要素を **use-case タグ + ベンチマークバー** のみに限定。それ以外の補助情報は無彩色 | `style.css` `.catalog-tag--neutral` 追加 |
| B2 context/size 無彩色 | `.catalog-tag--neutral` クラスで `var(--rd-bg-subtle)` 背景・`var(--bs-secondary-color)` 文字色 | カード・modal 双方に適用 |
| B3 プロバイダーアイコン | `static/img/providers/` に 10 ブランドの SVG を配置。カードヘッダーに `<img class="catalog-card__provider-icon">` を追加。`providerSlug()` で自動解決 | 新規 SVG × 10 / `catalog.js` `providerSlug`, `renderCardView` / `style.css` `.catalog-card__provider-icon` |

### 2-3. フィルタ設計の対応

フィルタパネルを **2 グループ** に再構成しました:

```
┌─ 必須条件 (満たさないモデルを除外) ──────────┐
│ Input modality | Publisher region          │
│ License        | Min context              │
└────────────────────────────────────────────┘
┌─ 比較条件 (候補内の絞り込み) ──────────────┐
│ Capabilities | Model size                  │
└────────────────────────────────────────────┘
```

| 先方の指摘 | 対応 | 変更箇所 |
|---|---|---|
| publisher region フィルタ追加 | `publisher_region: "western" \| "chinese" \| "other"` をデータに追加。Qwen/DeepSeek/Zhipu/BAAI=chinese, それ以外=western。フィルタ section 追加 | `catalog.js` `CATALOG_DATA`, `filterModels` / 両 HTML filter panel |
| input modality（フィルタアウト） | 既存 `interfaces` フィルタを「必須条件」グループに配置。default の `text` チェックは廃止（top tab で分離済みのため） | 両 HTML filter panel |
| context（フィルタアウト） | 既存 `filter-context` を「必須条件」グループに統一配置 | 両 HTML filter panel |
| capabilities, size（比較） | 「比較条件」グループに配置 | 両 HTML filter panel |
| engine（不要）削除 | filter section と state, readFilterState から削除 | 両 HTML / `catalog.js` |
| C1 アコーディオン維持 + active filter 常時表示 | アクティブフィルタチップ列を `catalog-filter-panel` の **外** に移動。`:empty` 時は非表示 | 両 HTML / `style.css` `.catalog-active-filters` |
| C2 ラベル/数値の選択 | ラベル(coding, lightweight) を消し、数値(HumanEval, size badge) を残す | `catalog.js` `REDUNDANT_USECASES_ON_CARD` |

---

## 3. 変更ファイル一覧

| ファイル | 変更概要 |
|---|---|
| `deploy_model_select.html` | modality tab 追加 / count 削除 / filter panel 再構成 / active-filters 移動 |
| `model_catalog.html` | 同上 |
| `static/js/catalog.js` | `CATALOG_DATA` に `modality`, `publisher_region` 追加 + Embeddings 3 件 / state に `modality` 追加 / `filterModels` 拡張 / `renderCardView` provider icon・engine 削除・redundant usecase フィルタ・modality 別ベンチマーク / list/detail/modal の engine 削除と modality 対応 / count 更新削除 / `providerSlug`, `publisherRegionLabel` 追加 |
| `static/css/style.css` | `.catalog-card__header` を flex に変更 / `.catalog-card__provider-icon`, `.catalog-card__heading` 追加 / 末尾に v2 セクション（modality tabs, neutral tag, filter group, active-filters 再配置）追加 |
| `static/img/providers/*.svg`（新規 10） | qwen, meta, google, microsoft, deepseek, mistral, cohere, zhipu, huggingface, baai |

---

## 4. 検証手順

```bash
cd /Users/imoto/Desktop/aistation-db-ui02
python3 -m http.server 8000
```

ブラウザで以下を確認:

1. **`http://localhost:8000/deploy_model_select.html`**
   - [x] 画面最上部に "Text / Embeddings" タブが出ている
   - [x] "12 models" 表記がない
   - [x] カードに provider アイコンが表示される（Qwen=紫, Meta=青, etc.）
   - [x] size / context バッジが無彩色（グレー）になっている
   - [x] engine バッジが消えている
   - [x] "コーディング向け" / "軽量向け" タグが消えている（HumanEval スコアとサイズで判別）
   - [x] "agent向け" / "推論向け" / "マルチモーダル向け" などは色付きで残っている
   - [x] Filter ボタンを押すと「必須条件」「比較条件」の2グループに分かれている
   - [x] Engine セクションは無い、Publisher region セクションは新設されている
   - [x] Publisher region で "Chinese" を選ぶと Qwen/DeepSeek/Zhipu のみに絞られる
   - [x] フィルタを設定してアコーディオンを閉じても active chip が下に残る
   - [x] Embeddings タブに切り替えると BGE/E5/Qwen3-Embedding 3 件が表示され、ベンチマークが MTEB/Retr./Class. に変わる

2. **`http://localhost:8000/model_catalog.html`**
   - 上記と同じ修正がユーザー画面にも反映されている

3. **クリック動作**
   - deploy_model_select でカードクリック → `deploy_model_form.html?model=...` に遷移
   - model_catalog でカードクリック → modal が開く（既存動作維持）

---

## 5. 今回スコープ外（次回以降の検討事項）

先方資料に挙がっていたが今回見送った項目:

| 項目 | 理由 / 次回の方針 |
|---|---|
| 性能評価 (リクエストキャパシティ・生成速度) | 現状の `CATALOG_DATA` に該当データがない。バックエンド側でメトリクス収集が整い次第追加。 |
| 価格、消費リソース | 同上。場合によりフィルタアウト条件として追加検討。 |
| 一覧上にフィルタを常時表示するパターン (C1 別案) | 条件数が増えた今、縦スペースを取りすぎる。条件をさらに整理できれば再検討の余地あり。 |
| 画像生成 (image_gen) モダリティ | tab を増やすかどうかは取扱モデルが揃ってから判断。現状フィルタの interfaces には残置。 |
