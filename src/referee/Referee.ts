import { Piece, PieceType, TeamType, Position, samePosition } from "../Constants";

// px, px: previous position
// x, y: current position
// type: コマの種類
export default class Referee {
  tileIsEmptyOrOccupiedByOpponent(
    position: Position,
    boardState: Piece[],
    team: TeamType
  ): boolean {
    return !this.tileIsOccupied(position, boardState) ||
      this.tileIsOccupiedByOpponent(position, boardState, team)
  }

  tileIsOccupied(position: Position, boardState: Piece[]): boolean {
    const piece = boardState.find(
      p => samePosition(p.position, position)
    )
    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  tileIsOccupiedByOpponent(position: Position, boardState: Piece[], team: TeamType): boolean {
    const piece = boardState.find(
      (p) => samePosition(p.position, position) && p.team !== team
    );

    if (piece) {
      return true;
    } else {
      return false;
    }
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

  pawnMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    const specialRow = (team === TeamType.OUR) ? 1 : 6;
    const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

    // Movement logic：はじめだけ、2マス進める
    if (initialPosition.x === desiredPosition.x && initialPosition.y === specialRow && desiredPosition.y - initialPosition.y === 2*pawnDirection) {
      if (
        !this.tileIsOccupied(desiredPosition, boardState) &&
        !this.tileIsOccupied({x: desiredPosition.x, y: desiredPosition.y - pawnDirection}, boardState)
      ) {
        return true;
      }
    // move 1 square: Pawn needs to stay in the same column
    } else if (initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === pawnDirection) {
      if (!this.tileIsOccupied(desiredPosition, boardState)) {
        return true;
      }
    }

    // Attack logic
    else if (desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition.y === pawnDirection) {
      // Attack in uper/bottom left corner
      if (this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
        return true
      }
    }
    else if (desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition.y === pawnDirection) {
      // Attack in uper/bottom right corner
      if (this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
        return true
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
      console.log(`i value: ${i}`)
       // Up right
      if (desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y) {
        let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y + i};
        // Check if the tile is the destination tile
        if (samePosition(passedPosition, desiredPosition)) {
          // dealing with the destination tile
          if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
        } else {
          // dealing with pasing tile
          if (this.tileIsOccupied(passedPosition, boardState)) { break; }
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
          if (this.tileIsOccupied(passedPosition, boardState)) { break; }
        }
        if (this.tileIsOccupied(passedPosition, boardState)) {
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
          if (this.tileIsOccupied(passedPosition, boardState)) { break; }
        }
        if (this.tileIsOccupied(passedPosition, boardState)) {
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
          if (this.tileIsOccupied(passedPosition, boardState)) { break; }
        }
        if (this.tileIsOccupied(passedPosition, boardState)) {
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
      console.log("Moving vertically")

      for (let i = 1; i < 8; i++) {
        let multiplier = (desiredPosition.y < initialPosition.y) ? -1 : 1;

        let passedPosition: Position = {x: initialPosition.x, y: initialPosition.y + (i*multiplier)};
        if (samePosition(passedPosition, desiredPosition)) {
          if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
        } else {
          if (this.tileIsOccupied(passedPosition, boardState)) { break; }
        }
      }
    }
    if (initialPosition.y === desiredPosition.y) {
      console.log("Moving horizontally")

      for (let i = 1; i < 8; i++) {
        let multiplier = (desiredPosition.x < initialPosition.x) ? -1 : 1;

        let passedPosition: Position = {x: initialPosition.x + (i*multiplier), y: initialPosition.y};
        if (samePosition(passedPosition, desiredPosition)) {
          if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
          console.log("Arrive");
        } else {
          if (this.tileIsOccupied(passedPosition, boardState)) { break; }
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
      let multiplierX; // Vertical multiplier
      if (desiredPosition.x < initialPosition.x) { multiplierX = -1; }
      else if (desiredPosition.x > initialPosition.x) { multiplierX = 1; }
      else { multiplierX = 0; }

      let multiplierY; // Horizontal multiplier
      if (desiredPosition.y < initialPosition.y) { multiplierY = -1; }
      else if (desiredPosition.y > initialPosition.y) { multiplierY = 1; }
      else { multiplierY = 0; }
  
      let passedPosition: Position = {x: initialPosition.x + (i * multiplierX), y: initialPosition.y + (i * multiplierY)};
      // Check if the tile is the destination tile
      if (samePosition(passedPosition, desiredPosition)) {
        if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) { return true; }
      } else {
        if (this.tileIsOccupied(passedPosition, boardState)) { break; }
      }
    }
    return false;
  }

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
        validMode = this.pawnMove(initialPosition, desiredPosition, team, boardState)
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
        validMode = this.queenMove(initialPosition, desiredPosition, team, boardState);
        break;
    }

    return validMode;
  }
}