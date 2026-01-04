import { ChessState } from "@/features/chess/types";
import { ChessAction } from "@/features/chess/actions";
import { checkWinningTeam, samePosition } from "@/domain/chess/utils";
import { movePiece } from "@/domain/chess/board/movePiece";
import { TeamType } from "@/domain/chess/types";

export function chessReducer(
  state: ChessState,
  action: ChessAction
): ChessState {
  switch (action.type) {
    case "MOVE_PIECE": {
      const piece = state.pieces.find(p => p.id === action.payload.pieceId);
      if (!piece) return state;

      // 安全のため Reducer 側でもターンチェック
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

      return {
        ...state,
        pieces: hasMoved ? newPieces : state.pieces,
        totalTurns: hasMoved ? state.totalTurns + 1 : state.totalTurns,
        winningTeam: hasMoved ? checkWinningTeam(newPieces) : state.winningTeam,
      };
    }

    case "RESET_GAME":
      return {
        ...state,
        pieces: state.pieces,
        totalTurns: 0,
        winningTeam: undefined,
      };

    default:
      return state;
  }
}