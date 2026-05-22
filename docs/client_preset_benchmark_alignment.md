# モデル選択画面 — preset.json ベンチマーク表示の整合

## 先方ご要望の整理

- **入力データ**は `preset.json`（`static/js/preset_data.js` 経由）のみ
- `catalog.js` 内の `CATALOG_DATA` サンプル（MMLU / HumanEval / MATH / MT-Bench）は**表示に使わない**
- **Card view** でグラフ表示している **Int / Cod / Mat / Spd / TTFT** を、**Detail view（一覧テーブル）** の列名・数値としても表示する

## 確認用 URL（ローカル）

プロジェクトを HTTP で配信したうえで、次を開いてください。

| 画面 | パス |
|------|------|
| モデル選択（今回の対象） | `deploy_model_select.html` |
| 参考: 旧サンプルカタログ | `model_catalog.html`（従来の MMLU 系のまま） |

例: `http://localhost:8080/deploy_model_select.html`

## 修正内容（技術）

### 1. データ源

`deploy_model_select.html` 読み込み時に `CATALOG_DATA` を **preset 一覧だけ**に差し替え、各モデルの `benchmarks` を preset の性能項目から生成:

| UI 表示 | preset.json フィールド |
|---------|------------------------|
| Int | `intelligence_index` |
| Cod | `coding_index` |
| Mat | `math_index` |
| Spd | `median_output_tokens_per_second` |
| TTFT | `median_time_to_first_token_seconds` → `ttft` |

### 2. ビュー別

- **Card view**: Int / Cod / Mat / Spd（バー）+ TTFT（チップ）— preset 参照
- **Detail view（テーブル）**: 列ヘッダーを MMLU 等から **Int / Cod / Mat / Spd / TTFT** に変更し、セルに preset の数値（未計測は「未計測」/「—」）
- **Detail 展開パネル**: Card と同じバー表示
- **Sort**: Int / Cod / Mat / Spd / TTFT（fast first）— preset 値でソート

### 3. 変更ファイル

- `static/js/catalog.js` — preset ベンチマーク共通処理・deploy 時の表示分岐
- `deploy_model_select.html` — `CATALOG_USE_PRESET_BENCHMARKS` フラグ、`benchmarks` の preset マッピング

## 先方への一言説明（例）

> モデル選択画面では、サンプルの CATALOG_DATA ではなく、お渡しいただいた preset.json の性能項目（Int / Cod / Mat / Spd / TTFT）だけをベンチマークとして表示するよう揃えました。Card view のグラフと Detail view の一覧列は同じ指標・同じ数値源です。
