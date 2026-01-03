import { Piece, PieceType, Position, TeamType } from "@/domain/chess/types";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "@/domain/chess/rules/general";
import { samePosition } from "@/domain/chess/utils";

/* =====================
   Public API
===================== */

export const getPossibleKingMoves = (
  king: Piece,
  board: Piece[]
): Position[] => {
  return [
    ...getAdjacentMoves(king, board),
    ...getCastlingMoves(king, board),
  ];
};

/* =====================
   King – Normal Moves
===================== */

const getAdjacentMoves = (
  king: Piece,
  board: Piece[]
): Position[] => {
  return KING_DIRECTIONS
    .map(([dx, dy]) => move(king.position, dx, dy))
    .filter(isInsideBoard)
    .filter(pos =>
      !tileIsOccupied(pos, board) ||
      tileIsOccupiedByOpponent(pos, board, king.team)
    );
};

/* =====================
   King – Castling
===================== */

const getCastlingMoves = (
  king: Piece,
  board: Piece[]
): Position[] => {
  if (king.hasMoved) return [];

  const rooks = board.filter(
    p =>
      p.type === PieceType.ROOK &&
      p.team === king.team &&
      !p.hasMoved
  );

  return rooks
    .filter(rook => canCastleWithRook(king, rook, board))
    .map(rook => ({ ...rook.position }));
};

const canCastleWithRook = (
  king: Piece,
  rook: Piece,
  board: Piece[]
): boolean => {
  const direction = king.position.x > rook.position.x ? 1 : -1;

  const adjacentToKing = move(king.position, -direction, 0);

  if (
    !rook.possibleMoves.some(m =>
      samePosition(m, adjacentToKing)
    )
  ) {
    return false;
  }

  const tilesBetween = rook.possibleMoves.filter(
    m => m.y === king.position.y
  );

  return isPathSafeFromEnemies(tilesBetween, king.team, board);
};

const isPathSafeFromEnemies = (
  path: Position[],
  team: TeamType,
  board: Piece[]
): boolean => {
  const enemies = board.filter(p => p.team !== team);

  return enemies.every(enemy =>
    enemy.possibleMoves.every(
      move => !path.some(tile => samePosition(tile, move))
    )
  );
};

/* =====================
   King Move Validation
   (used elsewhere)
===================== */

export const canKingMove = (
  from: Position,
  to: Position,
  team: TeamType,
  board: Piece[]
): boolean => {
  const dx = Math.sign(to.x - from.x);
  const dy = Math.sign(to.y - from.y);

  const next = move(from, dx, dy);

  if (!samePosition(next, to)) return false;

  return tileIsEmptyOrOccupiedByOpponent(next, board, team);
};

/* =====================
   Constants & Utilities
===================== */

const KING_DIRECTIONS: Direction[] = [
  [0, 1],
  [0, -1],
  [-1, 0],
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, -1],
  [-1, 1],
];

type Direction = [dx: number, dy: number];

const isInsideBoard = ({ x, y }: Position): boolean =>
  x >= 0 && x < 8 && y >= 0 && y < 8;

const move = (
  position: Position,
  dx: number,
  dy: number
): Position => ({
  x: position.x + dx,
  y: position.y + dy,
});