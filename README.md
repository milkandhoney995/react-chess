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

## アーキテクチャ

このプロジェクトでは、**ドメイン駆動設計 (DDD)** の考え方を基にしたアーキテクチャを採用しています。

### ドメイン駆動設計のアプローチ

- **Domain層**: チェスのルールや概念を純粋なビジネスロジックとして実装
  - `domain/chess/` にチェスのルール、型定義、定数を集約
  - UIやフレームワークに依存しない純粋なロジック
  - 型安全性を重視した設計

- **Features層**: アプリケーションのユースケースと状態管理
  - `features/chess/game` にゲームの状態管理を集約
  - Actions、Reducers、Selectorsのパターンで状態を管理
  - ドメイン層のロジックをUIで利用しやすい形に変換

- **Components層**: ReactコンポーネントによるUI実装
  - `components/chess/` にチェス関連のUIコンポーネント
  - 状態管理層からpropsでデータを渡す単方向データフロー

### 状態管理

Reduxなどのグローバル状態管理ライブラリは使用せず、**ReactのuseReducer** を活用したローカル状態管理を採用しています。

- **ゲーム状態**: `useReducer` でチェスの盤面状態、ターン、プロモーションなどを管理
- **UI状態**: ドラッグ中の駒IDなどのUI専用状態をコンポーネントのローカルstateで管理
- **Selectors**: 計算済みの値をメモ化してパフォーマンスを最適化

このアプローチにより、以下のような利点があります：
- **シンプルさ**: グローバル状態の複雑さを避け、ローカルで完結
- **テスト容易性**: Reducerは純粋関数なので単体テストが容易
- **型安全性**: TypeScriptでActionとStateの型を厳密に定義
- **保守性**: 状態の変更経路が明確でデバッグしやすい

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

## テスト

このプロジェクトでは、Vitest と React Testing Library を使用して包括的なテストスイートを実装しています。

### テストの実行

```bash
# 全テストを実行
npm run test
# または
yarn test
# または
pnpm test

# テストをウォッチモードで実行
npm run test:watch
# または
yarn test:watch
# または
pnpm test:watch
```

### テスト内容

- **コンポーネントテスト**: Reactコンポーネントのレンダリング、ユーザーインタラクション、状態変化をテスト
  - Chessboard: 盤面の描画、駒の配置、ドラッグ操作、ハイライト表示
  - Square: マスの描画、駒の表示、ハイライトとチェック状態
  - GameStatus: ゲーム状態の表示（チェック、勝敗）
  - PromotionModal: ポーンプロモーションのモーダル表示と操作
  - Page: 全体のページ統合テスト

- **ドメインロジックテスト**: チェスのルールと盤面操作のロジックをテスト
  - 駒の移動ルール（ポーン、ナイト、ビショップ、ルーク、クイーン、キング）
  - チェックとチェックメイトの判定
  - 盤面の操作（駒の移動、キャプチャ、アンパッサン）

- **状態管理テスト**: reducerとselectorのテスト
  - ゲーム状態の更新
  - 駒の移動とプロモーション
  - ターンの管理

- **フックテスト**: カスタムフックのテスト
  - useDragAndDrop: ドラッグ＆ドロップ操作のロジック

### テストカバレッジ

現在、154個のテストケースがあり、主要な機能とエッジケースをカバーしています。

## 使い方
- 駒をクリックまたはタッチで掴む
- ドラッグして合法手にドロップ
- 移動可能マスは自動でハイライト

## 注意点
- Pointer Capture の扱い
  - ドラッグ中にブラウザを離れた場合の挙動には注意。現在は onPointerUp で releasePointerCapture を呼んでいるため、通常は問題なし。
- Safari 対応
  - Pointer Events はサポートされているが、touch-action: none; の設定を CSS に追加するとドラッグがスムーズになります。

## ディレクトリ構成

- `app`配下はサーバーサイドコンポーネント
- `components/chess/ChessGame.tsx`がクライアントエントリーポイント
- `features/**`および`hooks/**`はクライアントオンリー
- `domain/**`は純関数

```
.
├── next-env.d.ts
├── next.config.js
├── package.json
├── README.md
├── tsconfig.json
├── vitest.config.mts
├── vitest.setup.ts
├── public/
├── scripts/
│   └── create-test.js
└── src/
    ├── app/ # app配下はサーバーサイドコンポーネント
    │   ├── chess/
    │   │   ├── __tests__/
    │   │   │   ├── index.ts
    │   │   │   └── page.test.tsx
    │   │   └── page.tsx
    │   ├── globals.scss
    │   ├── layout.tsx
    │   ├── page.module.scss
    │   └── page.tsx
    ├── assets/
    ├── components/
    │   ├── chess/
    │   │   ├── ChessGame.tsx # クライアントエントリーポイント
    │   │   ├── Chessboard/ # 盤面コンポーネント
    │   │   │   ├── Chessboard.module.scss
    │   │   │   ├── Chessboard.tsx
    │   │   │   └── __tests__/
    │   │   │       ├── Chessboard.test.tsx
    │   │   │       └── index.ts
    │   │   ├── GameStatus/
    │   │   │   ├── GameStatus.module.scss
    │   │   │   ├── GameStatus.tsx
    │   │   │   └── __tests__/
    │   │   │       ├── GameStatus.test.tsx
    │   │   │       └── index.ts
    │   │   ├── PiecesSvg/ # 駒SVGコンポーネント
    │   │   │   ├── Bishop.tsx
    │   │   │   ├── index.ts
    │   │   │   ├── King.tsx
    │   │   │   ├── Knight.tsx
    │   │   │   ├── Pawn.tsx
    │   │   │   ├── Queen.tsx
    │   │   │   └── Rook.tsx
    │   │   ├── PromotionModal/ # モーダルコンポーネント
    │   │   │   ├── PromotionModal.module.scss
    │   │   │   ├── PromotionModal.tsx
    │   │   │   └── __tests__/
    │   │   │       ├── index.ts
    │   │   │       └── PromotionModal.test.tsx
    │   │   └── Square/ # マスコンポーネント
    │   │       ├── Square.module.scss
    │   │       ├── Square.tsx
    │   │       └── __tests__/
    │   │           ├── index.ts
    │   │           └── Square.test.tsx
    │   └── ui/
    ├── domain/ # 純関数
    │   └── chess/
    │       ├── __tests__/
    │       │   ├── index.ts
    │       │   └── utils.test.ts
    │       ├── board/
    │       │   ├── applyMove.ts # 盤面シミュレーター(駒を動かす・取る、en passant / castling)
    │       │   ├── cloneBoard.ts
    │       │   ├── createBoard.ts
    │       │   ├── movePiece.ts # 合法手判定
    │       │   └── __tests__/
    │       │       ├── applyMove.test.ts
    │       │       ├── cloneBoard.test.ts
    │       │       ├── createBoard.test.ts
    │       │       ├── index.ts
    │       │       └── movePiece.test.ts
    │       ├── constants.ts # 盤面設定や初期配置
    │       ├── rules/
    │       │   ├── bishop.ts
    │       │   ├── check.ts
    │       │   ├── general.ts
    │       │   ├── index.ts
    │       │   ├── king.ts
    │       │   ├── knight.ts
    │       │   ├── pawn.ts
    │       │   ├── queen.ts
    │       │   ├── rook.ts
    │       │   ├── slidingMoves.ts
    │       │   └── __tests__/
    │       │       ├── bishop.test.ts
    │       │       ├── check.test.ts
    │       │       ├── general.test.ts
    │       │       ├── index.ts
    │       │       ├── king.test.ts
    │       │       ├── knight.test.ts
    │       │       ├── pawn.test.ts
    │       │       ├── queen.test.ts
    │       │       ├── rook.test.ts
    │       │       └── slidingMoves.test.ts
    │       ├── types.ts # PieceType / TeamType 等
    │       └── utils.ts
    ├── features/ # 状態管理。クライアントオンリー
    │   └── chess/
    │       ├── game # ゲーム状態
    │       │   ├── __tests__/
    │       │   │   ├── actions.test.ts
    │       │   │   ├── index.ts
    │       │   │   ├── reducer.test.ts
    │       │   │   ├── selectors.test.ts
    │       │   │   └── state.test.ts
    │       │   ├── actions.ts
    │       │   ├── reducer.ts
    │       │   ├── selectors.ts
    │       │   ├── state.ts
    │       │   ├── types.ts
    │       └── view/ # UI専用
    │           ├── __tests__/
    │           │   ├── actions.test.ts
    │           │   └── reducer.test.ts
    │           ├── actions.ts
    │           └── reducer.ts
    ├── hooks/ # クライアントオンリー
    │   ├── __tests__/
    │   │   ├── index.ts
    │   │   └── useDragAndDrop.test.ts
    │   └── useDragAndDrop.ts # ドラッグ＆ドロップのロジック
    ├── utils/
    │   ├── ui/
    │   │   └── index.ts
    └── styles/
        ├── README.md
        ├── chess/ # ♟ Chess ドメイン専用
        │   ├── _board.scss
        │   ├── _tile.scss
        │   ├── _variables.scss
        │   └── index.scss
        ├── foundation/ # 設計の土台（変更頻度 低）
        │   ├── _breakpoints.scss
        │   ├── _reset.scss
        │   ├── _typography.scss
        │   ├── _variables.scss
        │   └── index.scss
        ├── mixins/ # 再利用ロジック
        │   ├── _flex.scss
        │   ├── _grid.scss
        │   ├── _interaction.scss
        │   ├── _position.scss
        │   ├── _responsive.scss
        │   └── index.scss
        └── index.scss # グローバルエントリ（layout.tsx から import）
```

## ライセンス

MIT