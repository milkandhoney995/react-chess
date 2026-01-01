// src/domain/chess/rules/knight.ts
import { Piece, Position } from "@/domain/chess/types";
import { tileIsEmptyOrOccupiedByOpponent } from "@/domain/chess/rules/general";

export const getPossibleKnightMoves = (
  knight: Piece,
  board: Piece[]
): Position[] => {
  const moves: Position[] = [];

  const offsets = [
    [1, 2], [2, 1], [-1, 2], [-2, 1],
    [1, -2], [2, -1], [-1, -2], [-2, -1],
  ];

  for (const [dx, dy] of offsets) {
    const dest = {
      x: knight.position.x + dx,
      y: knight.position.y + dy,
    };

    if (dest.x < 0 || dest.x > 7 || dest.y < 0 || dest.y > 7) continue;

    if (tileIsEmptyOrOccupiedByOpponent(dest, board, knight.team)) {
      moves.push(dest);
    }
  }

  return moves;
};