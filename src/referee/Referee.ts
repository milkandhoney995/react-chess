import { PieceType, TeamType } from "@/components/Chessboard/Chessboard";

// px, px: previous position
// x, y: current position
// type: コマの種類
export default class Referee {
  isValidMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType) {
    console.log(`Previous location: (${px} ,${py})`)
    console.log(`current location: (${x} ,${y})`)
    console.log(`Piece type: ${type}`)
    console.log(`Team type: ${team}`)

    if (type === PieceType.PAWN) {
      if (team === TeamType.OUR) {
        console.log("our")
        // はじめだけ、2マス進める
        if (py === 1) {
          // move 1 square: Pawn needs to stay in the same column
          if (px === x && (y - py === 1 || y - py === 2)) {
            console.log("1回目");
            return true;
          }
        } else {
          if (px === x && y - py === 1 ) {
            console.log("2回目");
            return true;
          }
        }
      }
    }
    return true;
  }
}