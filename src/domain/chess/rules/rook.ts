import { Piece, Position } from "@/domain/chess/types";
import { getSlidingMoves, Direction } from "@/domain/chess/rules/slidingMoves";

/* =====================
   Public API
===================== */

export const getPossibleRookMoves = (
  rook: Piece,
  board: Piece[]
): Position[] => {
  return getSlidingMoves(rook, board, ROOK_DIRECTIONS);
};

/* =====================
   Constants
===================== */

const ROOK_DIRECTIONS: Direction[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];