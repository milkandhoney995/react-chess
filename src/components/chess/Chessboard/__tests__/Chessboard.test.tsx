import { render, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Chessboard from "../Chessboard";
import { Piece, PieceType, Position, TeamType } from "@/domain/chess/types";
import { createBoard } from "@/domain/chess/board/createBoard";
import useDragAndDrop from "@/hooks/useDragAndDrop";

/* =========================
  mocks
========================= */
// SVG mock
vi.mock("@/components/chess/PiecesSvg", () => ({
  PieceSvgMap: {
    PAWN: ({ team }: any) => <svg />,
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

// Mock the useDragAndDrop hook
vi.mock("@/hooks/useDragAndDrop", () => {
  return {
    default: vi.fn(() => ({
      chessboardRef: { current: null },
      dragState: null,
      onPointerDown: vi.fn(),
      onPointerMove: vi.fn(),
      onPointerUp: vi.fn(),
    })),
  };
});

/* =========================
  test data
========================= */
const mockIsCheckedSquare = vi.fn<(position: Position) => boolean>(() => false);
const mockOnMovePiece = vi.fn();
const mockOnPromote = vi.fn();
const mockOnDragStart = vi.fn();
const mockOnDragEnd = vi.fn();

const mockPiece: Piece = {
  id: "test-piece",
  type: PieceType.PAWN,
  team: TeamType.OUR,
  position: { x: 0, y: 1 },
  hasMoved: false,
  possibleMoves: [],
};

describe("Component: Chessboard", () => {

  it("renders the chessboard grid: チェスボードのグリッドをレンダーする", () => {
    render(
      <Chessboard
        pieces={[]}
        possibleMoves={[]}
        draggingPieceId={null}
        isCheckedSquare={mockIsCheckedSquare}
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
        pieces={[mockPiece]}
        possibleMoves={[]}
        draggingPieceId={null}
        isCheckedSquare={mockIsCheckedSquare}
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
        pieces={[mockPiece]}
        possibleMoves={[
          { x: 0, y: 2 },
          { x: 0, y: 3 },
        ]}
        draggingPieceId={null}
        isCheckedSquare={mockIsCheckedSquare}
        onMovePiece={mockOnMovePiece}
        onPromote={mockOnPromote}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    expect(document.querySelectorAll(".tile__highlight").length).toBeGreaterThan(0);
  });

  it("shows checked squares: チェック状態の駒を表示する", () => {
    mockIsCheckedSquare.mockReturnValueOnce(true);

    render(
      <Chessboard
        pieces={[mockPiece]}
        possibleMoves={[]}
        draggingPieceId={null}
        isCheckedSquare={mockIsCheckedSquare}
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
        pieces={[mockPiece]}
        possibleMoves={[]}
        draggingPieceId={null}
        isCheckedSquare={mockIsCheckedSquare}
        onMovePiece={mockOnMovePiece}
        onPromote={mockOnPromote}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    fireEvent.pointerDown(document.querySelector(".tile__image")!);

    expect(mockOnDragStart).toHaveBeenCalledWith(mockPiece);
  });

  it("prevents drag interaction during promotion: プロモーション中はドラッグ操作できない", () => {
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
        pieces={[mockPiece]}
        possibleMoves={[]}
        draggingPieceId={null}
        promotion={{ position: { x: 0, y: 7 }, team: TeamType.OUR }}
        isCheckedSquare={mockIsCheckedSquare}
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
        pieces={[mockPiece]}
        possibleMoves={[]}
        draggingPieceId={null}
        promotion={{ position: { x: 0, y: 7 }, team: TeamType.OUR }}
        isCheckedSquare={mockIsCheckedSquare}
        onMovePiece={mockOnMovePiece}
        onPromote={mockOnPromote}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    expect(document.querySelector(".promotion__overlay")).toBeInTheDocument();
  });

  // it("renders dragging piece overlay when dragState has a piece: ドラッグ中の駒を表示する", () => {
  //   vi.mocked(useDragAndDrop).mockReturnValue({
  //     chessboardRef: { current: null },
  //     dragState: {
  //       piece: mockPiece,
  //       offsetX: 0,
  //       offsetY: 0,
  //       clientX: 100,
  //       clientY: 100,
  //     },
  //     onPointerDown: vi.fn(),
  //     onPointerMove: vi.fn(),
  //     onPointerUp: vi.fn(),
  //   });

  //   const { container } = render(
  //     <Chessboard
  //       pieces={[mockPiece]}
  //       possibleMoves={[]}
  //       draggingPieceId="test-piece"
  //       isCheckedSquare={mockIsCheckedSquare}
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
    render(
      <Chessboard
        pieces={createBoard()}
        possibleMoves={[]}
        draggingPieceId={null}
        isCheckedSquare={mockIsCheckedSquare}
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