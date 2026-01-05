import { PieceType } from "./types";

export const VERTICAL_AXIS = ["1","2","3","4","5","6","7","8"];
export const HORIZONTAL_AXIS = ["a","b","c","d","e","f","g","h"];
export const GRID_SIZE = 100;

/* =====================
   Promotion
===================== */

export const PROMOTION_PIECES: readonly PieceType[] = [
  PieceType.QUEEN,
  PieceType.ROOK,
  PieceType.BISHOP,
  PieceType.KNIGHT,
];