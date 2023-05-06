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
  isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {

    if (type === PieceType.PAWN) {
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

    } else if (type === PieceType.KNIGHT) {
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
    } else if (type === PieceType.BISHOP) {
      // Movement and attack logic
      for (let i = 1; i < 8; i++) {
        console.log(`i value: ${i}`)
         // Up right
        if (desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y) {
          let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y + i};
          // Check if the tile is the destination tile
          if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
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
          if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
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
          if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
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
          if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
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
    } else if (type === PieceType.ROOK) {
      if (initialPosition.x === desiredPosition.x) {
        console.log("Moving vertically")

        for (let i = 1; i < 8; i++) {
          let multiplier = (desiredPosition.y < initialPosition.y) ? -1 : 1;

          let passedPosition: Position = {x: initialPosition.x, y: initialPosition.y + (i*multiplier)};
          if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
            console.log("Arrive");
            break;
          }
        }
      }
      if (initialPosition.y === desiredPosition.y) {
        console.log("Moving horizontally")

        for (let i = 1; i < 8; i++) {
          let multiplier = (desiredPosition.x < initialPosition.x) ? -1 : 1;

          let passedPosition: Position = {x: initialPosition.x + (i*multiplier), y: initialPosition.y};
          if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
            console.log("Arrive");
            break;
          }
        }
      }
    }

    return false;
  }
}