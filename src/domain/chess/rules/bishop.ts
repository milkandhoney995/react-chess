import { Piece, Position } from "@/domain/chess/types";
import { getSlidingMoves, Direction } from "@/domain/chess/rules/slidingMoves";

/* =====================
   Public API
===================== */

export const getPossibleBishopMoves = (
  bishop: Piece,
  board: Piece[]
): Position[] => {
  return getSlidingMoves(bishop, board, BISHOP_DIRECTIONS);
};

/* =====================
   Constants
===================== */

const BISHOP_DIRECTIONS: Direction[] = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];