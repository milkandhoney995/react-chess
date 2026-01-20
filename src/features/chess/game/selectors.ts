import { ChessState } from "./types";
import { Position, TeamType } from "@/domain/chess/types";
import { getCheckedKing } from "@/domain/chess/rules/check";
import { checkWinningTeam, getPossibleMoves, samePosition } from "@/domain/chess/utils";

/* =====================
  基本
===================== */
/**
 * 指定した駒IDの駒の擬似合法手を返す
 * 駒IDが null の場合は空配列を返す
 * @param pieceId 駒ID
 * @returns 位置配列
*/
export const selectPossibleMovesByPieceId =
  (pieceId: string | null) =>
  (state: ChessState): Position[] => {
    if (!pieceId) return [];
    const piece = state.pieces.find(p => p.id === pieceId);
    return piece ? getPossibleMoves(piece, state.pieces) : [];
  };

/**
 * 現在のターンのチームを返す
 * @param state チェスの状態
 * @return 現在のターンのチーム
*/
export const selectCurrentTeam = (state: ChessState): TeamType =>
  state.totalTurns % 2 === 0
    ? TeamType.OUR
    : TeamType.OPPONENT;

/* =====================
  チェック関連（ここが要）
===================== */
/**
 * チェックされている王を返す
 * チェックされていなければ null
 * @param state チェスの状態
 * @return チェックされている王のチームと位置、または null
*/
export const selectCheckedKing = (state: ChessState) =>
  getCheckedKing(state.pieces);

/**
 * チェックされているかどうかを返す
 * @param state チェスの状態
 * @return チェックされている場合は true、されていない場合は false
*/
export const selectIsCheck = (state: ChessState): boolean =>
  selectCheckedKing(state) !== null;

/**
 * チェックされているマスの位置配列を返す
 * @param state チェスの状態
 * @return チェックされているマスの位置配列
*/
export const selectCheckedSquares = (state: ChessState): Position[] => {
  const checked = selectCheckedKing(state);
  return checked ? [checked.position] : [];
};

/* =====================
  勝利判定
===================== */

/**
 * 勝利チームを返す
 * 引き分けまたは未決着の場合は undefined
 * @param state チェスの状態
 * @return 勝利チーム、または undefined
*/
export const selectWinningTeam = (state: ChessState): TeamType | undefined =>
  checkWinningTeam(state.pieces);

/* =====================
  UI補助
===================== */

/**
 * 指定したマスがチェックされているかどうかを返す
 * @param position 確認するマスの位置
 * @param state チェスの状態
 * @return チェックされている場合は true、されていない場合は false
*/
export const selectIsCheckedSquare =
  (position: Position) =>
  (state: ChessState): boolean => {
    const checked = selectCheckedKing(state);
    return checked
      ? samePosition(position, checked.position)
      : false;
  };