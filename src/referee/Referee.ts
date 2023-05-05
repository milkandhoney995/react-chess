import { Piece, PieceType, TeamType } from "@/components/Chessboard/Chessboard";

// px, px: previous position
// x, y: current position
// type: コマの種類
export default class Referee {
  tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
    const piece = boardState.find(p => p.x === x && p.y === y)
    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  tileIsOccupiedByOpponent(x: number, y: number, boardState: Piece[], team: TeamType): boolean {
    const piece = boardState.find(
      (p) => p.x === x && p.y === y && p.team !== team
    );

    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  isEnPassantMove(
    px: number,
    py: number,
    x: number,
    y: number,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      // Attack logic
      // Attack in upper left / upper right / || bottom left / bottom right corner
      if ((x - px === -1 && x - px === 1) && y - py === pawnDirection) {
        const piece = boardState.find(
          p => p.x === x && p.y === y - pawnDirection && p.enPassant// If a piece is under / above the attacked tile
        );
        if (piece) {
          return true;
        }
      }
    }

    return false;
  }
  isValidMove(
    px: number,
    py: number,
    x: number,
    y: number,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    // console.log(`Previous location: (${px} ,${py})`)
    // console.log(`current location: (${x} ,${y})`)
    // console.log(`Piece type: ${type}`)
    // console.log(`Team type: ${team}`)

    if (type === PieceType.PAWN) {
      const specialRow = (team === TeamType.OUR) ? 1 : 6;
      const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

      // Movement logic：はじめだけ、2マス進める
      if (px === x && py === specialRow && y - py === 2*pawnDirection) {
        if (!this.tileIsOccupied(x, y, boardState) && !this.tileIsOccupied(x, y - pawnDirection, boardState)) {
          return true;
        }
      // move 1 square: Pawn needs to stay in the same column
      } else if (px === x && y - py === pawnDirection) {
        if (!this.tileIsOccupied(x, y, boardState)) {
          return true;
        }
      }

      // Attack logic
      else if (x - px === -1 && y - py === pawnDirection) {
        // Attack in uper/bottom left corner
        if (this.tileIsOccupiedByOpponent(x, y, boardState, team)) {
          return true
        }
      }
      else if (x - px === 1 && y - py === pawnDirection) {
        // Attack in uper/bottom right corner
        if (this.tileIsOccupiedByOpponent(x, y, boardState, team)) {
          return true
        }
      }

    }

    return false;
  }
}