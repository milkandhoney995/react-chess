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

export const getPossibleKnightMoves = (
  knight: Piece, boardstate: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  for (let i = -1; i < 2; i+=2) {
    for (let j = -1; j < 2; j+=2) {
      const verticalMove: Position = { x: knight.position.x + j, y: knight.position.y + i*2 }
      const horizontalMove: Position = { x: knight.position.x + i*2 , y: knight.position.y + j}

      if (tileIsEmptyOrOccupiedByOpponent(verticalMove, boardstate, knight.team)) {
        possibleMoves.push(verticalMove);
      }
      if (tileIsEmptyOrOccupiedByOpponent(horizontalMove, boardstate, knight.team)) {
        possibleMoves.push(horizontalMove);
      }

    }
  }

  return possibleMoves;
}