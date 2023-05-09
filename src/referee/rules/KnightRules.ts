import { Piece, TeamType, Position } from "../../Constants";
import { tileIsEmptyOrOccupiedByOpponent } from "../rules/GeneralRules";

export const knightMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  // moving logic
  // 8 different moving patterns
  for (let i = -1; i < 2; i+=2) {
    for (let j = -1; j < 2; j+=2) {
      // Top & bottom side movement
      if (desiredPosition.y - initialPosition.y === 2*i) {
        if (desiredPosition.x - initialPosition.x === j) {
          return tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team);
        }
      }

      // Right / Left movement
      if (desiredPosition.x - initialPosition.x === 2*i) {
        if (desiredPosition.y - initialPosition.y === j) {
          return tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team);
        }
      }
    }
  }
  return false;
}