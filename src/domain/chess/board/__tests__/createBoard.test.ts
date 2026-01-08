
import { createBoard, createId } from "../createBoard";
import { PieceType, TeamType } from "../../types";

describe("createBoard", () => {
  it("should create 32 pieces for a standard chess board", () => {
    const board = createBoard();

    expect(board).toHaveLength(32);
  });

  it("should place white pieces on rows 0-1", () => {
    const board = createBoard();

    const whitePieces = board.filter(piece => piece.team === TeamType.OUR);

    expect(whitePieces).toHaveLength(16);
    whitePieces.forEach(piece => {
      expect(piece.position.y).toBeLessThan(2);
    });
  });

  it("should place black pieces on rows 6-7", () => {
    const board = createBoard();

    const blackPieces = board.filter(piece => piece.team === TeamType.OPPONENT);

    expect(blackPieces).toHaveLength(16);
    blackPieces.forEach(piece => {
      expect(piece.position.y).toBeGreaterThan(5);
    });
  });

  it("should place kings correctly", () => {
    const board = createBoard();

    const kings = board.filter(piece => piece.type === PieceType.KING);

    expect(kings).toHaveLength(2);
    expect(kings[0].position).toEqual({ x: 4, y: 0 }); // White king
    expect(kings[1].position).toEqual({ x: 4, y: 7 }); // Black king
  });

  it("should place queens correctly", () => {
    const board = createBoard();

    const queens = board.filter(piece => piece.type === PieceType.QUEEN);

    expect(queens).toHaveLength(2);
    expect(queens[0].position).toEqual({ x: 3, y: 0 }); // White queen
    expect(queens[1].position).toEqual({ x: 3, y: 7 }); // Black queen
  });

  it("should place pawns on rows 1 and 6", () => {
    const board = createBoard();

    const pawns = board.filter(piece => piece.type === PieceType.PAWN);

    expect(pawns).toHaveLength(16);
    const whitePawns = pawns.filter(pawn => pawn.team === TeamType.OUR);
    const blackPawns = pawns.filter(pawn => pawn.team === TeamType.OPPONENT);

    expect(whitePawns).toHaveLength(8);
    whitePawns.forEach(pawn => {
      expect(pawn.position.y).toBe(1);
    });

    expect(blackPawns).toHaveLength(8);
    blackPawns.forEach(pawn => {
      expect(pawn.position.y).toBe(6);
    });
  });
});

describe("createId", () => {
  it("should generate unique IDs", () => {
    const id1 = createId();
    const id2 = createId();

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^piece-\d+$/);
  });
});
