import { Piece, Position } from "@/domain/chess/types";
import { getSlidingMoves, Direction } from "@/domain/chess/rules/slidingMoves";

/* =====================
   Public API
===================== */

export const getPossibleQueenMoves = (
  queen: Piece,
  board: Piece[]
): Position[] => {
  return getSlidingMoves(queen, board, QUEEN_DIRECTIONS);
};

/* =====================
   Constants
===================== */

const QUEEN_DIRECTIONS: Direction[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];