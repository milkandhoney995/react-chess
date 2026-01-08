import { getPossibleBishopMoves } from "../bishop";
import { Piece, PieceType, TeamType } from "../../types";

describe("getPossibleBishopMoves", () => {
  it("should return diagonal moves for bishop in center of empty board: ビショップが空の盤面の中央に配置された場合、対角線の移動を返す", () => {
    const bishop: Piece = {
      id: "bishop",
      type: PieceType.BISHOP,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [bishop];
    const moves = getPossibleBishopMoves(bishop, board);

    // Bishop should move diagonally in all 4 directions
    expect(moves).toEqual(
      expect.arrayContaining([
        { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }, { x: 4, y: 4 }, { x: 5, y: 5 }, { x: 6, y: 6 }, { x: 7, y: 7 },
        { x: 0, y: 6 }, { x: 1, y: 5 }, { x: 2, y: 4 }, { x: 4, y: 2 }, { x: 5, y: 1 }, { x: 6, y: 0 },
        { x: 2, y: 2 }, { x: 1, y: 1 }, { x: 0, y: 0 }, { x: 4, y: 4 }, { x: 5, y: 5 }, { x: 6, y: 6 }, { x: 7, y: 7 },
        { x: 4, y: 2 }, { x: 5, y: 1 }, { x: 6, y: 0 }
      ])
    );
  });

  it("should be blocked by own pieces: 自分の駒で遮られる", () => {
    const bishop: Piece = {
      id: "bishop",
      type: PieceType.BISHOP,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const ownPawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OUR,
      position: { x: 5, y: 5 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [bishop, ownPawn];

    const moves = getPossibleBishopMoves(bishop, board);

    // Should not include squares beyond the blocking piece
    expect(moves).not.toContainEqual({ x: 6, y: 6 });
    expect(moves).not.toContainEqual({ x: 7, y: 7 });
    expect(moves).toContainEqual({ x: 4, y: 4 });
  });

  it("should capture opponent pieces but not move beyond: 相手の駒を捕獲し、それ以上移動しない", () => {
    const bishop: Piece = {
      id: "bishop",
      type: PieceType.BISHOP,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const opponentPawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OPPONENT,
      position: { x: 5, y: 5 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [bishop, opponentPawn];

    const moves = getPossibleBishopMoves(bishop, board);

    // Should include the capture square
    expect(moves).toContainEqual({ x: 5, y: 5 });
    // But not beyond
    expect(moves).not.toContainEqual({ x: 6, y: 6 });
    expect(moves).not.toContainEqual({ x: 7, y: 7 });
  });
});
