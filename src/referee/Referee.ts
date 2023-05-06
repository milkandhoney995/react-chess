import { Piece, PieceType, TeamType, Position } from "../Constants";

// px, px: previous position
// x, y: current position
// type: コマの種類
export default class Referee {
  tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
    const piece = boardState.find(p => p.position.x === x && p.position.y === y)
    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  tileIsOccupiedByOpponent(x: number, y: number, boardState: Piece[], team: TeamType): boolean {
    const piece = boardState.find(
      (p) => p.position.x === x && p.position.y === y && p.team !== team
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
          !this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState) &&
          !this.tileIsOccupied(desiredPosition.x, desiredPosition.y - pawnDirection, boardState)
        ) {
          return true;
        }
      // move 1 square: Pawn needs to stay in the same column
      } else if (initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === pawnDirection) {
        if (!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
          return true;
        }
      }

      // Attack logic
      else if (desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition.y === pawnDirection) {
        // Attack in uper/bottom left corner
        if (this.tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team)) {
          return true
        }
      }
      else if (desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition.y === pawnDirection) {
        // Attack in uper/bottom right corner
        if (this.tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team)) {
          return true
        }
      }

    }

    return false;
  }
}