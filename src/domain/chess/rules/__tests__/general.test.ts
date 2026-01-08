
import { tileIsOccupied, tileIsOccupiedByOpponent, tileIsEmptyOrOccupiedByOpponent } from "../general";
import { Piece, PieceType, TeamType } from "../../types";

describe("tileIsOccupied", () => {
  it("should return true when tile is occupied: 駒が配置された場合、trueを返す", () => {
    const piece: Piece = {
      id: "piece",
      type: PieceType.PAWN,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [piece];

    expect(tileIsOccupied({ x: 3, y: 3 }, board)).toBe(true);
  });

  it("should return false when tile is empty", () => {
    const board: Piece[] = [];

    expect(tileIsOccupied({ x: 3, y: 3 }, board)).toBe(false);
  });
});

describe("tileIsOccupiedByOpponent", () => {
  it("should return true when tile is occupied by opponent: 相手の駒が配置された場合、trueを返す", () => {
    const opponentPiece: Piece = {
      id: "opponent",
      type: PieceType.PAWN,
      team: TeamType.OPPONENT,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [opponentPiece];

    expect(tileIsOccupiedByOpponent({ x: 3, y: 3 }, board, TeamType.OUR)).toBe(true);
  });

  it("should return false when tile is occupied by own piece: 自分の駒が配置された場合、falseを返す", () => {
    const ownPiece: Piece = {
      id: "own",
      type: PieceType.PAWN,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [ownPiece];

    expect(tileIsOccupiedByOpponent({ x: 3, y: 3 }, board, TeamType.OUR)).toBe(false);
  });

  it("should return false when tile is empty: 駒が配置されていない場合、falseを返す", () => {
    const board: Piece[] = [];

    expect(tileIsOccupiedByOpponent({ x: 3, y: 3 }, board, TeamType.OUR)).toBe(false);
  });
});

describe("tileIsEmptyOrOccupiedByOpponent", () => {
  it("should return true when tile is empty: 駒が配置されていない場合、trueを返す", () => {
    const board: Piece[] = [];

    expect(tileIsEmptyOrOccupiedByOpponent({ x: 3, y: 3 }, board, TeamType.OUR)).toBe(true);
  });

  it("should return true when tile is occupied by opponent: 相手の駒が配置された場合、trueを返す", () => {
    const opponentPiece: Piece = {
      id: "opponent",
      type: PieceType.PAWN,
      team: TeamType.OPPONENT,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [opponentPiece];

    expect(tileIsEmptyOrOccupiedByOpponent({ x: 3, y: 3 }, board, TeamType.OUR)).toBe(true);
  });

  it("should return false when tile is occupied by own piece: 自分の駒が配置された場合、falseを返す", () => {
    const ownPiece: Piece = {
      id: "own",
      type: PieceType.PAWN,
      team: TeamType.OUR,
      position: { x: 3, y: 3 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [ownPiece];

    expect(tileIsEmptyOrOccupiedByOpponent({ x: 3, y: 3 }, board, TeamType.OUR)).toBe(false);
  });
});
