
import { applyMove } from "../applyMove";
import { Piece, PieceType, TeamType } from "../../types";

describe("applyMove", () => {
  it("should move a piece to an empty square", () => {
    const pawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OUR,
      position: { x: 0, y: 1 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board = [pawn];

    const newBoard = applyMove(board, { x: 0, y: 1 }, { x: 0, y: 2 });

    expect(newBoard).toHaveLength(1);
    expect(newBoard[0].position).toEqual({ x: 0, y: 2 });
  });

  it("should capture opponent pieces", () => {
    const whitePawn: Piece = {
      id: "white-pawn",
      type: PieceType.PAWN,
      team: TeamType.OUR,
      position: { x: 0, y: 1 },
      hasMoved: false,
      possibleMoves: [],
    };

    const blackPawn: Piece = {
      id: "black-pawn",
      type: PieceType.PAWN,
      team: TeamType.OPPONENT,
      position: { x: 1, y: 2 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board = [whitePawn, blackPawn];

    const newBoard = applyMove(board, { x: 0, y: 1 }, { x: 1, y: 2 });

    expect(newBoard).toHaveLength(1);
    expect(newBoard[0].id).toBe("white-pawn");
    expect(newBoard[0].position).toEqual({ x: 1, y: 2 });
  });

  it("should handle en passant capture", () => {
    // White pawn at (0,4), black pawn at (1,4) that just moved two squares
    const whitePawn: Piece = {
      id: "white-pawn",
      type: PieceType.PAWN,
      team: TeamType.OUR,
      position: { x: 0, y: 4 },
      hasMoved: false,
      possibleMoves: [],
    };

    const blackPawn: Piece = {
      id: "black-pawn",
      type: PieceType.PAWN,
      team: TeamType.OPPONENT,
      position: { x: 1, y: 4 },
      hasMoved: true,
      possibleMoves: [],
      enPassant: true,
    };

    const board = [whitePawn, blackPawn];

    const newBoard = applyMove(board, { x: 0, y: 4 }, { x: 1, y: 5 });

    expect(newBoard).toHaveLength(1); // Black pawn should be captured
    expect(newBoard[0].id).toBe("white-pawn");
    expect(newBoard[0].position).toEqual({ x: 1, y: 5 });
  });

  it("should return original board if moving piece not found", () => {
    const pawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OUR,
      position: { x: 0, y: 1 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board = [pawn];

    const newBoard = applyMove(board, { x: 5, y: 5 }, { x: 5, y: 6 });

    expect(newBoard).toBe(board); // Should return same reference
  });
});
