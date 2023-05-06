export const VERTICAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const HORIZONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const GRID_SIZE = 100;

export function samePosition(p1: Position, p2:Position) {
  return p1.x === p2.x && p1.y === p2.y
}

export interface Position {
  x: number;
  y: number
}

export enum PieceType {
  PAWN,
  BISHOP,
  KNIGHT,
  ROOK,
  QUEEN,
  KING
}

export enum TeamType {
  OPPONENT,
  OUR
}

export interface Piece {
  image: string,
  position: Position,
  type: PieceType,
  team: TeamType,
  enPassant?: boolean
}

export const initialBoardState: Piece[] = [];

for (let p = 0; p < 2; p++) {
  const teamType = (p === 0) ? TeamType.OPPONENT : TeamType.OUR;
  const type = (teamType === TeamType.OPPONENT) ? "b" : "w";
  const y = (teamType === TeamType.OPPONENT) ? 7 : 0;

  initialBoardState.push({image: `/assets/images/rook_${type}.png`, position: {x: 0, y: y}, type: PieceType.ROOK, team: teamType});
  initialBoardState.push({image: `/assets/images/rook_${type}.png`, position: { x: 7, y: y}, type: PieceType.ROOK, team: teamType});
  initialBoardState.push({image: `/assets/images/knight_${type}.png`, position: {x: 1, y: y}, type: PieceType.KNIGHT, team: teamType });
  initialBoardState.push({image: `/assets/images/knight_${type}.png`, position: {x: 6, y: y}, type: PieceType.KNIGHT, team: teamType });
  initialBoardState.push({image: `/assets/images/bishop_${type}.png`, position: {x: 2, y: y}, type: PieceType.BISHOP, team: teamType });
  initialBoardState.push({image: `/assets/images/bishop_${type}.png`, position: {x: 5, y: y}, type: PieceType.BISHOP, team: teamType });
  initialBoardState.push({image: `/assets/images/queen_${type}.png`, position: {x: 3, y: y}, type: PieceType.QUEEN, team: teamType });
  initialBoardState.push({image: `/assets/images/king_${type}.png`, position: {x: 4, y: y}, type: PieceType.KING, team: teamType });
}

for (let i = 0; i < 8; i++) {
  initialBoardState.push({image: "/assets/images/pawn_b.png", position: {x: i, y: 6}, type: PieceType.PAWN, team: TeamType.OPPONENT })
}
for (let i = 0; i < 8; i++) {
  initialBoardState.push({image: "/assets/images/pawn_w.png", position: {x: i, y: 1}, type: PieceType.PAWN, team: TeamType.OUR })
}