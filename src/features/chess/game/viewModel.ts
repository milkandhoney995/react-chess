import { selectCheckedSquares, selectIsCheck, selectPossibleMovesByPieceId, selectWinningTeam } from "./selectors";
import { ChessState } from "./types";

export function useChessGameView(state: ChessState, draggingPieceId: string | null) {
  return {
    possibleMoves: selectPossibleMovesByPieceId(draggingPieceId)(state),
    checkedSquares: selectCheckedSquares(state),
    isCheck: selectIsCheck(state),
    winningTeam: selectWinningTeam(state),
  };
}