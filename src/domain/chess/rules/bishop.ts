import {
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "@/domain/chess/rules/general";
import { Piece, Position } from "@/domain/chess/types";

export const getPossibleBishopMoves = (
  bishop: Piece,
  board: Piece[]
): Position[] => {
  const moves: Position[] = [];

  const directions = [
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ];

  for (const [dx, dy] of directions) {
    for (let i = 1; i < 8; i++) {
      const dest = {
        x: bishop.position.x + dx * i,
        y: bishop.position.y + dy * i,
      };

      if (dest.x < 0 || dest.x > 7 || dest.y < 0 || dest.y > 7) break;

      if (!tileIsOccupied(dest, board)) {
        moves.push(dest);
      } else if (
        tileIsOccupiedByOpponent(dest, board, bishop.team)
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
