import { ChessState } from "./types";
import { Piece, Position, TeamType, PieceType } from "@/domain/chess/types";
import { getPossibleMoves, isKingInCheck, samePosition } from "@/domain/chess/utils";

/* =====================
  基本セレクタ
===================== */

/**
 * 指定した駒IDの擬似合法手
 * （UIのハイライト用途）
 */
export const selectPossibleMovesByPieceId =
  (pieceId: string | null) =>
  (state: ChessState): Position[] => {
    if (!pieceId) return [];

    const piece = state.pieces.find(p => p.id === pieceId);
    if (!piece) return [];

    return getPossibleMoves(piece, state.pieces);
  };

/**
 * 現在の手番チーム
 */
export const selectCurrentTeam = (state: ChessState): TeamType =>
  state.totalTurns % 2 === 0 ? TeamType.OUR : TeamType.OPPONENT;

/**
 * チームごとの駒一覧
 */
export const selectPiecesByTeam =
  (team: TeamType) =>
  (state: ChessState): Piece[] =>
    state.pieces.filter(p => p.team === team);

/* =====================
  チェック状態セレクタ
===================== */

/**
 * 指定チームがチェックされているか
 */
export const selectIsTeamInCheck =
  (team: TeamType) =>
  (state: ChessState): boolean =>
    isKingInCheck(team, state.pieces);

/**
 * チェックされている王の情報
 * チェックされていなければ null
 */
export const selectCheckedKing = (
  state: ChessState
): {
  team: TeamType;
  position: Position;
} | null => {
  const pieces = state.pieces;

  const checkedTeam =
    isKingInCheck(TeamType.OUR, pieces)
      ? TeamType.OUR
      : isKingInCheck(TeamType.OPPONENT, pieces)
      ? TeamType.OPPONENT
      : null;

  if (!checkedTeam) return null;

  const king = pieces.find(
    p => p.type === PieceType.KING && p.team === checkedTeam
  );

  if (!king) return null;

  return {
    team: checkedTeam,
    position: king.position,
  };
};

/* =====================
  UI向け補助セレクタ
===================== */

/**
 * 指定マスがチェック中の王のマスか
 * Square コンポーネント用
 */
export const selectIsCheckedSquare =
  (position: Position) =>
  (state: ChessState): boolean => {
    const checkedKing = selectCheckedKing(state);
    if (!checkedKing) return false;

    return samePosition(position, checkedKing.position);
  };