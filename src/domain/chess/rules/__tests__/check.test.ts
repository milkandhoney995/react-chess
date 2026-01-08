import { getCheckedKing } from "../check";
import { Piece, PieceType, TeamType } from "../../types";

describe("getCheckedKing", () => {
  it("should return null when no king is in check", () => {
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

    expect(getCheckedKing(pieces)).toBeNull();
  });

  it("should return the checked king when a king is in check", () => {
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
        possibleMoves: [{ x: 0, y: 0 }],
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

    const result = getCheckedKing(pieces);
    expect(result).not.toBeNull();
    expect(result?.team).toBe(TeamType.OUR);
    expect(result?.position).toEqual({ x: 0, y: 0 });
  });
});