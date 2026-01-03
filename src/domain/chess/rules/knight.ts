import { Piece, Position } from "@/domain/chess/types";
import {
  tileIsEmptyOrOccupiedByOpponent,
} from "@/domain/chess/rules/general";

/* =====================
   Public API
===================== */
export const getPossibleKnightMoves = (
  knight: Piece,
  board: Piece[]
): Position[] => {
  return getJumpMoves(knight, board);
};

/* =====================
   Knight Logic
===================== */

const getJumpMoves = (
  piece: Piece,
  board: Piece[]
): Position[] => {
  return KNIGHT_OFFSETS
    .map(([dx, dy]) => move(piece.position, dx, dy))
    .filter(isInsideBoard)
    .filter(pos =>
      tileIsEmptyOrOccupiedByOpponent(pos, board, piece.team)
    );
};

/* =====================
   Knight Constants
===================== */

const KNIGHT_OFFSETS: Offset[] = [
  [1, 2],
  [2, 1],
  [-1, 2],
  [-2, 1],
  [1, -2],
  [2, -1],
  [-1, -2],
  [-2, -1],
];

type Offset = [dx: number, dy: number];

/* =====================
   Domain Utilities
===================== */

const isInsideBoard = ({ x, y }: Position): boolean =>
  x >= 0 && x < 8 && y >= 0 && y < 8;

const move = (position: Position, dx: number, dy: number): Position => ({
  x: position.x + dx,
  y: position.y + dy,
});