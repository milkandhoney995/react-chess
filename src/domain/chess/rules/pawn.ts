import { Piece, Position } from "@/domain/chess/types";
import { PieceType, TeamType } from "@/domain/chess/types";
import {
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "@/domain/chess/rules/general";
import { samePosition } from "@/domain/chess/utils";

/* =====================
   Public API
===================== */
export const getPossiblePawnMoves = (
  pawn: Piece,
  board: Piece[]
): Position[] => {
  return [
    ...getForwardMoves(pawn, board),
    ...getCaptureMoves(pawn, board),
    ...getEnPassantMoves(pawn, board),
  ];
};

/* =====================
   Helpers
===================== */

const getForwardMoves = (pawn: Piece, board: Piece[]): Position[] => {
  const moves: Position[] = [];
  const dir = getPawnDirection(pawn.team);

  const oneStep = move(pawn.position, 0, dir);
  if (tileIsOccupied(oneStep, board)) return moves;

  moves.push(oneStep);

  if (isPawnStartRow(pawn)) {
    const twoStep = move(pawn.position, 0, dir * 2);
    if (!tileIsOccupied(twoStep, board)) {
      moves.push(twoStep);
    }
  }

  return moves;
};

const getCaptureMoves = (pawn: Piece, board: Piece[]): Position[] => {
  const dir = getPawnDirection(pawn.team);

  return [-1, 1]
    .map(dx => move(pawn.position, dx, dir))
    .filter(pos =>
      tileIsOccupiedByOpponent(pos, board, pawn.team)
    );
};

const getEnPassantMoves = (pawn: Piece, board: Piece[]): Position[] => {
  const dir = getPawnDirection(pawn.team);

  return [-1, 1]
    .map(dx => {
      const side = board.find(p =>
        samePosition(p.position, move(pawn.position, dx, 0))
      );

      if (side?.type === PieceType.PAWN && side.enPassant) {
        return move(pawn.position, dx, dir);
      }
      return null;
    })
    .filter((p): p is Position => p !== null);
};

/* =====================
   Domain Utilities
===================== */

const getPawnDirection = (team: TeamType): number =>
  team === TeamType.OUR ? 1 : -1;

const isPawnStartRow = (pawn: Piece): boolean =>
  pawn.position.y === (pawn.team === TeamType.OUR ? 1 : 6);

const move = (
  position: Position,
  dx: number,
  dy: number
): Position => ({
  x: position.x + dx,
  y: position.y + dy,
});