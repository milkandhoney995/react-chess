import { Piece, Position } from "@/models";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "@/domain/chess/rules/general";
import { TeamType } from "@/domain/chess/types";

export const bishopMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  // Movement and attack logic
  for (let i = 1; i < 8; i++) {
     // Up right
    if (desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y) {
      let passedPosition = new Position(initialPosition.x + i, initialPosition.y + i);
      // Check if the tile is the destination tile
      if (passedPosition.samePosition(desiredPosition)) {
        // dealing with the destination tile
        if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
      } else {
        // dealing with pasing tile
        if (tileIsOccupied(passedPosition, boardState)) { break; }
      }
    }

    // Bottom right
    if (desiredPosition.x > initialPosition.x && desiredPosition.y < initialPosition.y) {
      let passedPosition = new Position(initialPosition.x + i, initialPosition.y - i);
      // Check if the tile is the destination tile
      if (passedPosition.samePosition(desiredPosition)) {
        // dealing with the destination tile
        if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
      } else {
        // dealing with pasing tile
        if (tileIsOccupied(passedPosition, boardState)) { break; }
      }
      if (tileIsOccupied(passedPosition, boardState)) {
        break; // illgal move
      }
    }

    // Bottom left
    if (desiredPosition.x < initialPosition.x && desiredPosition.y < initialPosition.y) {
      let passedPosition = new Position(initialPosition.x - i, initialPosition.y - i);
      // Check if the tile is the destination tile
      if (passedPosition.samePosition(desiredPosition)) {
        // dealing with the destination tile
        if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
      } else {
        // dealing with pasing tile
        if (tileIsOccupied(passedPosition, boardState)) { break; }
      }
      if (tileIsOccupied(passedPosition, boardState)) {
        break; // illgal move
      }
    }
    // Top left
    if (desiredPosition.x < initialPosition.x && desiredPosition.y > initialPosition.y) {
      let passedPosition = new Position(initialPosition.x - i, initialPosition.y + i);
      // Check if the tile is the destination tile
      if (passedPosition.samePosition(desiredPosition)) {
        // dealing with the destination tile
        if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
      } else {
        // dealing with pasing tile
        if (tileIsOccupied(passedPosition, boardState)) { break; }
      }
      if (tileIsOccupied(passedPosition, boardState)) {
        break; // illgal move
      }
    }
  }
  return false;
}

export const getPossibleBishopMoves = (
  bishop: Piece, boardstate: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  // Up right
  for (let i = 1; i < 8; i++) {
   const destination = new Position(bishop.position.x + i, bishop.position.y + i);
   if (!tileIsOccupied(destination, boardstate)) {
    possibleMoves.push(destination)
   } else if (tileIsOccupiedByOpponent(destination, boardstate, bishop.team)) {
    possibleMoves.push(destination);
    break;
   } else {
    break;
   }
 }

  // Bottom right
  for (let i = 1; i < 8; i++) {
   const destination = new Position(bishop.position.x + i, bishop.position.y - i);
   if (!tileIsOccupied(destination, boardstate)) {
    possibleMoves.push(destination)
   } else if (tileIsOccupiedByOpponent(destination, boardstate, bishop.team)) {
    possibleMoves.push(destination);
    break;
   } else {
    break;
   }
 }

  // Bottom Left
  for (let i = 1; i < 8; i++) {
   const destination = new Position(bishop.position.x - i, bishop.position.y - i);
   if (!tileIsOccupied(destination, boardstate)) {
    possibleMoves.push(destination)
   } else if (tileIsOccupiedByOpponent(destination, boardstate, bishop.team)) {
    possibleMoves.push(destination);
    break;
   } else {
    break;
   }
 }

  // Up left
  for (let i = 1; i < 8; i++) {
   const destination = new Position(bishop.position.x - i, bishop.position.y + i);
   if (!tileIsOccupied(destination, boardstate)) {
    possibleMoves.push(destination)
   } else if (tileIsOccupiedByOpponent(destination, boardstate, bishop.team)) {
    possibleMoves.push(destination);
    break;
   } else {
    break;
   }
 }

  return possibleMoves;
}