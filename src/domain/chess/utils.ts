import { Piece, PieceType, Position, TeamType } from "@/domain/chess/types";
import { getPossibleBishopMoves, getPossibleKingMoves, getPossibleKnightMoves, getPossiblePawnMoves, getPossibleQueenMoves, getPossibleRookMoves } from "@/domain/chess/rules";

/* =====================
   位置比較
===================== */
export function samePosition(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

// 駒同士の比較
export function samePiecePosition(a: Piece, b: Piece): boolean {
  return samePosition(a.position, b.position) && a.type === b.type && a.team === b.team;
}

/* =====================
   画像取得
===================== */
export function getPieceImage(piece: Piece): string {
  const teamChar = piece.team === TeamType.OUR ? TeamType.OUR : TeamType.OPPONENT;
  return `/assets/images/${piece.type.toLowerCase()}_${teamChar}.png`;
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
 */
export function getPossibleMoves(piece: Piece, board: Piece[]): Position[] {
  const fn = possibleMovesMap[piece.type];
  return fn ? fn(piece, board) : [];
}