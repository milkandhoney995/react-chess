import { Piece, PieceType, Position, TeamType } from "@/domain/chess/types";
import { getPossibleBishopMoves, getPossibleKingMoves, getPossibleKnightMoves, getPossiblePawnMoves, getPossibleQueenMoves, getPossibleRookMoves } from "@/domain/chess/rules";

// 位置比較
export function samePosition(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

// 駒同士の比較
export function samePiecePosition(a: Piece, b: Piece): boolean {
  return samePosition(a.position, b.position) && a.type === b.type && a.team === b.team;
}

// 駒の画像パスを取得
export function getPieceImage(piece: Piece): string {
  const teamChar = piece.team === TeamType.OUR ? TeamType.OUR : TeamType.OPPONENT;
  return `/assets/images/${piece.type.toLowerCase()}_${teamChar}.png`;
}

/** 勝利判定: 相手のキングがいなければ自分の勝ち */
export function checkWinningTeam(pieces: Piece[]): TeamType | undefined {
  const hasOurKing = pieces.some(p => p.type === PieceType.KING && p.team === TeamType.OUR);
  const hasOpponentKing = pieces.some(p => p.type === PieceType.KING && p.team === TeamType.OPPONENT);

  if (!hasOpponentKing && hasOurKing) return TeamType.OUR;
  if (!hasOurKing && hasOpponentKing) return TeamType.OPPONENT;
  return undefined;
}

// 駒の合法手計算
export function getPossibleMoves(piece: Piece, board: Piece[]): Position[] {
  switch (piece.type) {
    case PieceType.PAWN:
      return getPossiblePawnMoves(piece, board);
    case PieceType.ROOK:
      return getPossibleRookMoves(piece, board);
    case PieceType.KNIGHT:
      return getPossibleKnightMoves(piece, board);
    case PieceType.BISHOP:
      return getPossibleBishopMoves(piece, board);
    case PieceType.QUEEN:
      return getPossibleQueenMoves(piece, board);
    case PieceType.KING:
      return getPossibleKingMoves(piece, board);
    default:
      return [];
  }
}