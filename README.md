# React Chess App

React + TypeScript で作ったチェスアプリです。
駒のドラッグ&ドロップは **Pointer Events** に対応しており、タッチデバイスやマウスでも安定して動作します。

## 特徴

- Reactの宣言的UIに沿って、駒やハイライトの表示を state から直接決定しています。
- 駒を掴んだ位置のままドラッグ可能。
- 駒の移動可能マスハイライト
- Mouse / Touch を統一して扱え、Safari やタッチデバイスでも安定。
- 型安全な設計で、駒や盤面の管理も簡単。

## 技術スタック

- Next.js 16 (App Router)
- React 19
- TypeScript
- SCSS モジュール

## インストール & 開発

```bash
# 依存関係をインストール
npm install
# または
yarn
# または
pnpm install

# 開発サーバーを起動
npm run dev
# または
yarn dev
# または
pnpm dev
```

ブラウザで[http://localhost:3000](http://localhost:3000)を開くとチェス盤が表示されます。

## ディレクトリ構成
```
src
├── app
│   ├── chess
│   │   └── page.tsx
│   ├── globals.scss
│   ├── layout.tsx
│   ├── page.module.scss
│   └── page.tsx
├── assets
├── components
│   ├── chess
│   │   ├── Chessboard # 盤面コンポーネント
│   │   │   ├── Chessboard.module.scss
│   │   │   └── Chessboard.tsx
│   │   ├── Piece # 駒コンポーネント
│   │   │   ├── Piece.module.scss
│   │   │   └── Piece.tsx
│   │   └── Square # マスコンポーネント
│   │       ├── Square.module.scss
│   │       └── Square.tsx
│   └── ui
├── domain
│   └── chess
│       ├── board
│       │   ├── cloneBoard.ts
│       │   ├── createBoard.ts
│       │   └── movePiece.ts
│       ├── constants.ts　# 盤面設定や初期配置
│       ├── rules
│       │   ├── bishop.ts
│       │   ├── general.ts
│       │   ├── index.ts
│       │   ├── king.ts
│       │   ├── knight.ts
│       │   ├── pawn.ts
│       │   ├── queen.ts
│       │   └── rook.ts
│       ├── types.ts　# PieceType / TeamType 等
│       └── utils.ts
├── features # 状態管理
│   └── chess
│       ├── actions.ts
│       ├── reducer.ts
│       ├── selectors.ts
│       ├── state.ts
│       └── types.ts
├── hooks
│   └── useDragAndDrop.ts　# ドラッグ＆ドロップのロジック
└── styles
    ├── README.md
    ├── _mixins.scss
    ├── _utilities.scss
    ├── _variables.scss
    └── index.scss
```

## 使い方
- 駒をクリックまたはタッチで掴む
- ドラッグして合法手にドロップ
- 移動可能マスは自動でハイライト

## 注意点
- Pointer Capture の扱い
  - ドラッグ中にブラウザを離れた場合の挙動には注意。現在は onPointerUp で releasePointerCapture を呼んでいるため、通常は問題なし。
- Safari 対応
  - Pointer Events はサポートされているが、touch-action: none; の設定を CSS に追加するとドラッグがスムーズになります。

## ライセンス

MIT