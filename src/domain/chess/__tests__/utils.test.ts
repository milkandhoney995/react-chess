import { checkWinningTeam } from "../utils";
import { Piece, PieceType, TeamType } from "../types";

describe("checkWinningTeam", () => {
  it("should return undefined when no king is in check: チェック中の王がいない場合、undefinedを返す", () => {
    const pieces: Piece[] = [
      {
        id: "w-king",
        type: PieceType.KING,
        team: TeamType.OUR,
        position: { x: 4, y: 0 },
        hasMoved: false,
        possibleMoves: [],
      },
      {
        id: "b-king",
        type: PieceType.KING,
        team: TeamType.OPPONENT,
        position: { x: 4, y: 7 },
        hasMoved: false,
        possibleMoves: [],
      },
    ];

    expect(checkWinningTeam(pieces)).toBeUndefined();
  });

  it("should return undefined when king is in check but has legal moves: チェック中の王がいるが合法手がある場合、undefinedを返す", () => {
    const pieces: Piece[] = [
      {
        id: "w-king",
        type: PieceType.KING,
        team: TeamType.OUR,
        position: { x: 0, y: 0 },
        hasMoved: false,
        possibleMoves: [],
      },
      {
        id: "b-queen",
        type: PieceType.QUEEN,
        team: TeamType.OPPONENT,
        position: { x: 0, y: 7 },
        hasMoved: false,
        possibleMoves: [],
      },
      {
        id: "b-king",
        type: PieceType.KING,
        team: TeamType.OPPONENT,
        position: { x: 7, y: 7 },
        hasMoved: false,
        possibleMoves: [],
      },
    ];

    // King at (0,0) is checked by queen at (0,7), but king can move to (1,0) or (0,1) etc.
    expect(checkWinningTeam(pieces)).toBeUndefined();
  });

  it("should return opponent as winner when our king is in checkmate: 自チームの王がチェックメイトの場合、相手チームを勝者として返す", () => {
    const pieces: Piece[] = [
      {
        id: "w-king",
        type: PieceType.KING,
        team: TeamType.OUR,
        position: { x: 0, y: 0 },
        hasMoved: false,
        possibleMoves: [], // King has no moves
      },
      {
        id: "b-queen",
        type: PieceType.QUEEN,
        team: TeamType.OPPONENT,
        position: { x: 1, y: 1 },
        hasMoved: false,
        possibleMoves: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }],
      },
      {
        id: "b-rook",
        type: PieceType.ROOK,
        team: TeamType.OPPONENT,
        position: { x: 1, y: 2 },
        hasMoved: false,
        possibleMoves: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 3 }],
      },
      {
        id: "b-king",
        type: PieceType.KING,
        team: TeamType.OPPONENT,
        position: { x: 7, y: 7 },
        hasMoved: false,
        possibleMoves: [],
      },
    ];

    // King at (0,0) is checked by queen at (1,1), cannot capture protected rook at (1,0) or bishop at (0,1), cannot move to (1,1)
    expect(checkWinningTeam(pieces)).toBe(TeamType.OPPONENT);
  });

  it("should return our team as winner when opponent king is in checkmate: 相手の王がチェックメイトの場合、自チームを勝者として返す", () => {
    const pieces: Piece[] = [
      {
        id: "w-king",
        type: PieceType.KING,
        team: TeamType.OUR,
        position: { x: 7, y: 7 },
        hasMoved: false,
        possibleMoves: [],
      },
      {
        id: "b-king",
        type: PieceType.KING,
        team: TeamType.OPPONENT,
        position: { x: 0, y: 0 },
        hasMoved: false,
        possibleMoves: [],
      },
      {
        id: "w-queen",
        type: PieceType.QUEEN,
        team: TeamType.OUR,
        position: { x: 1, y: 1 },
        hasMoved: false,
        possibleMoves: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }],
      },
      {
        id: "w-rook",
        type: PieceType.ROOK,
        team: TeamType.OUR,
        position: { x: 1, y: 2 },
        hasMoved: false,
        possibleMoves: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 3 }],
      },
    ];

    // Black king at (0,0) is checkmated by white queen at (1,1), protected pieces block escape
    expect(checkWinningTeam(pieces)).toBe(TeamType.OUR);
  });
});