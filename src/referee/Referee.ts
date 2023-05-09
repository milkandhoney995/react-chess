import { Piece, PieceType, TeamType, Position, samePosition } from "../Constants";
import { pawnMove } from "./rules/PawnRules";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./rules/GeneralRules";

// px, px: previous position
// x, y: current position
// type: コマの種類
export default class Referee {
  tileIsEmptyOrOccupiedByOpponent(
    position: Position,
    boardState: Piece[],
    team: TeamType
  ): boolean {
    return !tileIsOccupied(position, boardState) ||
      tileIsOccupiedByOpponent(position, boardState, team)
  }


  isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      // Attack logic
      // Attack in upper left / upper right / || bottom left / bottom right corner
      if ((desiredPosition.x - initialPosition.x === -1 && desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === pawnDirection) {
        const piece = boardState.find(
          p =>
          p.position.x === desiredPosition.x &&
          p.position.y === desiredPosition.y - pawnDirection &&
          p.enPassant// If a piece is under / above the attacked tile
        );
        if (piece) {
          return true;
        }
      }
    }

    return false;
  }

  knightMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    // moving logic
    // 8 different moving patterns
    for (let i = -1; i < 2; i+=2) {
      for (let j = -1; j < 2; j+=2) {
        // Top & bottom side movement
        if (desiredPosition.y - initialPosition.y === 2*i) {
          if (desiredPosition.x - initialPosition.x === j) {
            return this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team);
          }
        }

        // Right / Left movement
        if (desiredPosition.x - initialPosition.x === 2*i) {
          if (desiredPosition.y - initialPosition.y === j) {
            return this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team);
          }
        }
      }
    }
    return false;
  }
  bishopMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    // Movement and attack logic
    for (let i = 1; i < 8; i++) {
       // Up right
      if (desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y) {
        let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y + i};
        // Check if the tile is the destination tile
        if (samePosition(passedPosition, desiredPosition)) {
          // dealing with the destination tile
          if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
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
          if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
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
          if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
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
          if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
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

  rookMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    if (initialPosition.x === desiredPosition.x) {

      for (let i = 1; i < 8; i++) {
        let multiplier = (desiredPosition.y < initialPosition.y) ? -1 : 1;

        let passedPosition: Position = {x: initialPosition.x, y: initialPosition.y + (i*multiplier)};
        if (samePosition(passedPosition, desiredPosition)) {
          if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
        } else {
          if (tileIsOccupied(passedPosition, boardState)) { break; }
        }
      }
    }
    if (initialPosition.y === desiredPosition.y) {

      for (let i = 1; i < 8; i++) {
        let multiplier = (desiredPosition.x < initialPosition.x) ? -1 : 1;

        let passedPosition: Position = {x: initialPosition.x + (i*multiplier), y: initialPosition.y};
        if (samePosition(passedPosition, desiredPosition)) {
          if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
        } else {
          if (tileIsOccupied(passedPosition, boardState)) { break; }
        }
      }
    }

    return false;
  }

  // Queen movement is the combination of the rook and bishop ones.
  queenMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {

    for (let i = 1; i < 8; i++) {
      // Diagonal
      let multiplierX = (desiredPosition.x < initialPosition.x) ? -1 : (desiredPosition.x > initialPosition.x) ? 1 : 0;
      let multiplierY = (desiredPosition.y < initialPosition.y) ? -1 : (desiredPosition.y > initialPosition.y) ? 1 : 0;

      let passedPosition: Position = {x: initialPosition.x + (i * multiplierX), y: initialPosition.y + (i * multiplierY)};
      // Check if the tile is the destination tile
      if (samePosition(passedPosition, desiredPosition)) {
        if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
      } else {
        if (tileIsOccupied(passedPosition, boardState)) { break; }
      }
    }
    return false;
  }

  kingMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    // Kingは1コマしか動けない
    for (let i = 1; i < 2; i++) {
      // Diagonal
      let multiplierX = (desiredPosition.x < initialPosition.x) ? -1 : (desiredPosition.x > initialPosition.x) ? 1 : 0;
      let multiplierY = (desiredPosition.y < initialPosition.y) ? -1 : (desiredPosition.y > initialPosition.y) ? 1 : 0;

      let passedPosition: Position = {x: initialPosition.x + (i * multiplierX), y: initialPosition.y + (i * multiplierY)};
      // Check if the tile is the destination tile
      if (samePosition(passedPosition, desiredPosition)) {
        if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
      } else {
        if (tileIsOccupied(passedPosition, boardState)) { break; }
      }
    }
    return false;
  }

  // Pawn Promotion
  // Prevention
  // Casting
  // checkmate
  // Add check
  // Add stalemate
  isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    let validMode = false;
    switch (type) {
      case PieceType.PAWN:
        validMode = pawnMove(initialPosition, desiredPosition, team, boardState)
        break;
      case PieceType.KNIGHT:
        validMode = this.knightMove(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.BISHOP:
        validMode = this.bishopMove(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.ROOK:
        validMode = this.rookMove(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.QUEEN:
        validMode = this.queenMove(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.KING:
        validMode = this.kingMove(initialPosition, desiredPosition, team, boardState);
        break;
    }

    return validMode;
  }
}