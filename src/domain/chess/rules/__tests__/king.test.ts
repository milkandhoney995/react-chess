
import { getPossibleKingMoves } from "../king";
import { Piece, PieceType, TeamType } from "../../types";

describe("getPossibleKingMoves", () => {
  it("should return adjacent squares for king in center of empty board", () => {
    const king: Piece = {
      id: "king",
      type: PieceType.KING,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [king];

    const moves = getPossibleKingMoves(king, board);

    // King should move to all 8 adjacent squares
    expect(moves).toEqual(
      expect.arrayContaining([
        { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
        { x: 2, y: 3 }, { x: 4, y: 3 },
        { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }
      ])
    );
  });

  it("should not move to squares occupied by own pieces", () => {
    const king: Piece = {
      id: "king",
      type: PieceType.KING,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const ownPawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OUR,
      position: { x: 4, y: 4 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [king, ownPawn];

    const moves = getPossibleKingMoves(king, board);

    // Should not include squares occupied by own pieces
    expect(moves).not.toContainEqual({ x: 4, y: 4 });
  });

  it("should capture opponent pieces", () => {
    const king: Piece = {
      id: "king",
      type: PieceType.KING,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const opponentPawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OPPONENT,
      position: { x: 4, y: 4 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [king, opponentPawn];

    const moves = getPossibleKingMoves(king, board);

    // Should include squares occupied by opponent pieces (capture)
    expect(moves).toContainEqual({ x: 4, y: 4 });
  });

  it("should not move outside the board", () => {
    const king: Piece = {
      id: "king",
      type: PieceType.KING,
      team: TeamType.OUR,
      position: { x: 0, y: 0 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [king];

    const moves = getPossibleKingMoves(king, board);

    // Should only include valid squares
    expect(moves).toEqual(
      expect.arrayContaining([
        { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }
      ])
    );
    // Should not include invalid positions
    expect(moves).not.toContainEqual({ x: -1, y: 0 });
    expect(moves).not.toContainEqual({ x: 0, y: -1 });
  });
});
