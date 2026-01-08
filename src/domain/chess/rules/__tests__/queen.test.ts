
import { getPossibleQueenMoves } from "../queen";
import { Piece, PieceType, TeamType } from "../../types";

describe("getPossibleQueenMoves", () => {
  it("should return all 8 directions for queen in center of empty board: クイーンが空の盤面の中央に配置された場合、8方向すべてのマスを返す", () => {
    const queen: Piece = {
      id: "queen",
      type: PieceType.QUEEN,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [queen];

    const moves = getPossibleQueenMoves(queen, board);

    // Queen should move in all 8 directions (bishop + rook)
    expect(moves).toEqual(
      expect.arrayContaining([
        // Diagonals
        { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }, { x: 4, y: 4 }, { x: 5, y: 5 }, { x: 6, y: 6 }, { x: 7, y: 7 },
        { x: 0, y: 6 }, { x: 1, y: 5 }, { x: 2, y: 4 }, { x: 4, y: 2 }, { x: 5, y: 1 }, { x: 6, y: 0 },
        // Orthogonals
        { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 },
        { x: 2, y: 3 }, { x: 1, y: 3 }, { x: 0, y: 3 },
        { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 },
        { x: 3, y: 2 }, { x: 3, y: 1 }, { x: 3, y: 0 }
      ])
    );
  });

  it("should be blocked by own pieces: 自分の駒が配置された場合、そのマスに移動しない", () => {
    const queen: Piece = {
      id: "queen",
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

    const board: Piece[] = [queen, ownPawn];

    const moves = getPossibleQueenMoves(queen, board);

    // Should not include squares beyond the blocking piece
    expect(moves).not.toContainEqual({ x: 6, y: 3 });
    expect(moves).not.toContainEqual({ x: 7, y: 3 });
    expect(moves).toContainEqual({ x: 4, y: 3 });
  });

  it("should capture opponent pieces but not move beyond: 相手の駒を捕獲するが、その先には移動しない", () => {
    const queen: Piece = {
      id: "queen",
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
      position: { x: 3, y: 5 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [queen, opponentPawn];

    const moves = getPossibleQueenMoves(queen, board);

    // Should include the capture square
    expect(moves).toContainEqual({ x: 3, y: 5 });
    // But not beyond
    expect(moves).not.toContainEqual({ x: 3, y: 6 });
    expect(moves).not.toContainEqual({ x: 3, y: 7 });
  });
});
