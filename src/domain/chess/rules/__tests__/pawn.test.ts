
import { getPossiblePawnMoves } from "../pawn";
import { Piece, PieceType, TeamType } from "../../types";

describe("getPossiblePawnMoves", () => {
  it("should allow one step forward for white pawn: 白のポーンが1マス前進できる", () => {
    const pawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OUR, // white
      position: { x: 3, y: 1 },
      hasMoved: false,
      possibleMoves: [],
      enPassant: false,
    };

    const board: Piece[] = [pawn];

    const moves = getPossiblePawnMoves(pawn, board);

    expect(moves).toContainEqual({ x: 3, y: 2 });
  });

  it("should allow two steps forward from starting position for white pawn: 白のポーンが開始位置から2マス前進できる", () => {
    const pawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OUR, // white
      position: { x: 3, y: 1 },
      hasMoved: false,
      possibleMoves: [],
      enPassant: false,
    };

    const board: Piece[] = [pawn];

    const moves = getPossiblePawnMoves(pawn, board);

    expect(moves).toContainEqual({ x: 3, y: 3 });
  });

  it("should not allow two steps if blocked for white pawn: 白のポーンが遮られている場合、2マス前進できない", () => {
    const pawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OUR, // white
      position: { x: 3, y: 1 },
      hasMoved: false,
      possibleMoves: [],
      enPassant: false,
    };

    const blockingPiece: Piece = {
      id: "blocker",
      type: PieceType.PAWN,
      team: TeamType.OPPONENT,
      position: { x: 3, y: 2 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [pawn, blockingPiece];

    const moves = getPossiblePawnMoves(pawn, board);

    expect(moves).not.toContainEqual({ x: 3, y: 3 });
    expect(moves).toHaveLength(0); // Can't move forward
  });

  it("should allow diagonal captures for white pawn: 白のポーンが斜めに捕獲できる", () => {
    const pawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OUR, // white
      position: { x: 3, y: 1 },
      hasMoved: false,
      possibleMoves: [],
      enPassant: false,
    };

    const opponentPawn: Piece = {
      id: "opponent",
      type: PieceType.PAWN,
      team: TeamType.OPPONENT,
      position: { x: 4, y: 2 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board: Piece[] = [pawn, opponentPawn];

    const moves = getPossiblePawnMoves(pawn, board);

    expect(moves).toContainEqual({ x: 4, y: 2 });
  });

  it("should allow one step forward for black pawn: 黒のポーンが1マス前進できる", () => {
    const pawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OPPONENT, // black
      position: { x: 3, y: 6 },
      hasMoved: false,
      possibleMoves: [],
      enPassant: false,
    };

    const board: Piece[] = [pawn];

    const moves = getPossiblePawnMoves(pawn, board);

    expect(moves).toContainEqual({ x: 3, y: 5 });
  });

  it("should allow two steps forward from starting position for black pawn: 黒のポーンが開始位置から2マス前進できる", () => {
    const pawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OPPONENT, // black
      position: { x: 3, y: 6 },
      hasMoved: false,
      possibleMoves: [],
      enPassant: false,
    };

    const board: Piece[] = [pawn];

    const moves = getPossiblePawnMoves(pawn, board);

    expect(moves).toContainEqual({ x: 3, y: 4 });
  });
});
