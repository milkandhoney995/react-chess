
import { getSlidingMoves } from "../slidingMoves";
import { Piece, PieceType, TeamType } from "../../types";

describe("getSlidingMoves", () => {
  it("should return moves in given directions until blocked", () => {
    const piece: Piece = {
      id: "piece",
      type: PieceType.QUEEN,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [piece];

    // Test with horizontal right direction
    const moves = getSlidingMoves(piece, board, [[1, 0]]);

    expect(moves).toEqual(
      expect.arrayContaining([
        { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 }
      ])
    );
  });

  it("should stop at own pieces", () => {
    const piece: Piece = {
      id: "piece",
      type: PieceType.QUEEN,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const ownPawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OUR,
      position: { x: 5, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [piece, ownPawn];

    const moves = getSlidingMoves(piece, board, [[1, 0]]);

    // Should include squares up to but not including the blocking piece
    expect(moves).toContainEqual({ x: 4, y: 3 });
    expect(moves).not.toContainEqual({ x: 5, y: 3 });
    expect(moves).not.toContainEqual({ x: 6, y: 3 });
  });

  it("should include opponent pieces but stop after", () => {
    const piece: Piece = {
      id: "piece",
      type: PieceType.QUEEN,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const opponentPawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OPPONENT,
      position: { x: 5, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [piece, opponentPawn];

    const moves = getSlidingMoves(piece, board, [[1, 0]]);

    // Should include the opponent piece (capture) but not beyond
    expect(moves).toContainEqual({ x: 5, y: 3 });
    expect(moves).not.toContainEqual({ x: 6, y: 3 });
  });

  it("should handle multiple directions", () => {
    const piece: Piece = {
      id: "piece",
      type: PieceType.QUEEN,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [piece];

    // Test with right and up directions
    const moves = getSlidingMoves(piece, board, [[1, 0], [0, 1]]);

    expect(moves).toEqual(
      expect.arrayContaining([
        { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 },
        { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }
      ])
    );
  });
});
