import { CSSProperties } from "react";
import { Piece, PieceType, Position, TeamType, DragState } from "@/domain/chess/types";
import { getPossibleBishopMoves, getPossibleKingMoves, getPossibleKnightMoves, getPossiblePawnMoves, getPossibleQueenMoves, getPossibleRookMoves } from "@/domain/chess/rules";

/* =====================
   位置比較
===================== */
export function samePosition(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

/* =====================
   駒取得
===================== */
/**
 * 指定した位置にある駒を返す
 * @param pieces 駒の配列
 * @param position チェスボード上の位置
 * @returns 該当する Piece または undefined
 */
export function getPieceAt(pieces: Piece[], position: Position): Piece | undefined {
  return pieces.find(p => samePosition(p.position, position));
}

/**
 * 駒のスタイルを計算
 * @param piece 対象の駒
 * @param draggingPieceId 現在ドラッグ中の駒ID
 * @returns CSSProperties または undefined
 */
export function getPieceStyle(
  piece: Piece | undefined,
  draggingPieceId: string | null
): CSSProperties | undefined {
  if (!piece) return undefined;

  // 盤面上の駒は「半透明にするだけ」
  if (piece.id === draggingPieceId) {
    return { opacity: 0 };
  }

  return undefined;
}

/**
 * ドラッグ中の駒スタイルを計算
 * @param dragState 現在のドラッグ状態
 * @returns CSSProperties
 */
export function getDraggingStyle(
  dragState: DragState
): CSSProperties {
  const style: React.CSSProperties = {
    position: "fixed",
    left: dragState.clientX - dragState.offsetX,
    top: dragState.clientY - dragState.offsetY,
    zIndex: 1000,
    pointerEvents: "none",
  };

  return style
}
/* =====================
   勝利判定
===================== */
export function checkWinningTeam(pieces: Piece[]): TeamType | undefined {
  const hasOurKing = pieces.some(p => p.type === PieceType.KING && p.team === TeamType.OUR);
  const hasOpponentKing = pieces.some(p => p.type === PieceType.KING && p.team === TeamType.OPPONENT);

  if (!hasOpponentKing && hasOurKing) return TeamType.OUR;
  if (!hasOurKing && hasOpponentKing) return TeamType.OPPONENT;
  return undefined;
}

/* =====================
   getPossibleMoves ディスパッチャ
===================== */

/**
 * 駒タイプごとの関数マップ
 * 新しい駒タイプが増えたら、ここに追加する
 */
const possibleMovesMap: Record<
  PieceType,
  (piece: Piece, board: Piece[]) => Position[]
> = {
  [PieceType.PAWN]: getPossiblePawnMoves,
  [PieceType.ROOK]: getPossibleRookMoves,
  [PieceType.KNIGHT]: getPossibleKnightMoves,
  [PieceType.BISHOP]: getPossibleBishopMoves,
  [PieceType.QUEEN]: getPossibleQueenMoves,
  [PieceType.KING]: getPossibleKingMoves,
};

/**
 * 駒の合法手を返す
 * @param piece
 * @param board
 */
export function getPossibleMoves(piece: Piece, board: Piece[]): Position[] {
  const fn = possibleMovesMap[piece.type];
  return fn ? fn(piece, board) : [];
}


/* =====================
   その他
===================== */
/**
 * 現在のターンが指定した駒のチームのターンかどうか判定
 * @param pieceTeam
 * @param totalTurns
 */
export function isOurTurn(pieceTeam: TeamType, totalTurns: number): boolean {
  return (
    (pieceTeam === TeamType.OUR && totalTurns % 2 === 0) ||
    (pieceTeam === TeamType.OPPONENT && totalTurns % 2 === 1)
  );
}

/**
 * プロモーション判定
 * @param piece 対象の駒
 * @returns プロモーション可能か
 */

export const isPromotionSquare = (piece: Piece): boolean => {
  if (piece.type !== PieceType.PAWN) return false;

  return (
    (piece.team === TeamType.OUR && piece.position.y === 7) ||
    (piece.team === TeamType.OPPONENT && piece.position.y === 0)
  );
};