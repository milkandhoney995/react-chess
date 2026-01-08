import { Piece, PieceType, Position, TeamType } from "@/domain/chess/types";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
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
      tileIsEmptyOrOccupiedByOpponent(pos, board, king.team)
    )
    .filter(pos => !isSquareAttacked(pos, king.team, board));
};

/* =====================
   King – Castling
===================== */

const getCastlingMoves = (
  king: Piece,
  board: Piece[]
): Position[] => {
  if (king.hasMoved) return [];

  // 現在チェックされているなら不可
  if (isSquareAttacked(king.position, king.team, board)) {
    return [];
  }

  const moves: Position[] = [];
  const y = king.position.y;

  // キングサイド
  if (canCastle(king, board, "king")) {
    moves.push({ x: king.position.x + 2, y });
  }

  // クイーンサイド
  if (canCastle(king, board, "queen")) {
    moves.push({ x: king.position.x - 2, y });
  }

  return moves;
};

const canCastle = (
  king: Piece,
  board: Piece[],
  side: "king" | "queen"
): boolean => {
  const y = king.position.y;
  const rookX = side === "king" ? 7 : 0;
  const direction = side === "king" ? 1 : -1;

  const rook = board.find(
    p =>
      p.type === PieceType.ROOK &&
      p.team === king.team &&
      !p.hasMoved &&
      p.position.x === rookX &&
      p.position.y === y
  );

  if (!rook) return false;

  // キングとルークの間のマス
  const between: Position[] = [];
  for (
    let x = king.position.x + direction;
    x !== rookX;
    x += direction
  ) {
    between.push({ x, y });
  }

  // 間に駒があれば不可
  if (between.some(pos => tileIsOccupied(pos, board))) {
    return false;
  }

  // キングが通過・到達するマス
  const kingPath: Position[] = [
    { x: king.position.x + direction, y },
    { x: king.position.x + direction * 2, y },
  ];

  // 通過・到達マスが攻撃されていたら不可
  if (
    kingPath.some(pos =>
      isSquareAttacked(pos, king.team, board)
    )
  ) {
    return false;
  }

  return true;
};

/* =====================
   Square Attack Check
===================== */

const isSquareAttacked = (
  square: Position,
  team: TeamType,
  board: Piece[]
): boolean => {
  const enemies = board.filter(p => p.team !== team);

  return enemies.some(enemy =>
    enemy.possibleMoves.some(move =>
      samePosition(move, square)
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

  // Castling（横に2マス）
  if (Math.abs(to.x - from.x) === 2 && dy === 0) {
    const king = board.find(
      p =>
        p.type === PieceType.KING &&
        p.team === team &&
        samePosition(p.position, from)
    );
    if (!king) return false;

    return getCastlingMoves(king, board).some(pos =>
      samePosition(pos, to)
    );
  }

  // 通常移動（1マス）
  const next = move(from, dx, dy);
  if (!samePosition(next, to)) return false;

  if (!tileIsEmptyOrOccupiedByOpponent(next, board, team)) return false;

  // 移動先が攻撃されていないか
  return !isSquareAttacked(next, team, board);
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

/**
 * 指定した位置が盤内かどうか
 * @param position 確認する位置
 * @return 盤内であれば true、盤外であれば false
*/
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