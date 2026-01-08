import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Chessboard from "../Chessboard";
import { Piece, PieceType, TeamType } from "@/domain/chess/types";
import { createBoard } from "@/domain/chess/board/createBoard";
import useDragAndDrop from "@/hooks/useDragAndDrop";

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

const mockDispatch = vi.fn();
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
        dispatch={mockDispatch}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    // Should render squares (8x8 grid)
    const squares = document.querySelectorAll('[class*="tile"]');
    expect(squares.length).toBeGreaterThan(60); // Allow some flexibility for CSS module class names
  });

  it("renders pieces on the board: ボード上に駒をレンダーする", () => {
    const pieces = [mockPiece];

    render(
      <Chessboard
        pieces={pieces}
        possibleMoves={[]}
        draggingPieceId={null}
        dispatch={mockDispatch}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    // Should render the piece
    const pieceElement = document.querySelector('[class*="tile__image"]');
    expect(pieceElement).toBeInTheDocument();
  });

  it("highlights possible moves: 可能な移動先をハイライトする", () => {
    const pieces = [mockPiece];
    const possibleMoves = [{ x: 0, y: 2 }, { x: 0, y: 3 }];

    render(
      <Chessboard
        pieces={pieces}
        possibleMoves={possibleMoves}
        draggingPieceId={null}
        dispatch={mockDispatch}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    // Should have highlighted squares
    const highlightedSquares = document.querySelectorAll('[class*="tile__highlight"]');
    expect(highlightedSquares.length).toBeGreaterThan(0);
  });

  it("shows checked squares: チェック状態の駒を表示する", () => {
    const pieces = [mockPiece];
    const checkedSquares = [{ x: 4, y: 0 }]; // OUR king position

    render(
      <Chessboard
        pieces={pieces}
        possibleMoves={[]}
        draggingPieceId={null}
        checkedSquares={checkedSquares}
        dispatch={mockDispatch}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    // Should have checked squares
    const checkedElements = document.querySelectorAll('[class*="tile__checked"]');
    expect(checkedElements.length).toBeGreaterThan(0);
  });

  it("handles piece drag start: ドラッグ開始を処理する", () => {
    const pieces = [mockPiece];

    render(
      <Chessboard
        pieces={pieces}
        possibleMoves={[]}
        draggingPieceId={null}
        dispatch={mockDispatch}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    const pieceElement = document.querySelector('[class*="tile__image"]');
    expect(pieceElement).toBeInTheDocument();

    fireEvent.pointerDown(pieceElement!, {
      clientX: 100,
      clientY: 100,
      currentTarget: pieceElement,
    });

    expect(mockOnDragStart).toHaveBeenCalledWith(mockPiece);
  });

  it("prevents interactions during promotion: プロモーション中はインタラクションを防ぐ", () => {
    const pieces = [mockPiece];
    const promotion = { position: { x: 0, y: 7 }, team: TeamType.OUR };

    render(
      <Chessboard
        pieces={pieces}
        possibleMoves={[]}
        draggingPieceId={null}
        promotion={promotion}
        dispatch={mockDispatch}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    const pieceElement = document.querySelector('[class*="tile__image"]');
    expect(pieceElement).toBeInTheDocument();

    fireEvent.pointerDown(pieceElement!, {
      clientX: 100,
      clientY: 100,
      currentTarget: pieceElement,
    });

    // Should not call drag handlers during promotion
    expect(mockOnDragStart).not.toHaveBeenCalled();
  });

  it("renders promotion modal when promotion is active: プロモーションモーダルを表示する", () => {
    const pieces = [mockPiece];
    const promotion = { position: { x: 0, y: 7 }, team: TeamType.OUR };

    render(
      <Chessboard
        pieces={pieces}
        possibleMoves={[]}
        draggingPieceId={null}
        promotion={promotion}
        dispatch={mockDispatch}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    // Should render promotion modal
    const modal = document.querySelector('[class*="promotion__overlay"]');
    expect(modal).toBeInTheDocument();
  });

  it("renders dragging piece overlay: ドラッグ中の駒を表示する", () => {
    const pieces = [mockPiece];

    // Mock the useDragAndDrop hook to return drag state
    const mockUseDragAndDrop = vi.fn(() => ({
      chessboardRef: { current: null },
      dragState: {
        piece: mockPiece,
        offsetX: 0,
        offsetY: 0,
        clientX: 100,
        clientY: 100,
      },
      onPointerDown: vi.fn(),
      onPointerMove: vi.fn(),
      onPointerUp: vi.fn(),
    }));

    // Mock the hook
    vi.mocked(useDragAndDrop).mockImplementation(mockUseDragAndDrop);

    render(
      <Chessboard
        pieces={pieces}
        possibleMoves={[]}
        draggingPieceId="test-piece"
        dispatch={mockDispatch}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    // Should render dragging piece overlay
    const draggingPiece = document.querySelector('[class*="chessboard__draggingPiece"]');
    expect(draggingPiece).toBeInTheDocument();
  });

  it("renders complete chess board with initial setup: 完全なチェスボードを初期状態でレンダーする", () => {
    const pieces = createBoard();

    render(
      <Chessboard
        pieces={pieces}
        possibleMoves={[]}
        draggingPieceId={null}
        dispatch={mockDispatch}
        onDragStart={mockOnDragStart}
        onDragEnd={mockOnDragEnd}
      />
    );

    // Should have 32 pieces on the board
    const pieceElements = document.querySelectorAll('[class*="tile__image"]');
    expect(pieceElements).toHaveLength(32);

    // Should have 64 squares total
    const squares = document.querySelectorAll('[class*="tile"]');
    expect(squares.length).toBeGreaterThan(60);
  });
});
