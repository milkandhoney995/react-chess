import { Piece, Position } from "@/models";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";
import { TeamType } from "@/Types";

export const kingMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  // Kingは1コマしか動けない
  for (let i = 1; i < 2; i++) {
    // Diagonal
    let multiplierX = (desiredPosition.x < initialPosition.x) ? -1 : (desiredPosition.x > initialPosition.x) ? 1 : 0;
    let multiplierY = (desiredPosition.y < initialPosition.y) ? -1 : (desiredPosition.y > initialPosition.y) ? 1 : 0;

    let passedPosition = new Position(initialPosition.x + (i * multiplierX), initialPosition.y + (i * multiplierY));
    // Check if the tile is the destination tile
    if (passedPosition.samePosition(desiredPosition)) {
      if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
    } else {
      if (tileIsOccupied(passedPosition, boardState)) { break; }
    }
  }
  return false;
}

export const getPossibleKingMoves = (
  king: Piece, boardstate: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  // Copied from QueenRule
  // top movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x, king.position.y + i);

    if (!tileIsOccupied(destination, boardstate)) {
      possibleMoves.push(destination)
     } else if (tileIsOccupiedByOpponent(destination, boardstate, king.team)) {
      possibleMoves.push(destination);
      break;
     } else {
      break;
     }
  }

  // Bottom movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x, king.position.y - i);

    if (!tileIsOccupied(destination, boardstate)) {
      possibleMoves.push(destination)
     } else if (tileIsOccupiedByOpponent(destination, boardstate, king.team)) {
      possibleMoves.push(destination);
      break;
     } else {
      break;
     }
  }

  // Left movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x - i, king.position.y);

    if (!tileIsOccupied(destination, boardstate)) {
      possibleMoves.push(destination)
     } else if (tileIsOccupiedByOpponent(destination, boardstate, king.team)) {
      possibleMoves.push(destination);
      break;
     } else {
      break;
     }
  }

  // Right movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x + i, king.position.y);

    if (!tileIsOccupied(destination, boardstate)) {
      possibleMoves.push(destination)
     } else if (tileIsOccupiedByOpponent(destination, boardstate, king.team)) {
      possibleMoves.push(destination);
      break;
     } else {
      break;
     }
  }

  // Up right
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x + i, king.position.y + i);
    if (!tileIsOccupied(destination, boardstate)) {
     possibleMoves.push(destination)
    } else if (tileIsOccupiedByOpponent(destination, boardstate, king.team)) {
     possibleMoves.push(destination);
     break;
    } else {
     break;
    }
  }
 
   // Bottom right
   for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x + i, king.position.y - i);
    if (!tileIsOccupied(destination, boardstate)) {
     possibleMoves.push(destination)
    } else if (tileIsOccupiedByOpponent(destination, boardstate, king.team)) {
     possibleMoves.push(destination);
     break;
    } else {
     break;
    }
  }
 
   // Bottom Left
   for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x - i, king.position.y - i);
    if (!tileIsOccupied(destination, boardstate)) {
     possibleMoves.push(destination)
    } else if (tileIsOccupiedByOpponent(destination, boardstate, king.team)) {
     possibleMoves.push(destination);
     break;
    } else {
     break;
    }
  }
 
   // Up left
   for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x - i, king.position.y + i);
    if (!tileIsOccupied(destination, boardstate)) {
     possibleMoves.push(destination)
    } else if (tileIsOccupiedByOpponent(destination, boardstate, king.team)) {
     possibleMoves.push(destination);
     break;
    } else {
     break;
    }
  }
  return possibleMoves;
}