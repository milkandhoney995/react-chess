import { ChessState } from "@/features/chess/types";
import { ChessAction } from "@/features/chess/actions";
import { checkWinningTeam, samePosition } from "@/domain/chess/utils";
import { movePiece } from "@/domain/chess/board/movePiece";
import { PieceType, TeamType } from "@/domain/chess/types";
import { isPromotionSquare } from "@/domain/chess/utils";

export function chessReducer(
  state: ChessState,
  action: ChessAction
): ChessState {
  switch (action.type) {
    /* =====================
       駒移動
    ===================== */
    case "MOVE_PIECE": {
      // プロモーション待ち中は移動不可
      if (state.promotion) return state;

      const piece = state.pieces.find(p => p.id === action.payload.pieceId);
      if (!piece) return state;

      // ターンチェック
      const isTurn =
        (piece.team === TeamType.OUR && state.totalTurns % 2 === 0) ||
        (piece.team === TeamType.OPPONENT && state.totalTurns % 2 === 1);

      if (!isTurn) return state;

      const newPieces = movePiece(
        state.pieces,
        piece.position,
        action.payload.to,
        state.totalTurns
      );

      const hasMoved = newPieces.some(
        p => p.id === piece.id && !samePosition(p.position, piece.position)
      );

      if (!hasMoved) return state;

      /* =====================
         プロモーション判定
      ===================== */
      const promotedPawn = newPieces.find(
        p =>
          p.id === piece.id &&
          p.type === PieceType.PAWN &&
          isPromotionSquare(p)
      );

      if (promotedPawn) {
        return {
          ...state,
          pieces: newPieces,
          promotion: {
            position: promotedPawn.position,
            team: promotedPawn.team,
          },
        };
      }

      return {
        ...state,
        pieces: newPieces,
        totalTurns: state.totalTurns + 1,
        winningTeam: checkWinningTeam(newPieces),
      };
    }

    /* =====================
       プロモーション確定
    ===================== */
    case "PROMOTE_PAWN": {
      if (!state.promotion) return state;

      const promotedPieces = state.pieces.map(p =>
        samePosition(p.position, action.payload.position)
          ? {
              ...p,
              type: action.payload.pieceType,
            }
          : p
      );

      return {
        ...state,
        pieces: promotedPieces,
        promotion: undefined,
        totalTurns: state.totalTurns + 1,
        winningTeam: checkWinningTeam(promotedPieces),
      };
    }

    /* =====================
       リセット
    ===================== */
    case "RESET_GAME":
      return {
        ...state,
        pieces: state.pieces,
        totalTurns: 0,
        winningTeam: undefined,
        promotion: undefined,
      };

    default:
      return state;
  }
}