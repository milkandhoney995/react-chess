import { Piece, Position } from "@/domain/chess/types";
import { PieceType, TeamType } from "@/domain/chess/types";
import {
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "@/domain/chess/rules/general";
import { samePosition } from "@/domain/chess/utils";

export const getPossiblePawnMoves = (
  pawn: Piece,
  board: Piece[]
): Position[] => {
  const moves: Position[] = [];

  const dir = pawn.team === TeamType.OUR ? 1 : -1;
  const startRow = pawn.team === TeamType.OUR ? 1 : 6;

  const one: Position = { x: pawn.position.x, y: pawn.position.y + dir };
  const two: Position = { x: pawn.position.x, y: pawn.position.y + dir * 2 };

  if (!tileIsOccupied(one, board)) {
    moves.push(one);

    if (
      pawn.position.y === startRow &&
      !tileIsOccupied(two, board)
    ) {
      moves.push(two);
    }
  }

  for (const dx of [-1, 1]) {
    const diag: Position = {
      x: pawn.position.x + dx,
      y: pawn.position.y + dir,
    };

    if (tileIsOccupiedByOpponent(diag, board, pawn.team)) {
      moves.push(diag);
    } else {
      const side = board.find(p =>
        samePosition(p.position, {
          x: pawn.position.x + dx,
          y: pawn.position.y,
        })
      );

      if (side?.type === PieceType.PAWN && side.enPassant) {
        moves.push(diag);
      }
    }
  }

  return moves;
};