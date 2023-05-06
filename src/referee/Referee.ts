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
      // Top right
      for (let i = 1; i < 8; i++) {
        if (desiredPosition.x - initialPosition.x === i && desiredPosition.y - initialPosition.y === i) {
          console.log(`Top /right ${i} tile`)
          break;
        }
      }
      // Bottom right
      for (let i = 1; i < 8; i++) {
        if (desiredPosition.x - initialPosition.x === i && desiredPosition.y - initialPosition.y === -i) {
          console.log(`down /right ${i} tile`)
          break;
        }
      }
      // Bottom left
      for (let i = 1; i < 8; i++) {
        if (desiredPosition.x - initialPosition.x === -i && desiredPosition.y - initialPosition.y === -i) {
          console.log(`down /left ${i} tile`)
          break;
        }
      }
      // Top left
      for (let i = 1; i < 8; i++) {
        if (desiredPosition.x - initialPosition.x === -i && desiredPosition.y - initialPosition.y === i) {
          console.log(`down /left ${i} tile`)
          break;
        }
      }
    }

    return false;
  }
}