# 2026-05-01 MTG 朝確認ブリーフィング

> **このファイルだけで MTG 直前に必要な情報が揃うように作成**
> 詳細は `docs/model_select_two_options.md`（MTG 提出資料）を参照。

---

## 0. 30 秒サマリ

- **MTG の目的**: Model Select 改修の **採用案決定**（案A / 案B / ハイブリッド）
- **持参モック**:
  - 案A（こちら案）= 白基調 + 横バー + Plan D modality + **詳細ページ付き**
  - 案B（先方案）= ダーク + 5-dot 円 + フラット modality
- **追加対応 2 件**:
  1. **Artificial Analysis 出典明記** — 両案に ② カード一覧上部 + ① フッター で実装済み
  2. **案A 詳細ページ** — カードクリックで遷移、18 列ベンチマーク + Spec + Deploy CTA
- **未着手（要相談）**: 案B の詳細ページ（先方サンプルに jinja Detail view あり、MTG で意向確認）

---

## 1. 共有 URL（Basic Auth: `preview` / `aistation2026`）

| 用途 | URL |
|---|---|
| **比較インデックス（最初に開く）** | https://aistation-db-ui02.vercel.app/mocks/_model_select_compare.html |
| 案A 一覧 | https://aistation-db-ui02.vercel.app/mocks/_model_select_a.html |
| **案A 詳細ページ** | https://aistation-db-ui02.vercel.app/mocks/_model_detail_a.html |
| 案B（先方仕様） | https://aistation-db-ui02.vercel.app/mocks/_model_select_b.html |
| （参考）モダリティ案 A〜D | https://aistation-db-ui02.vercel.app/_modality_mock.html |

**画面遷移デモ**: 比較 → 案A 一覧 → カードクリック → 案A 詳細 → 「このモデルでデプロイ」 → deploy_model_form の流れを見せると、案A の世界観が一気に伝わる。

---

## 2. MTG 論点（優先度順）

### 2-1. 採用案の決定 ★最重要
- 案A / 案B / ハイブリッド（案A 構造 + 案B 5-dot 等）
- 決まれば §9 の本実装 TODO に進める

### 2-2. モダリティ表現
- 案A: **IN→OUT アイコン分離**（Plan D 採択済の継続）
- 案B: **フラット input modality タグ + output はタブ依存**
- 論点: Stable Diffusion 系（T→I）や omni 系（T,I,A,V→T）のように OUT が text 以外のとき、案B は読みづらい

### 2-3. 5-dot 離散 vs 横バー連続値
- 案A 横バー: 5.7 と 7.0 の差が見える
- 案B 5-dot: しきい値で印象が変わる（5.7 と 7.0 が同塗り数になる場合あり）
- 論点: 比較しやすさ vs 精度の伝わりやすさ

### 2-4. 18 列高度ベンチマークの置き場所
- 案A は **詳細ページに集約済み**（カードは 3-5 指標）
- 案B は現状未実装（先方サンプルでは Detail view 想定）
- 論点: カードに置く / Detail view に分離 / 案A のように個別詳細ページに置く

### 2-5. Artificial Analysis 出典明記の最終形
- 現状: ② カード一覧上部「ベンチマーク値の出典: Artificial Analysis ↗」（日本語）+ ① フッター "Performance data provided by Artificial Analysis ↗"（英語）
- 論点 a. テキストのみで OK か、**ロゴ併用**するか（社内法務確認の要否）
- 論点 b. 文言を **英日統一**するか（現状は使い分け）

### 2-6. 案B にも詳細ページを揃えるか
- 案A だけ詳細ページがあり対称性が崩れている
- 先方サンプルに jinja Detail view 相当があるはず → **MTG で先方の意向を確認**
- 案B 採用時のみ作る / 並走で作る / 一覧 + ソート可能テーブル形式にする

### 2-7. 本実装スケジュール
- 採用案決定後の `static/js/catalog.js` / `deploy_model_select.html` への取り込みタイミング

---

## 3. 想定 Q&A

**Q. なぜ 2 案併走したの？**
A. 4/30 朝に先方サンプルを受領し、既存方向性（Plan D）と大きく異なる方針が示されたため。両方を見比べて意思決定できる状態にした。

**Q. 案A の利点は？**
A. ①既存 UI との連続性（導入コスト低）、②連続値で僅差が伝わる、③IN/OUT 分離で multi-modal モデルが正確に表現できる、④詳細ページで情報の階層化ができている。

**Q. 案B の利点は？**
A. ①円塗り数で並列比較が極めて速い、②Spd/TTFT を主指標と同じ視覚言語に統合（6 指標同列）、③情報密度が高くモデル数が増えても耐える。

**Q. ハイブリッドは可能？**
A. 可能。例: 案A の構造（白背景 + Plan D modality + 詳細ページ）+ 案B の 5-dot 円スコア（バーの代わり）。MTG で要望が出たら工数見積もって翌日対応可能。

**Q. Artificial Analysis のロゴは出さなくていい？**
A. 規約上は任意。ブランドキット URL は §10-1 に記載。今はテキストリンクのみで遵守は満たしている。法務確認後にロゴ併用は追加可能。

**Q. 18 列ベンチマークはカードに出さない？**
A. 案A は詳細ページに集約。カードに 18 列出すと縦に長くなりすぎ、比較ユースに合わない判断。

---

## 4. 朝までに見直しておくと良いもの

1. **案A 詳細ページ** を実際にクリック遷移して確認（カード → 詳細 → CTA）
2. **3 つのモデルで詳細ページを開いて** Spec / Parameters / 18 列ベンチがそれぞれ正しく描画されるか
   - https://aistation-db-ui02.vercel.app/mocks/_model_detail_a.html?id=qwen3-0.6b-cpu
   - https://aistation-db-ui02.vercel.app/mocks/_model_detail_a.html?id=gemma4-e2b-it
   - https://aistation-db-ui02.vercel.app/mocks/_model_detail_a.html?id=gemma3n-e2b-it
3. 案B のフッター attribution 表示（ダーク背景に対する視認性）

---

## 5. MTG 後の TODO（採用案決定後の動き）

詳細は `docs/model_select_two_options.md` §9・§10-6 参照。要点のみ:

- [ ] 採用案を `static/js/catalog.js` の `CATALOG_DATA` 形式に置換 or 共存
- [ ] `renderCardView` を採用案レイアウトへ統一
- [ ] フィルタ UI 再構成（Context / Input modality / Publisher / License chip）
- [ ] 案A 採用なら詳細ページを本実装側にも展開、案B 採用なら詳細ページを案B 流に作成
- [ ] Artificial Analysis 出典を本実装の `deploy_model_select.html` / `model_catalog.html` にも適用
- [ ] Detail view（一覧の代替テーブル + ソート）を実装

---

## 6. 関連ファイル

| パス | 役割 |
|---|---|
| `docs/model_select_two_options.md` | **MTG 提出用詳細資料**（10 セクション、§3-4 案A 詳細ページ・§10 出典明記） |
| `docs/model_select_feedback_response.md` | 4/23 初回フィードバック対応の経緯 |
| `mocks/_model_select_compare.html` | 比較インデックス（最初に共有） |
| `mocks/_model_select_a.html` / `_model_detail_a.html` | 案A 一覧・詳細 |
| `mocks/_model_select_b.html` | 案B |
| `mocks/_preset_data.js` | 先方共有 preset.json をフラット化したデータモジュール |
| `sample_data/preset.json` | 先方 raw データ |
