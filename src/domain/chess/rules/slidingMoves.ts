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

const isInsideBoard = ({ x, y }: Position): boolean =>
  x >= 0 && x < 8 && y >= 0 && y < 8;

const move = (position: Position, dx: number, dy: number): Position => ({
  x: position.x + dx,
  y: position.y + dy,
});