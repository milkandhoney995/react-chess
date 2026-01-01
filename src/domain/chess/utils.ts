import { Piece, PieceType, Position, TeamType } from "@/domain/chess/types";

// 位置比較
export function samePosition(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

// 駒同士の比較
export function samePiecePosition(a: Piece, b: Piece): boolean {
  return samePosition(a.position, b.position) && a.type === b.type && a.team === b.team;
}

// 駒の画像パスを取得
export function getPieceImage(piece: Piece): string {
  const teamChar = piece.team === TeamType.OUR ? "w" : "b";
  return `/assets/images/${piece.type.toLowerCase()}_${teamChar}.png`;
}

/** 勝利判定: 相手のキングがいなければ自分の勝ち */
export function checkWinningTeam(pieces: Piece[]): TeamType | undefined {
  const hasOurKing = pieces.some(p => p.type === PieceType.KING && p.team === TeamType.OUR);
  const hasOpponentKing = pieces.some(p => p.type === PieceType.KING && p.team === TeamType.OPPONENT);

  if (!hasOpponentKing && hasOurKing) return TeamType.OUR;
  if (!hasOurKing && hasOpponentKing) return TeamType.OPPONENT;
  return undefined;
}

// 駒の合法手計算（簡易版）
export function getPossibleMoves(piece: Piece): Position[] {
  const moves: Position[] = [];
  const { x, y } = piece.position;

  switch(piece.type) {
    case PieceType.PAWN:
      const dir = piece.team === TeamType.OUR ? 1 : -1;
      moves.push({ x, y: y + dir });
      break;
    case PieceType.KNIGHT:
      [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]].forEach(([dx,dy])=>{
        moves.push({ x: x+dx, y: y+dy });
      });
      break;
    case PieceType.BISHOP:
      for(let i=1;i<8;i++){
        moves.push({x:x+i, y:y+i}, {x:x-i, y:y+i}, {x:x+i, y:y-i}, {x:x-i, y:y-i});
      }
      break;
    case PieceType.ROOK:
      for(let i=1;i<8;i++){
        moves.push({x:x+i, y:y}, {x:x-i, y:y}, {x:x, y:y+i}, {x:x, y:y-i});
      }
      break;
    case PieceType.QUEEN:
      for(let i=1;i<8;i++){
        moves.push(
          {x:x+i, y:y}, {x:x-i, y:y}, {x:x, y:y+i}, {x:x, y:y-i},
          {x:x+i, y:y+i}, {x:x-i, y:y+i}, {x:x+i, y:y-i}, {x:x-i, y:y-i}
        );
      }
      break;
    case PieceType.KING:
      for(let dx=-1;dx<=1;dx++){
        for(let dy=-1;dy<=1;dy++){
          if(dx!==0 || dy!==0) moves.push({x:x+dx, y:y+dy});
        }
      }
      break;
  }

  // 盤面内に限定
  return moves.filter(p => p.x>=0 && p.x<8 && p.y>=0 && p.y<8);
}