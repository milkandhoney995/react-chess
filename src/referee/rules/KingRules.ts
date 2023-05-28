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

// In this method the enemy moves have already been calculated
export const getCastingMoves = (
  king: Piece, boardstate: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  if (king.hasMoved) return possibleMoves;

  // We get the rooks from the king's team which haven't moved
  const rooks = boardstate.filter(p => p.isRook
    && p.team === king.team && !p.hasMoved);

  // Loop through the rooks
  for (const rook of rooks) {
    // Determine if we need to go ro the right or the left side
    const direction = (king.position.x - rook.position.x > 0) ? 1 : -1;

    const adjacentPosition = king.position.clone();
    adjacentPosition.x -= direction;

    if (!rook.possibleMoves?.some(m => m.samePosition(adjacentPosition))) continue;

    // We know that the rook can move to the adjacent side of the king
    const concerningTiles = rook.possibleMoves.filter(m => m.y == king.position.y)

    // checking if any of the enemy pieces can attack the spaces between
    // the rook and the king
    const enemyPieces = boardstate.filter(p => p.team !== king.team);
    let valid = true;

    for (const enemy of enemyPieces) {
      if (enemy.possibleMoves === undefined) continue;

      for (const move of enemy.possibleMoves) {
        if (concerningTiles.some(t => t.samePosition(move))) {
          valid = false;
        }

        if (!valid) break;
      }

      if (!valid) break;
    }

    // Same as upper one.
    // if (enemyPieces.some(p => p.possibleMoves?.some(m => concerningTiles.some(t => t.samePosition(m))))) continue;

    if (!valid) continue;

    // We now want to add it as a possible move!
    possibleMoves.push(rook.position.clone());
  }
  return possibleMoves
}