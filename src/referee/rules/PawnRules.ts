import { Piece, TeamType, Position } from "../../Constants";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "../rules/GeneralRules";

export const pawnMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  const specialRow = (team === TeamType.OUR) ? 1 : 6;
  const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

  // Movement logic：はじめだけ、2マス進める
  if (initialPosition.x === desiredPosition.x && initialPosition.y === specialRow && desiredPosition.y - initialPosition.y === 2*pawnDirection) {
    if (
      !tileIsOccupied(desiredPosition, boardState) &&
      !tileIsOccupied({x: desiredPosition.x, y: desiredPosition.y - pawnDirection}, boardState)
    ) {
      return true;
    }
  // move 1 square: Pawn needs to stay in the same column
  } else if (initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === pawnDirection) {
    if (!tileIsOccupied(desiredPosition, boardState)) {
      return true;
    }
  }

  // Attack logic
  else if (desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition.y === pawnDirection) {
    // Attack in uper/bottom left corner
    if (tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
      return true
    }
  }
  else if (desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition.y === pawnDirection) {
    // Attack in uper/bottom right corner
    if (tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
      return true
    }
  }

  return false;
}