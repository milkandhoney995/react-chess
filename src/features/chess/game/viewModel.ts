import { Position } from "@/domain/chess/types";
import { selectIsCheck, selectIsCheckedSquare, selectPossibleMovesByPieceId, selectWinningTeam } from "./selectors";
import { ChessState } from "./types";

export function useChessGameView(state: ChessState, draggingPieceId: string | null) {
  return {
    pieces: state.pieces,
    promotion: state.promotion,
    possibleMoves: selectPossibleMovesByPieceId(draggingPieceId)(state),
    isCheck: selectIsCheck(state),
    isCheckedSquare: (pos: Position) =>
      selectIsCheckedSquare(pos)(state),
    winningTeam: selectWinningTeam(state),
  };
}