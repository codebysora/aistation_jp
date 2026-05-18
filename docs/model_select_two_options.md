# Model Select 改修 — 2 案併走 (MTG 提出用)

> **対象画面**: `deploy_model_select.html` / `model_catalog.html`
> **作成日**: 2026-04-30
> **目的**: 先方共有の preset.json + jinja2 サンプル (`model_select.html`) を取り込み、UI 案を 2 通り制作。MTG にて採用案を決定する。

---

## 1. 背景

| 経緯 | 内容 |
|---|---|
| 4/23 | 初回フィードバック対応（出力モダリティタブ・publisher region・engine 削除など）。`docs/model_select_feedback_response.md` 参照。 |
| 4/27〜28 | 「modality 表示の見せ方」案 A〜D を `_modality_mock.html` で並走検討 → **案 D（IN→OUT アイコン inline）** 採択。 |
| 〃 | 「usecase は撤去、数値的な比較情報を可視化したい」との方針共有。 |
| 4/30 朝 | 先方からサンプル一式（`preset.json` + jinja2 テンプレ + 画像）を共有。スコアの円ドット表示・perf メトリクス（Speed / TTFT）・全 18 種ベンチマーク列など、データ・UI の方針が具体化。 |
| 4/30 (本日) | サンプルを取り込み、**こちらの方向性 (案A) と先方サンプル準拠 (案B) を 2 案で制作**。 |

---

## 2. 共通の前提（両案で揃えた点）

- **データソース**: `sample_data/preset.json`（先方共有データそのまま）
- **正規化**: `mocks/_preset_data.js` で jinja の `preset_list` 形式へフラット化（両案が同一データを描画）
- **掲載モデル**: qwen3-0.6b-cpu / qwen3-0.6b-gpu-long / qwen3.5-0.8b / gemma4-e2b-it / gemma3n-e2b-it（5 件）
- **出力モダリティタブ**: Text / Embedding（先方仕様に合わせ「Embedding」単数形に統一）
- **フィルタ列**: Context / Input modality / Publisher / License（先方サンプルのフィルタ構造に追従）
- **CPU/GPU バッジ**: カード右上に表示（両案共通）
- **Use-case タグの撤去**: 両案ともカードから削除（数値比較を主軸にする方針に従う）

---

## 3. 案A — こちら案（既存方向性の継続）

### 3-1. 設計コンセプト
> 「**連続値の数値比較**を主軸に、Plan D の IN→OUT modality を維持する」

### 3-2. 主要要素
| 要素 | 仕様 |
|---|---|
| カード基調 | 既存 `catalog-card`（白背景、軽量シャドウ） |
| Modality 表示 | `IN: T I → OUT: T` の **アイコン横並び**（Plan D） |
| 主スコア | **横バー** Int / Cod / Math (0–20 スケール、色は値帯で段階表示) |
| ハイライト | カード上部に `TOP: <最高指標> <値>/20` ピル（Primary 色） |
| Perf 指標 | 下段に `Spd: 49 tok/s` / `TTFT: 0.46s` を補助情報として小さめに |
| Capabilities | `tool_use` / `reasoning` をニュートラルタグで表示 |
| Context | meta 行に `131K ctx` のニュートラルピル |

### 3-3. 強み / 弱み
- ✅ 既存 UI（catalog-card / Plan D / benchmark bar）と地続きで導入コストが低い
- ✅ 連続値の差が **バー長で直感的**に伝わる（5.7 と 10.5 の差が視覚で分かる）
- ✅ IN/OUT の区別が明確 → Qwen3-omni のような multi-input/multi-output で崩れない
- ⚠️ 横バー + Perf 別段で **縦に長くなりがち**
- ⚠️ Spd / TTFT が主スコアと別レイアウトで、同列比較しにくい

### 3-4. 詳細ページ（`_model_detail_a.html`）
案A は一覧カードクリックで **詳細ページ** へ遷移する 2 階層構成を採用。

| ブロック | 内容 |
|---|---|
| Header | モデル名 / developer / model_source / release date / CPU/GPU バッジ / license |
| Hero metrics | TOP indicator + Int / Cod / Math / Speed / TTFT / Context のサマリカード |
| Modality | Plan D の拡大版 (IN → OUT アイコン + 言語ラベル) |
| Primary benchmarks | Int / Cod / Math の **横バー（拡大）** + 0–20 スケール表記 |
| Detailed benchmarks | **18 列の詳細ベンチマーク**（mmlu_pro / gpqa / hle / livecodebench / scicode / math_500 / aime / aime_25 / ifbench / lcr / terminalbench_hard / tau2）を 0–100% のミニバー付きで一覧 |
| Performance | Speed / TTFT / TTA を反転バー（小さいほど良い指標は反転）で可視化 |
| Specifications | inference_backend / engine_version / required_resources / max input/output tokens / license / release date / capabilities |
| Parameters | raw parameters / engine config を `<details>` で折り畳み JSON 表示 |
| CTA | 「このモデルでデプロイする →」 → `deploy_model_form.html?model=<id>` |
| Attribution | Primary / Detailed / Performance 各セクション右上に Source: Artificial Analysis ↗ + フッターにも掲示 |

**設計意図:**
- 一覧カードでは **3-5 指標に絞り、密度を上げる**
- カードクリックで詳細ページへ。**18 列の高度ベンチマーク・Spec・Parameters は詳細側に集約**
- Detail view（一覧の代替表示としてのソート可能テーブル）は §9 の本実装 TODO で別途検討（採用案決定後）


---

## 4. 案B — 先方案（共有サンプル準拠）

### 4-1. 設計コンセプト
> 「**5 段階の円ドット**で全指標を同列に並べ、密度高く一覧する」

### 4-2. 主要要素
| 要素 | 仕様 |
|---|---|
| カード基調 | 既存 `c-model-card`（ダーク背景、白文字） |
| Modality 表示 | **フラットな input modality タグ列**（output はタブで切替） |
| 主スコア | **5-dot 円**（塗り＝`floor(value/max*5)`）。max=20 を基準、TTFT は反転（小さいほど良い） |
| 2 カラム構成 | 左: Int / Cod / Mat ｜ 右（border 区切り）: Spd / TTFT |
| 色分け | Int=info / Cod=warning / Mat=success / Spd=primary / TTFT=danger |
| Capabilities | `tool use` のみタグ表示（reasoning は表示なし） |
| Context | カード最下行に `context 4,096 tokens` の薄字 |

### 4-3. 強み / 弱み
- ✅ 円の **塗り数が一目で揃う**ためカード間の比較が極めて速い
- ✅ Spd / TTFT を主指標と同じ視覚言語で表現 → **6 指標を同列に把握**できる
- ✅ 情報密度が高く、画面に多くのモデルを並べられる
- ⚠️ 5 段階離散のため **僅差が消える**（5.7 と 7.0 が同じ塗り数になり得る）
- ⚠️ output modality が UI 上に見えない（タブ依存）→ Stable Diffusion 系（T → I）が一目で分からない
- ⚠️ 既存 UI の他カード（catalog-card）と見た目が乖離 → 整合性のため他画面も追従修正が必要

---

## 5. 軸別比較表

| 軸 | 案A (こちら) | 案B (先方) |
|---|---|---|
| カード背景 | 白 (catalog-card) | ダーク (c-model-card) |
| Modality 表示 | IN→OUT アイコン 1 行（Plan D） | フラット modality タグ列 |
| スコア可視化 | 横バー（連続値） | 5-dot 円（5 段階離散） |
| 情報密度 | 中 | 高（Int/Cod/Mat と Spd/TTFT 同段） |
| スコア精度 | ○ 連続値が直観的 | △ 5 段階に丸まる |
| 並列比較しやすさ | ○ バー長で揃う | ◎ 円の塗り数が揃う |
| multi I/O 表現 | ◎ IN/OUT が分離 | △ output はタブ依存 |
| 既存 UI との整合 | ◎ そのまま接続可 | △ 他画面の見直しが必要 |
| 実装コスト | 低（差分小） | 中（カード基調が変わる） |

---

## 6. 共有 URL（Vercel 本番）

> Basic Auth: `preview` / `aistation2026`

| 用途 | URL |
|---|---|
| **比較インデックス（先方に最初に共有）** | https://aistation-db-ui02.vercel.app/mocks/_model_select_compare.html |
| 案A 一覧 | https://aistation-db-ui02.vercel.app/mocks/_model_select_a.html |
| **案A 詳細ページ** | https://aistation-db-ui02.vercel.app/mocks/_model_detail_a.html （?id=<model_id> でモデル切替） |
| 案B モック | https://aistation-db-ui02.vercel.app/mocks/_model_select_b.html |
| （参考）モダリティ案 A〜D 比較 | https://aistation-db-ui02.vercel.app/_modality_mock.html |

---

## 7. ファイル一覧（成果物）

| パス | 内容 |
|---|---|
| `sample_data/preset.json` | 先方共有データ（コピー） |
| `mocks/_preset_data.js` | preset.json を JS 埋め込み + フラット形式へ正規化 |
| `mocks/_model_select_a.html` | 案A 一覧モック（こちら案） |
| `mocks/_model_detail_a.html` | **案A 詳細ページモック** — 一覧カードから遷移、`?id=<model_id>` でモデル切替 |
| `mocks/_model_select_b.html` | 案B のモック（先方準拠） |
| `mocks/_model_select_compare.html` | 案A / 案B 比較インデックスページ |
| `docs/model_select_two_options.md` | 本ドキュメント（MTG 提出用） |

### 案A の本実装側 (Plan D + metrics 行) は据え置き
4/30 朝に `static/js/catalog.js` / `static/css/style.css` に既に取り込み済み（`renderModalityGroup`, `renderMetricsRow` 等）。サンプル受領前の実装で、**MTG で採用案が決まったタイミングで本実装へ統合する**前提です。

---

## 8. MTG での確認事項（叩き台）

1. **採用案の決定** — 案A / 案B / ハイブリッド（例: 案A の構造 + 案B の 5-dot ドット）
2. **モダリティ表現** — IN/OUT を分けたい (案A) か、output はタブ + input のみ表示 (案B) か
3. **5-dot vs 連続バー** — 5 段階で僅差が消える点を許容するか
4. **追加メトリクス** — mmlu_pro など 18 列の高度ベンチマークは Detail view 専用で良いか（カードには 3-5 指標で十分か）
5. **本実装スケジュール** — 採用後、`deploy_model_select.html` / `model_catalog.html` への取り込みタイミング

---

## 9. 採用後の本実装 TODO（先取り）

採用案が決まり次第、以下を実施:

- [ ] `static/js/catalog.js` の `CATALOG_DATA` を `preset.json` 形式に置換 or 共存
- [ ] `renderCardView` を採用案のレイアウトに統一
- [ ] フィルタ UI を `Context / Input modality / Publisher / License` の chip 構造に再構成
- [ ] 出力モダリティタブを `Text / Embedding`（単数）に修正
- [ ] Detail view（列の表示切替 + ソート可能テーブル）を実装（先方サンプルから移植）
- [ ] 案B 採用時は `c-model-card` を catalog 用にも展開、案A 採用時は既存 `catalog-card` を維持
- [ ] 既存の Plan D + metrics 実装（4/30 朝に入れた分）を採用案に合わせて整理

---

## 10. 出典明記（Artificial Analysis）

### 10-1. 背景・要件
カード上の数値（Int / Cod / Math / Spd / TTFT、および将来追加予定の 18 種ベンチマーク列）は **Artificial Analysis API** に由来するため、同社の利用規約に従い出典明記が必須。

| 項目 | 規約 |
|---|---|
| 文言 | "Attribution is required for all use of our free API"（exact wording 指定なし） |
| リンク先 URL | `https://artificialanalysis.ai/` |
| ロゴ使用 | 任意（公式ブランドキット提供） |
| 表示位置・サイズ | 制約なし |
| 出典 | https://artificialanalysis.ai/api-reference#attribution |

### 10-2. 検討した 5 パターン

| # | 案 | 概要 | 強み | 弱み |
|---|---|---|---|---|
| ① | フッター 1 行 | 画面最下部にテキストリンク | 邪魔にならず最低コスト／規約遵守として十分 | スクロールで隠れる／数値との結び付きが弱い |
| ② | メトリクス見出しに併記 | カード一覧の上部に凡例として 1 行 | 数値の起源が直近で見える／カードごとに繰り返さず簡潔 | 多少 UI 占有 |
| ③ | 各カードに ⓘ tooltip | 各メトリクス末尾に hover アイコン | データ単位で出典明確 | モバイル弱／全カードで重複表示 |
| ④ | フィルタ直下バナー | フィルタ行とカード一覧の境界に告知バナー | 一覧 1 か所で日本語説明可 | 主張が強い／視覚的雑音 |
| ⑤ | ロゴ + テキスト badge | 公式ロゴを使用 | 第三者ベンチである権威性の訴求 | 商用画面でのロゴ使用は法務確認推奨 |

### 10-3. 採用案（モック実装済み） — **② + ① のハイブリッド**

| レイヤ | 配置 | 文言 |
|---|---|---|
| プライマリ (②) | 出力モダリティタブ直下、カード一覧の真上 | <i> ベンチマーク値（Int / Cod / Math / Spd / TTFT）の出典: Artificial Analysis ↗</i> |
| セカンダリ (①) | 画面フッター | "Performance data provided by Artificial Analysis ↗" |

**採用理由:**
- ② により、スコアのある画面領域に近接して出典が見える（認知負荷最小）
- ① により、スクロール下端でも遵守を担保 → Detail view にも継承しやすい
- カード内 ⓘ（③）は **モバイル/タブレットで hover が機能しにくい** ため不採用、ただし Detail view（18 列ベンチ）でテーブル上部に明示する形で補完予定

### 10-4. 確認用 URL（Vercel 本番、Basic Auth: preview / aistation2026）

| 用途 | URL |
|---|---|
| 比較インデックス | https://aistation-db-ui02.vercel.app/mocks/_model_select_compare.html |
| 案A（②+①ハイブリッド適用済） | https://aistation-db-ui02.vercel.app/mocks/_model_select_a.html |
| 案B（②+①ハイブリッド適用済） | https://aistation-db-ui02.vercel.app/mocks/_model_select_b.html |

### 10-5. MTG での確認事項

1. **採用パターン**: ② + ① ハイブリッドで OK か（推奨）／別パターン（③〜⑤）に変更するか
2. **ロゴ使用の可否**: テキストリンクのみ（現状）か、公式ブランドキットのロゴを併用するか — ロゴ使用は社内法務確認の必要性
3. **文言の言語**:
   - プライマリ（②）: 現状「ベンチマーク値の出典: Artificial Analysis」（日本語）
   - フッター（①）: 現状 "Performance data provided by Artificial Analysis"（英語）
   - 統一すべきか／現状の使い分けで OK か
4. **Detail view（18 列ベンチマーク）の出典表記**: テーブル見出し上に明示する想定で良いか

### 10-6. 採用後の本実装 TODO

- [ ] `deploy_model_select.html` / `model_catalog.html` 本実装側にも同パターンで attribution を追加
- [ ] Detail view 採用時はテーブル見出し上に出典明示
- [ ] ロゴ採用が決まれば `static/img/` に Artificial Analysis ロゴを配置（ブランドキット zip から抽出、サイズは横 80–120px 程度を想定）
- [ ] 共通コンポーネント化（footer は全画面で共有可能なので `_attribution_footer.html` 等の include パターンを検討）
