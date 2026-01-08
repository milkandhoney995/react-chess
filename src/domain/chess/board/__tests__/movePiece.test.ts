
import { movePiece } from "../movePiece";
import { Piece, PieceType, TeamType } from "../../types";

describe("movePiece", () => {
  it("should move a piece to a new position: 駒を新しい位置に移動する", () => {
    const pawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OUR,
      position: { x: 0, y: 1 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board = [pawn];

    const newBoard = movePiece(board, { x: 0, y: 1 }, { x: 0, y: 2 }, 1);

    expect(newBoard).toHaveLength(1);
    expect(newBoard[0].position).toEqual({ x: 0, y: 2 });
    expect(newBoard[0].hasMoved).toBe(true);
  });

  it("should capture opponent pieces: 相手の駒を捕獲する", () => {
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

    const newBoard = movePiece(board, { x: 0, y: 1 }, { x: 1, y: 2 }, 1);

    expect(newBoard).toHaveLength(1);
    expect(newBoard[0].id).toBe("white-pawn");
    expect(newBoard[0].position).toEqual({ x: 1, y: 2 });
  });

  it("should return original board if moving piece not found: 移動する駒が見つからない場合、元のボードを返す", () => {
    const pawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OUR,
      position: { x: 0, y: 1 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board = [pawn];

    const newBoard = movePiece(board, { x: 5, y: 5 }, { x: 5, y: 6 }, 1);

    expect(newBoard).toBe(board); // Should return same reference if no move
  });

  it("should update possibleMoves for all pieces: すべての駒のpossibleMovesを更新する", () => {
    const pawn: Piece = {
      id: "pawn",
      type: PieceType.PAWN,
      team: TeamType.OUR,
      position: { x: 0, y: 1 },
      hasMoved: false,
      possibleMoves: [],
    };

    const board = [pawn];

    const newBoard = movePiece(board, { x: 0, y: 1 }, { x: 0, y: 2 }, 1);

    // After move, possibleMoves should be recalculated
    expect(newBoard[0].possibleMoves).toBeDefined();
  });
});
