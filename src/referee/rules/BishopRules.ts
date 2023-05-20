import { Piece, TeamType, Position, samePosition } from "../../Constants";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "../rules/GeneralRules";

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
      let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y + i};
      // Check if the tile is the destination tile
      if (samePosition(passedPosition, desiredPosition)) {
        // dealing with the destination tile
        if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
      } else {
        // dealing with pasing tile
        if (tileIsOccupied(passedPosition, boardState)) { break; }
      }
    }

    // Bottom right
    if (desiredPosition.x > initialPosition.x && desiredPosition.y < initialPosition.y) {
      let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y - i};
      // Check if the tile is the destination tile
      if (samePosition(passedPosition, desiredPosition)) {
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
      let passedPosition: Position = {x: initialPosition.x - i, y: initialPosition.y - i};
      // Check if the tile is the destination tile
      if (samePosition(passedPosition, desiredPosition)) {
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
      let passedPosition: Position = {x: initialPosition.x - i, y: initialPosition.y + i};
      // Check if the tile is the destination tile
      if (samePosition(passedPosition, desiredPosition)) {
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
   const destination: Position = { x: bishop.position.x + i, y: bishop.position.y + i };
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
   const destination: Position = { x: bishop.position.x + i, y: bishop.position.y - i };
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
   const destination: Position = { x: bishop.position.x - i, y: bishop.position.y - i };
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
   const destination: Position = { x: bishop.position.x - i, y: bishop.position.y + i };
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