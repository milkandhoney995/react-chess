import { ChessState } from "@/features/chess/types";
import { ChessAction } from "@/features/chess/actions";
import { getPossibleMoves, checkWinningTeam, samePosition } from "@/domain/chess/utils";
import { TeamType } from "@/domain/chess/types";

export function chessReducer(
  state: ChessState,
  action: ChessAction
): ChessState {
  switch (action.type) {
    case "MOVE_PIECE": {
      const piece = state.pieces.find(p => p.id === action.payload.pieceId);
      if (!piece) return state;

      const isOurTurn =
        (piece.team === TeamType.OUR && state.totalTurns % 2 === 0) ||
        (piece.team === TeamType.OPPONENT && state.totalTurns % 2 === 1);

      if (!isOurTurn) return state;

      // 合法手判定
      const possibleMoves = getPossibleMoves(piece, state.pieces);
      if (!possibleMoves.some(m => samePosition(m, action.payload.to))) {
        return state;
      }

      const newPieces = state.pieces.map(p =>
        p.id === piece.id
          ? { ...p, position: action.payload.to, hasMoved: true }
          : p
      );

      return {
        ...state,
        pieces: newPieces,
        totalTurns: state.totalTurns + 1,
        winningTeam: checkWinningTeam(newPieces),
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