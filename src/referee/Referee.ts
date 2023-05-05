import { Piece, PieceType, TeamType } from "@/components/Chessboard/Chessboard";

// px, px: previous position
// x, y: current position
// type: コマの種類
export default class Referee {
  tileIsOccupied(x: number, y: number, boardState: Piece[]) {
    const piece = boardState.find(p => p.x === x && p.y === y)
    if (piece) {
      return true;
    } else {
      return false;
    }
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
    console.log(`Previous location: (${px} ,${py})`)
    console.log(`current location: (${x} ,${y})`)
    console.log(`Piece type: ${type}`)
    console.log(`Team type: ${team}`)

    if (type === PieceType.PAWN) {
      const specialRow = (team === TeamType.OUR) ? 1 : 6;
      const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

      // はじめだけ、2マス進める
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

    }

    return false;
  }
}