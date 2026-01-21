import { render, fireEvent, screen } from "@testing-library/react";
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
    PAWN: () => <svg data-testid="dragging-piece" />,
  },
}));

// Chessboard mock
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

    const squares = document.querySelectorAll(".tile");
    expect(squares.length).toBe(64);
  });

  it("renders pieces on the board: ボード上に駒をレンダーする", () => {
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

  it("highlights possible moves: 可能な移動先をハイライトする", () => {
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

  it("handles piece drag start: ドラッグ開始を処理する", () => {
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

    const piece = document.querySelector(".tile__image")!;
    fireEvent.pointerDown(piece);

    expect(mockOnDragStart).toHaveBeenCalledWith(mockPiece);
  });

  it("prevents interactions during promotion: プロモーション中はインタラクションを防ぐ", () => {
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

    const piece = document.querySelector(".tile__image")!;
    fireEvent.pointerDown(piece);

    expect(mockOnDragStart).not.toHaveBeenCalled();
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

  // it("renders dragging piece overlay: ドラッグ中の駒を表示する", () => {
  //   vi.mocked(useDragAndDrop).mockImplementation(() => ({
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
  //   }));

  //   render(
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

  //   expect(screen.getByTestId("dragging-piece")).toBeInTheDocument();
  // });

  it("renders complete chess board with initial setup: 完全なチェスボードを初期状態でレンダーする", () => {
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

    expect(document.querySelectorAll(".tile").length).toBe(64);
    expect(document.querySelectorAll(".tile__image").length).toBe(32);
  });
});
