
import { chessReducer } from "../reducer";
import { initialChessState } from "../state";
import { ChessAction } from "../actions";
import { Piece, PieceType, TeamType } from "@/domain/chess/types";

describe("chessReducer", () => {
  it("should return initial state for unknown action: 未知のアクションに対して初期状態を返す", () => {
    const action = { type: "UNKNOWN" } as any;
    const result = chessReducer(initialChessState, action);
    expect(result).toBe(initialChessState);
  });

  describe("MOVE_PIECE", () => {
    it("should not move piece if promotion is pending: プロモーション中は駒を移動させない", () => {
      const state = {
        ...initialChessState,
        promotion: {
          position: { x: 0, y: 7 },
          team: TeamType.OUR,
        },
      };

      const action: ChessAction = {
        type: "MOVE_PIECE",
        payload: {
          pieceId: "pawn-1",
          to: { x: 0, y: 6 },
        },
      };

      const result = chessReducer(state, action);
      expect(result).toBe(state);
    });

    it("should not move piece if piece not found: 駒が見つからない場合、移動させない", () => {
      const action: ChessAction = {
        type: "MOVE_PIECE",
        payload: {
          pieceId: "non-existent",
          to: { x: 0, y: 6 },
        },
      };

      const result = chessReducer(initialChessState, action);
      expect(result).toBe(initialChessState);
    });

    it("should not move piece if not player's turn: プレイヤーのターンではない場合、駒を移動させない", () => {
      // Find a piece that belongs to opponent (odd turns)
      const opponentPiece = initialChessState.pieces.find(
        p => p.team === TeamType.OPPONENT
      );

      const state = {
        ...initialChessState,
        totalTurns: 0, // OUR team's turn
      };

      const action: ChessAction = {
        type: "MOVE_PIECE",
        payload: {
          pieceId: opponentPiece!.id,
          to: { x: 0, y: 6 },
        },
      };

      const result = chessReducer(state, action);
      expect(result).toBe(state);
    });

    it("should move piece successfully: 駒を正常に移動させる", () => {
      // Find a pawn that can move
      const pawn = initialChessState.pieces.find(
        p => p.type === PieceType.PAWN && p.team === TeamType.OUR
      );

      const action: ChessAction = {
        type: "MOVE_PIECE",
        payload: {
          pieceId: pawn!.id,
          to: { x: pawn!.position.x, y: pawn!.position.y + 1 },
        },
      };

      const result = chessReducer(initialChessState, action);

      expect(result.totalTurns).toBe(1);
      expect(result.pieces).not.toBe(initialChessState.pieces);
      const movedPiece = result.pieces.find(p => p.id === pawn!.id);
      expect(movedPiece?.position).toEqual({
        x: pawn!.position.x,
        y: pawn!.position.y + 1,
      });
    });

    it("should set promotion state when pawn reaches promotion square: ポーンがプロモーションマスに到達した場合、プロモーション状態を設定する", () => {
      // Create a state with a pawn near promotion
      const pawnNearPromotion: Piece = {
        id: "pawn-promotion",
        type: PieceType.PAWN,
        team: TeamType.OUR,
        position: { x: 0, y: 6 },
        hasMoved: true,
        possibleMoves: [],
      };

      const state = {
        ...initialChessState,
        pieces: [pawnNearPromotion],
      };

      const action: ChessAction = {
        type: "MOVE_PIECE",
        payload: {
          pieceId: "pawn-promotion",
          to: { x: 0, y: 7 },
        },
      };

      const result = chessReducer(state, action);

      expect(result.promotion).toEqual({
        position: { x: 0, y: 7 },
        team: TeamType.OUR,
      });
      expect(result.totalTurns).toBe(0); // Turn should not increment during promotion
    });
  });

  describe("PROMOTE_PAWN", () => {
    it("should not promote if no promotion pending: プロモーション中でない場合、プロモーションしない", () => {
      const action: ChessAction = {
        type: "PROMOTE_PAWN",
        payload: {
          position: { x: 0, y: 7 },
          pieceType: PieceType.QUEEN,
        },
      };

      const result = chessReducer(initialChessState, action);
      expect(result).toBe(initialChessState);
    });

    it("should promote pawn successfully: ポーンを正常にプロモートする", () => {
      const pawn: Piece = {
        id: "pawn-to-promote",
        type: PieceType.PAWN,
        team: TeamType.OUR,
        position: { x: 0, y: 7 },
        hasMoved: true,
        possibleMoves: [],
      };

      const state = {
        ...initialChessState,
        pieces: [pawn],
        promotion: {
          position: { x: 0, y: 7 },
          team: TeamType.OUR,
        },
      };

      const action: ChessAction = {
        type: "PROMOTE_PAWN",
        payload: {
          position: { x: 0, y: 7 },
          pieceType: PieceType.QUEEN,
        },
      };

      const result = chessReducer(state, action);

      expect(result.promotion).toBeUndefined();
      expect(result.totalTurns).toBe(1);
      const promotedPiece = result.pieces.find(p => p.id === "pawn-to-promote");
      expect(promotedPiece?.type).toBe(PieceType.QUEEN);
    });
  });

  describe("RESET_GAME", () => {
    it("should reset game state: ゲーム状態をリセットする", () => {
      const modifiedState = {
        ...initialChessState,
        totalTurns: 5,
        winningTeam: TeamType.OUR,
        promotion: {
          position: { x: 0, y: 7 },
          team: TeamType.OUR,
        },
      };

      const action: ChessAction = {
        type: "RESET_GAME",
      };

      const result = chessReducer(modifiedState, action);

      expect(result.totalTurns).toBe(0);
      expect(result.winningTeam).toBeUndefined();
      expect(result.promotion).toBeUndefined();
      expect(result.pieces).toBe(modifiedState.pieces); // Pieces should remain the same
    });
  });
});
