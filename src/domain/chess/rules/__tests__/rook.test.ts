
import { getPossibleRookMoves } from "../rook";
import { Piece, PieceType, TeamType } from "../../types";

describe("getPossibleRookMoves", () => {
  it("should return horizontal and vertical moves for rook in center of empty board", () => {
    const rook: Piece = {
      id: "rook",
      type: PieceType.ROOK,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [rook];

    const moves = getPossibleRookMoves(rook, board);

    // Rook should move horizontally and vertically in all 4 directions
    expect(moves).toEqual(
      expect.arrayContaining([
        // Horizontal right
        { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 },
        // Horizontal left
        { x: 2, y: 3 }, { x: 1, y: 3 }, { x: 0, y: 3 },
        // Vertical up
        { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 },
        // Vertical down
        { x: 3, y: 2 }, { x: 3, y: 1 }, { x: 3, y: 0 }
      ])
    );
  });

  it("should be blocked by own pieces", () => {
    const rook: Piece = {
      id: "rook",
      type: PieceType.ROOK,
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

    const board: Piece[] = [rook, ownPawn];

    const moves = getPossibleRookMoves(rook, board);

    // Should not include squares beyond the blocking piece
    expect(moves).not.toContainEqual({ x: 6, y: 3 });
    expect(moves).not.toContainEqual({ x: 7, y: 3 });
    expect(moves).toContainEqual({ x: 4, y: 3 });
  });

  it("should capture opponent pieces but not move beyond", () => {
    const rook: Piece = {
      id: "rook",
      type: PieceType.ROOK,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const opponentPawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OPPONENT,
      position: { x: 3, y: 5 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [rook, opponentPawn];

    const moves = getPossibleRookMoves(rook, board);

    // Should include the capture square
    expect(moves).toContainEqual({ x: 3, y: 5 });
    // But not beyond
    expect(moves).not.toContainEqual({ x: 3, y: 6 });
    expect(moves).not.toContainEqual({ x: 3, y: 7 });
  });
});
