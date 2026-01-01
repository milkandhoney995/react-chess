import { ChessState } from "@/features/chess/types";
import { ChessAction } from "@/features/chess/actions";
import { movePiece } from "@/domain/chess/board/movePiece";

export function chessReducer(
  state: ChessState,
  action: ChessAction
): ChessState {
  switch (action.type) {
    case "MOVE_PIECE": {
      const pieces = movePiece(
        state.pieces,
        action.payload.from,
        action.payload.to,
        state.totalTurns
      );

      return {
        ...state,
        pieces,
        totalTurns: state.totalTurns + 1,
      };
    }

    default:
      return state;
  }
}