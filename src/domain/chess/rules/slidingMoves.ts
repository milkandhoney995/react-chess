import { Piece, Position } from "@/domain/chess/types";
import {
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "@/domain/chess/rules/general";

/* =====================
   Types
===================== */

export type Direction = [dx: number, dy: number];

/* =====================
   Public API
===================== */

/**
 * Sliding 駒（Rook / Bishop / Queen）用の共通移動生成
 * @param piece 移動元の駒
 * @param board 盤上の全ての駒
 * @param directions 駒ごとの移動方向配列
 * @return 移動可能な位置の配列
 */
export const getSlidingMoves = (
  piece: Piece,
  board: Piece[],
  directions: Direction[]
): Position[] => {
  return directions.flatMap(direction =>
    getMovesInDirection(piece, board, direction)
  );
};

/* =====================
   Internal Logic
===================== */
/**
  * 指定した方向への移動を取得
  * @param piece 移動元の駒
  * @param board 盤上の全ての駒
  * @param direction 移動方向
  * @return 指定した方向への移動可能な位置の配列
 */
const getMovesInDirection = (
  piece: Piece,
  board: Piece[],
  [dx, dy]: Direction
): Position[] => {
  const moves: Position[] = [];

  for (let step = 1; step < 8; step++) {
    const dest = move(piece.position, dx * step, dy * step);

    if (!isInsideBoard(dest)) break;

    if (!tileIsOccupied(dest, board)) {
      moves.push(dest);
      continue;
    }

    if (tileIsOccupiedByOpponent(dest, board, piece.team)) {
      moves.push(dest);
    }

    break;
  }

  return moves;
};

/* =====================
   Board Utilities
===================== */
/**
 * 指定した位置が盤内かどうか
 * @param position 確認する位置
 * @return 盤内であれば true、盤外であれば false
*/
const isInsideBoard = ({ x, y }: Position): boolean =>
  x >= 0 && x < 8 && y >= 0 && y < 8;

const move = (position: Position, dx: number, dy: number): Position => ({
  x: position.x + dx,
  y: position.y + dy,
});