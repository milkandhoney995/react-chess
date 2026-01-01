// src/domain/chess/rules/queen.ts
import { Piece, Position } from "@/domain/chess/types";
import {
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "@/domain/chess/rules/general";

export const getPossibleQueenMoves = (
  queen: Piece,
  board: Piece[]
): Position[] => {
  return [
    ...getLineMoves(queen, board, [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [1, -1], [-1, 1], [-1, -1],
    ]),
  ];
};

const getLineMoves = (
  piece: Piece,
  board: Piece[],
  dirs: number[][]
): Position[] => {
  const moves: Position[] = [];

  for (const [dx, dy] of dirs) {
    for (let i = 1; i < 8; i++) {
      const dest = {
        x: piece.position.x + dx * i,
        y: piece.position.y + dy * i,
      };

      if (dest.x < 0 || dest.x > 7 || dest.y < 0 || dest.y > 7) break;

      if (!tileIsOccupied(dest, board)) {
        moves.push(dest);
      } else if (
        tileIsOccupiedByOpponent(dest, board, piece.team)
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