# Vercel プレビュー Basic 認証セットアップ

> **対象プロジェクト**: `aistation-db-ui02` (Vercel)
> **本番 URL**: https://aistation-db-ui02.vercel.app
> **設定日**: 2026-04-24

---

## 1. 概要

先方展開用に、Vercel にデプロイしているモック（`deploy_model_select.html`, `_modality_mock.html` 等）全体へ **Basic 認証** を適用しています。

Vercel の **Edge Middleware**（`middleware.js`）で全リクエストをインターセプトし、ユーザー名・パスワードは Vercel の環境変数から読み取ります。

---

## 2. 先方共有用の認証情報

```
URL      : https://aistation-db-ui02.vercel.app/
Username : preview
Password : aistation2026
```

主な共有 URL:

| ページ | URL |
|---|---|
| デプロイ対象モデル選択画面 | https://aistation-db-ui02.vercel.app/deploy_model_select.html |
| モダリティ表示モック | https://aistation-db-ui02.vercel.app/_modality_mock.html |
| モデルカタログ（ユーザー画面） | https://aistation-db-ui02.vercel.app/model_catalog.html |

静的アセット（CSS / JS / 画像）にも認証がかかっているため、CDN 経由でインデックスされる心配はありません。

---

## 3. 実装の内訳

### 3-1. `middleware.js`（プロジェクトルート）

```js
export const config = {
  matcher: ['/((?!_vercel|favicon\\.ico).*)'],
};

export default function middleware(request) {
  const USER = (typeof process !== 'undefined' && process.env.BASIC_AUTH_USER) || 'preview';
  const PASS = (typeof process !== 'undefined' && process.env.BASIC_AUTH_PASS) || 'changeme';
  // Authorization: Basic <base64> を検証し、一致すれば素通し、それ以外は 401
  // ...
}
```

- 401 返却時に `WWW-Authenticate: Basic realm="AIStation Preview"` を付与 → ブラウザのログインダイアログが起動
- env が未設定のときのフォールバック値は `preview` / `changeme`（ソース上は平文を置かない設計）

### 3-2. Vercel 環境変数 (Production)

| キー | 値 |
|---|---|
| `BASIC_AUTH_USER` | `preview` |
| `BASIC_AUTH_PASS` | `aistation2026` |

CLI 上で確認:

```bash
vercel env ls production
```

---

## 4. 運用コマンド

### 4-1. パスワードを変更する

```bash
cd /Users/imoto/Desktop/aistation-db-ui02
vercel env rm BASIC_AUTH_PASS production
printf '新しいパスワード' | vercel env add BASIC_AUTH_PASS production
vercel --prod --yes
```

ユーザー名も同様に `BASIC_AUTH_USER` を差し替え可能。

### 4-2. 認証を一時的に外す

```bash
# middleware を退避して再デプロイ
mv middleware.js middleware.js.disabled
vercel --prod --yes

# 戻すとき
mv middleware.js.disabled middleware.js
vercel --prod --yes
```

### 4-3. デプロイだけやり直す

コード変更をプッシュ:

```bash
vercel --prod --yes
```

### 4-4. デプロイログを見る

```bash
vercel inspect aistation-db-ui02.vercel.app --logs
```

---

## 5. 動作確認（curl）

```bash
# 無認証 → 401 期待
curl -sI https://aistation-db-ui02.vercel.app/deploy_model_select.html | head -5

# 正しい資格情報 → 200 期待
curl -sI -u preview:aistation2026 \
  https://aistation-db-ui02.vercel.app/deploy_model_select.html | head -5

# 誤った資格情報 → 401 期待
curl -sI -u preview:wrongpass \
  https://aistation-db-ui02.vercel.app/deploy_model_select.html | head -5
```

各ヘッダで期待通りの挙動を確認済み（2026-04-24 デプロイ時点）。

---

## 6. プロジェクト情報（参考）

| 項目 | 値 |
|---|---|
| Vercel Project ID | `prj_UMoRI9MZzH7D937sh3N8OdPlEt8k` |
| Vercel Org ID | `team_yM3iO9X1uoCO6AVMWfan5mPx` |
| Project 名 | `aistation-db-ui02` |
| Vercel CLI ログインユーザー | `imtkzk-8129` |
| ローカルパス | `/Users/imoto/Desktop/aistation-db-ui02` |

`.vercel/project.json` に上記の紐付けがコミットされており、`vercel` コマンドが同ディレクトリから実行されればプロジェクト選択は不要。

---

## 7. 注意事項

- **Basic 認証はあくまで簡易的な閲覧制限**。Base64 は暗号ではないため、通信経路は HTTPS 必須（Vercel は HTTPS デフォルト）。
- パスワードをメッセージ等で共有する際は、チャネルの可視範囲に注意。
- 長期的に共有が続く場合は、Vercel Pro の **Password Protection**（dashboard 設定の有料機能）への移行も検討可。
- `middleware.js` の書き換え・削除は即デプロイで反映されるため、作業中は誤って push しないよう注意。
