import { Piece, PieceType, Position } from "@/domain/chess/types";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "@/domain/chess/rules/general";
import { TeamType } from "@/domain/chess/types";
import { samePosition } from "@/domain/chess/utils";

export const kingMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  const dx = Math.sign(desiredPosition.x - initialPosition.x);
  const dy = Math.sign(desiredPosition.y - initialPosition.y);

  const passed: Position = {
    x: initialPosition.x + dx,
    y: initialPosition.y + dy,
  };

  if (samePosition(passed, desiredPosition)) {
    return tileIsEmptyOrOccupiedByOpponent(passed, boardState, team);
  }

  return false;
};

export const getPossibleKingMoves = (
  king: Piece,
  boardstate: Piece[]
): Position[] => {
  const moves: Position[] = [];

  const directions = [
    [0, 1], [0, -1], [-1, 0], [1, 0],
    [1, 1], [1, -1], [-1, -1], [-1, 1],
  ];

  for (const [dx, dy] of directions) {
    const dest: Position = {
      x: king.position.x + dx,
      y: king.position.y + dy,
    };

    if (dest.x < 0 || dest.x > 7 || dest.y < 0 || dest.y > 7) continue;

    if (!tileIsOccupied(dest, boardstate)) {
      moves.push(dest);
    } else if (
      tileIsOccupiedByOpponent(dest, boardstate, king.team)
    ) {
      moves.push(dest);
    }
  }

  return moves;
};

// キャスリング
export const getCastingMoves = (
  king: Piece,
  boardstate: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  if (king.hasMoved) return possibleMoves;

  const rooks = boardstate.filter(
    p => p.type === PieceType.ROOK && p.team === king.team && !p.hasMoved
  );

  for (const rook of rooks) {
    const direction = king.position.x > rook.position.x ? 1 : -1;

    const adjacent: Position = {
      x: king.position.x - direction,
      y: king.position.y,
    };

    if (
      !rook.possibleMoves.some(m => samePosition(m, adjacent))
    )
      continue;

    const tilesBetween = rook.possibleMoves.filter(
      m => m.y === king.position.y
    );

    const enemies = boardstate.filter(p => p.team !== king.team);

    const safe = enemies.every(enemy =>
      enemy.possibleMoves.every(
        move => !tilesBetween.some(t => samePosition(t, move))
      )
    );

    if (!safe) continue;

    possibleMoves.push({ ...rook.position });
  }

  return possibleMoves;
};