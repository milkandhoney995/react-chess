import { Piece, Position } from "@/domain/chess/types";
import {
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "@/domain/chess/rules/general";

export const getPossibleRookMoves = (
  rook: Piece,
  board: Piece[]
): Position[] => {
  const moves: Position[] = [];

  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
  ];

  for (const [dx, dy] of directions) {
    for (let i = 1; i < 8; i++) {
      const dest = {
        x: rook.position.x + dx * i,
        y: rook.position.y + dy * i,
      };

      if (dest.x < 0 || dest.x > 7 || dest.y < 0 || dest.y > 7) break;

      if (!tileIsOccupied(dest, board)) {
        moves.push(dest);
      } else if (
        tileIsOccupiedByOpponent(dest, board, rook.team)
      ) {
        moves.push(dest);
        break;
      } else {
        break;
      }
    }
  }

  return moves;
};