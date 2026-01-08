
import { getPossibleKnightMoves } from "../knight";
import { Piece, PieceType, TeamType } from "../../types";

describe("getPossibleKnightMoves", () => {
  it("should return L-shaped moves for knight in center of empty board", () => {
    const knight: Piece = {
      id: "knight",
      type: PieceType.KNIGHT,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [knight];

    const moves = getPossibleKnightMoves(knight, board);

    // Knight should move in L-shape: 2 in one direction, 1 perpendicular
    expect(moves).toEqual(
      expect.arrayContaining([
        { x: 5, y: 4 }, { x: 5, y: 2 }, { x: 1, y: 4 }, { x: 1, y: 2 },
        { x: 4, y: 5 }, { x: 4, y: 1 }, { x: 2, y: 5 }, { x: 2, y: 1 }
      ])
    );
  });

  it("should not include moves outside the board", () => {
    const knight: Piece = {
      id: "knight",
      type: PieceType.KNIGHT,
      team: TeamType.OUR,
      position: { x: 0, y: 0 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [knight];

    const moves = getPossibleKnightMoves(knight, board);

    // From (0,0), only (1,2) and (2,1) are valid
    expect(moves).toEqual(
      expect.arrayContaining([
        { x: 1, y: 2 }, { x: 2, y: 1 }
      ])
    );
    // Should not include invalid positions
    expect(moves).not.toContainEqual({ x: -1, y: 2 });
    expect(moves).not.toContainEqual({ x: 2, y: -1 });
  });

  it("should capture opponent pieces", () => {
    const knight: Piece = {
      id: "knight",
      type: PieceType.KNIGHT,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const opponentPawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OPPONENT,
      position: { x: 5, y: 4 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [knight, opponentPawn];

    const moves = getPossibleKnightMoves(knight, board);

    // Should include the capture square
    expect(moves).toContainEqual({ x: 5, y: 4 });
  });

  it("should not move to squares occupied by own pieces", () => {
    const knight: Piece = {
      id: "knight",
      type: PieceType.KNIGHT,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const ownPawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OUR,
      position: { x: 5, y: 4 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [knight, ownPawn];

    const moves = getPossibleKnightMoves(knight, board);

    // Should not include squares occupied by own pieces
    expect(moves).not.toContainEqual({ x: 5, y: 4 });
  });
});
