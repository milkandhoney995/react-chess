import { Piece, Position } from "@/domain/chess/types";
import { cloneBoard } from "@/domain/chess/board/cloneBoard";
import { getLegalMoves, getPossibleMoves, samePosition } from "@/domain/chess/utils";
import { applyMove } from "@/domain/chess/board/applyMove";

/* =====================
  possibleMoves 再計算
===================== */
function calculateAllMoves(pieces: Piece[]): Piece[] {
  const next = cloneBoard(pieces);
  return next.map(piece => ({
    ...piece,
    possibleMoves: getPossibleMoves(piece, next),
  }));
}

/* =====================
  駒移動
===================== */
export function movePiece(
  pieces: Piece[],
  from: Position,
  to: Position,
  totalTurns: number
): Piece[] {
  const board = cloneBoard(pieces);

  const movingPiece = board.find(p => samePosition(p.position, from));
  if (!movingPiece) return pieces;

  // 合法手判定
  const possibleMoves = getLegalMoves(movingPiece, board);
  if (!possibleMoves.some(m => samePosition(m, to))) {
    return pieces;
  }

  // 実際の適用
  const next = applyMove(board, from, to);

  // possibleMoves 再計算
  return calculateAllMoves(next);
}