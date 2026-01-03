import { Piece, Position } from "@/domain/chess/types";
import { TeamType } from "@/domain/chess/types";
import { samePosition } from "@/domain/chess/utils";

export const tileIsOccupied = (
  position: Position,
  board: Piece[]
): boolean =>
  board.some(p => samePosition(p.position, position));

export const tileIsOccupiedByOpponent = (
  position: Position,
  board: Piece[],
  team: TeamType
): boolean =>
  board.some(
    p => samePosition(p.position, position) && p.team !== team
  );

export const tileIsEmptyOrOccupiedByOpponent = (
  position: Position,
  board: Piece[],
  team: TeamType
): boolean =>
  !tileIsOccupied(position, board) ||
  tileIsOccupiedByOpponent(position, board, team);