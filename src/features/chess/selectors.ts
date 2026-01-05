import { ChessState } from "./types";
import { Position, TeamType } from "@/domain/chess/types";
import { getCheckedKing } from "@/domain/chess/rules/check";
import { checkWinningTeam, getPossibleMoves, samePosition } from "@/domain/chess/utils";

/* =====================
  基本
===================== */

export const selectPossibleMovesByPieceId =
  (pieceId: string | null) =>
  (state: ChessState): Position[] => {
    if (!pieceId) return [];
    const piece = state.pieces.find(p => p.id === pieceId);
    return piece ? getPossibleMoves(piece, state.pieces) : [];
  };

export const selectCurrentTeam = (state: ChessState): TeamType =>
  state.totalTurns % 2 === 0
    ? TeamType.OUR
    : TeamType.OPPONENT;

/* =====================
  チェック関連（ここが要）
===================== */

export const selectCheckedKing = (state: ChessState) =>
  getCheckedKing(state.pieces);

export const selectIsCheck = (state: ChessState): boolean =>
  selectCheckedKing(state) !== null;

export const selectCheckedSquares = (state: ChessState): Position[] => {
  const checked = selectCheckedKing(state);
  return checked ? [checked.position] : [];
};

/* =====================
  勝利判定
===================== */

export const selectWinningTeam = (state: ChessState): TeamType | undefined =>
  checkWinningTeam(state.pieces);

/* =====================
  UI補助
===================== */

export const selectIsCheckedSquare =
  (position: Position) =>
  (state: ChessState): boolean => {
    const checked = selectCheckedKing(state);
    return checked
      ? samePosition(position, checked.position)
      : false;
  };