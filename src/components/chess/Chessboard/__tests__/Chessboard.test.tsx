import { render, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Chessboard from "../Chessboard";
import { PieceType, TeamType } from "@/domain/chess/types";
import { createBoard } from "@/domain/chess/board/createBoard";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import { SquareView } from "@/features/chess/viewModels/types";

/* =========================
  mocks
========================= */
// SVG mock
vi.mock("@/components/chess/PiecesSvg", () => ({
  PieceSvgMap: {
    pawn: ({ team }: any) => <svg />,
    rook: ({ team }: any) => <svg />,
    knight: ({ team }: any) => <svg />,
    bishop: ({ team }: any) => <svg />,
    queen: ({ team }: any) => <svg />,
    king: ({ team }: any) => <svg />,
  },
}));

// Chessboard CSS module mock
vi.mock("../Chessboard/Chessboard.module.scss", () => ({
  chessboard__draggingPiece: "chessboard__draggingPiece",
  chessboard: "chessboard",
  chessboard__wrapper: "chessboard__wrapper",
}));

// Square mock
vi.mock("@/components/chess/Square/Square", () => ({
  default: ({ piece, highlight, isChecked, onPointerDown }: any) => (
    <div
      className={[
        "tile",
        highlight ? "tile__highlight" : "",
        isChecked ? "tile__checked" : "",
      ].join(" ")}
      onPointerDown={(e) => piece && onPointerDown(e, piece)}
    >
      {piece && <div className="tile__image" />}
    </div>
  ),
}));

// PromotionModal mock
vi.mock("@/components/chess/PromotionModal/PromotionModal", () => ({
  default: () => <div className="promotion__overlay" />,
}));

// useDragAndDrop mock
vi.mock("@/hooks/useDragAndDrop", () => ({
  default: vi.fn(() => ({
    chessboardRef: { current: null },
    dragState: null,
    onPointerDown: vi.fn(),
    onPointerMove: vi.fn(),
    onPointerUp: vi.fn(),
  })),
}));

/* =========================
  test data
========================= */
const mockOnMovePiece = vi.fn();
const mockOnPromote = vi.fn();
const mockOnDragStart = vi.fn();
const mockOnDragEnd = vi.fn();

const mockPiece: SquareView = {
  id: "0-1",
  position: { x: 0, y: 1 },
  piece: {
    id: "p1",
    position: { x: 0, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.OUR,
    hasMoved: false,
    possibleMoves: [],
  },
  highlight: true,
  isChecked: false,
};

/* =========================
  tests
========================= */
describe("Component: Chessboard", () => {

  it("renders the chessboard grid: チェスボードのグリッドをレンダーする", () => {
    const emptySquares = Array.from({ length: 8 }, (_, y) =>
      Array.from({ length: 8 }, (_, x) => ({
        id: `${x}-${y}`,
        position: { x, y },
        piece: undefined,
        highlight: false,
        isChecked: false
      }))
    ).flat();

    render(
      <Chessboard
        squares={emptySquares}
        draggingPieceId={null}
        onMovePiece={mockOnMovePiece}
        onPromote={mockOnPromote}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    expect(document.querySelectorAll(".tile")).toHaveLength(64);
  });

  it("renders a piece on the board: ボード上に駒をレンダーする", () => {
    render(
      <Chessboard
        squares={[mockPiece]}
        draggingPieceId={null}
        onMovePiece={mockOnMovePiece}
        onPromote={mockOnPromote}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    expect(document.querySelector(".tile__image")).toBeInTheDocument();
  });

  it("highlights possible move squares: 可能な移動先をハイライトする", () => {
    render(
      <Chessboard
        squares={[mockPiece]}
        draggingPieceId={null}
        onMovePiece={mockOnMovePiece}
        onPromote={mockOnPromote}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    expect(document.querySelectorAll(".tile__highlight").length).toBeGreaterThan(0);
  });

  it("shows checked squares: チェック状態の駒を表示する", () => {
    const checkedSquare = {
      ...mockPiece,
      isChecked: true, // ←ここでチェック状態にする
    };

    render(
      <Chessboard
        squares={[checkedSquare]}
        draggingPieceId={null}
        onMovePiece={mockOnMovePiece}
        onPromote={mockOnPromote}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    expect(document.querySelector(".tile__checked")).toBeInTheDocument();
  });

  it("calls onDragStart when a piece is pointer-down: ドラッグ開始時にonDragStartを呼び出す", () => {
    render(
      <Chessboard
        squares={[mockPiece]}
        draggingPieceId={null}
        onMovePiece={mockOnMovePiece}
        onPromote={mockOnPromote}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    fireEvent.pointerDown(document.querySelector(".tile__image")!);

    expect(mockOnDragStart).toHaveBeenCalledWith(mockPiece.piece);
  });

  it("prevents drag interaction during promotion: プロモーション中はドラッグ操作できない", () => {
    const useDragAndDropMock = vi.mocked(useDragAndDrop);
    const onPointerDown = vi.fn();
    vi.mocked(useDragAndDrop).mockReturnValue({
      chessboardRef: { current: null },
      dragState: null,
      onPointerDown,
      onPointerMove: vi.fn(),
      onPointerUp: vi.fn(),
    });

    render(
      <Chessboard
        squares={[mockPiece]}
        draggingPieceId={null}
        promotion={{ position: { x: 0, y: 7 }, team: TeamType.OUR }}
        onMovePiece={mockOnMovePiece}
        onPromote={mockOnPromote}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    fireEvent.pointerDown(document.querySelector(".tile__image")!);
    expect(onPointerDown).not.toHaveBeenCalled();
  });

  it("renders promotion modal when promotion is active: プロモーションモーダルを表示する", () => {
    render(
      <Chessboard
        squares={[mockPiece]}
        draggingPieceId={null}
        promotion={{ position: { x: 0, y: 7 }, team: TeamType.OUR }}
        onMovePiece={mockOnMovePiece}
        onPromote={mockOnPromote}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    expect(document.querySelector(".promotion__overlay")).toBeInTheDocument();
  });

  // it("renders dragging piece overlay when dragState has a piece: ドラッグ中の駒を表示する", () => {
  //   const dragState = {
  //     piece: mockPiece.piece!,
  //     offsetX: 0,
  //     offsetY: 0,
  //     clientX: 50,
  //     clientY: 50,
  //   };
  //   vi.mocked(useDragAndDrop).mockReturnValue({
  //     chessboardRef: { current: null },
  //     dragState,
  //     onPointerDown: vi.fn(),
  //     onPointerMove: vi.fn(),
  //     onPointerUp: vi.fn(),
  //   });

  //   const { container } = render(
  //     <Chessboard
  //       squares={[mockPiece]}
  //       draggingPieceId={mockPiece.piece!.id}
  //       onMovePiece={mockOnMovePiece}
  //       onPromote={mockOnPromote}
  //       onDragStart={mockOnDragStart}
  //       onDragEnd={mockOnDragEnd}
  //     />
  //   );

  //   expect(
  //     container.querySelector(".chessboard__draggingPiece")
  //   ).toBeInTheDocument();
  // });

  it("renders a complete initial chess board (32 pieces): 完全な初期状態のチェス盤を表示する", () => {
    const initialBoard = Array.from({ length: 8 }, (_, y) =>
      Array.from({ length: 8 }, (_, x) => {
        const piece = createBoard().find(p => p.position.x === x && p.position.y === y);
        return {
          id: `${x}-${y}`,
          position: { x, y },
          piece: piece || undefined,
          highlight: false,
          isChecked: false,
        };
      })
    ).flat();
    render(
      <Chessboard
        squares={initialBoard}
        draggingPieceId={null}
        onMovePiece={mockOnMovePiece}
        onPromote={mockOnPromote}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    expect(document.querySelectorAll(".tile")).toHaveLength(64);
    expect(document.querySelectorAll(".tile__image")).toHaveLength(32);
  });
});