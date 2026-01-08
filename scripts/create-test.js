#!/usr/bin/env node
/**
 * 自動テスト生成スクリプト
 * 使用例: npm run make:test src/components/chess/Chessboard/Chessboard.tsx
 */

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Usage: npm run make:test <FilePath>");
  process.exit(1);
}

const filePath = args[0]; // 例: src/components/chess/Chessboard/Chessboard.tsx
const fileName = path.basename(filePath, path.extname(filePath));
const dirName = path.dirname(filePath);
const ext = path.extname(filePath);

// 作成する __tests__ ディレクトリ
const testDir = path.join(dirName, "__tests__");
if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

// 作成するテストファイルパス
const testFile = path.join(testDir, `${fileName}.test${ext}`);
if (fs.existsSync(testFile)) {
  console.error("Test file already exists:", testFile);
  process.exit(1);
}

/**
 * テストテンプレート選択ロジック
 */
function getTemplate() {
  const relativeImport = `../${fileName}`;

  // ページ (src/app/以下)
  if (filePath.includes("/app/") && ext === ".tsx") {
    return `import { render, screen } from "@testing-library/react";
import ${fileName} from "${relativeImport}";

describe("Page: ${fileName}", () => {
  it("renders without crashing", () => {
    render(<${fileName} />);
    // TODO: ページ内の要素を確認
    // expect(screen.getByText(/./)).toBeInTheDocument();
  });
});
`;
  }

  // コンポーネント (src/components/以下)
  if (filePath.includes("/components/") && (ext === ".tsx" || ext === ".ts")) {
    return `import { render, screen } from "@testing-library/react";
import ${fileName} from "${relativeImport}";

describe("Component: ${fileName}", () => {
  it("renders without crashing", () => {
    render(<${fileName} />);
    // TODO: コンポーネント内の要素を確認
    // expect(screen.getByText(/./)).toBeInTheDocument();
  });
});
`;
  }

  // セレクタ・ユーティリティ・ドメイン
  if (
    filePath.includes("/utils/") ||
    filePath.includes("/selectors/") ||
    filePath.includes("/domain/") ||
    filePath.includes("/features/")
  ) {
    return `describe("${fileName} Utility", () => {
  it("placeholder test", () => {
    expect(true).toBe(true);
  });

  // TODO: ここに関数の具体的なユニットテストを書く
});
`;
  }

  // フック (src/hooks/以下)
  if (filePath.includes("/hooks/")) {
    return `import { renderHook } from "@testing-library/react";

describe("${fileName} Hook", () => {
  it("placeholder test", () => {
    expect(true).toBe(true);
  });

  // TODO: ここにフックの具体的なユニットテストを書く
});
`;
  }

  // デフォルト fallback
  return `describe("${fileName}", () => {
  it("placeholder test", () => {
    expect(true).toBe(true);
  });
});
`;
}

// ファイル生成
fs.writeFileSync(testFile, getTemplate(), "utf8");
console.log("Created test file:", testFile);

// ==============================
// __tests__/index.ts 自動更新
// ==============================
const indexFile = path.join(testDir, "index.ts");

// 現在の __tests__ 内の .test.ts/.test.tsx を取得
const testFiles = fs
  .readdirSync(testDir)
  .filter(f => f.endsWith(".test.ts") || f.endsWith(".test.tsx"))
  .map(f => `./${f.replace(/\.(ts|tsx)$/, "")}`);

// index.ts の内容生成
const indexContent = testFiles.map(f => `import "${f}";`).join("\n") + "\n";
fs.writeFileSync(indexFile, indexContent, "utf8");
console.log("Updated test index:", indexFile);