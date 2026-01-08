
import { cloneBoard } from "../cloneBoard";
import { Piece, PieceType, TeamType } from "../../types";

describe("cloneBoard", () => {
  it("should create a deep copy of the board", () => {
    const originalBoard: Piece[] = [
      {
        id: "pawn1",
        type: PieceType.PAWN,
        team: TeamType.OUR,
        position: { x: 0, y: 1 },
        hasMoved: false,
        possibleMoves: [{ x: 0, y: 2 }, { x: 0, y: 3 }],
      },
    ];

    const clonedBoard = cloneBoard(originalBoard);

    expect(clonedBoard).toHaveLength(1);
    expect(clonedBoard[0]).not.toBe(originalBoard[0]); // Different object
    expect(clonedBoard[0].position).not.toBe(originalBoard[0].position); // Deep copy position
    expect(clonedBoard[0].possibleMoves).not.toBe(originalBoard[0].possibleMoves); // Deep copy moves
    expect(clonedBoard[0].possibleMoves[0]).not.toBe(originalBoard[0].possibleMoves[0]); // Deep copy move objects
  });

  it("should preserve all piece properties", () => {
    const originalPiece: Piece = {
      id: "king",
      type: PieceType.KING,
      team: TeamType.OUR,
      position: { x: 4, y: 0 },
      hasMoved: true,
      possibleMoves: [{ x: 4, y: 1 }],
      enPassant: false,
    };

    const clonedBoard = cloneBoard([originalPiece]);

    expect(clonedBoard[0]).toEqual(originalPiece);
  });

  it("should handle empty board", () => {
    const clonedBoard = cloneBoard([]);

    expect(clonedBoard).toEqual([]);
  });
});
