export enum PieceType {
  PAWN = 'pawn',
  BISHOP = 'bishop',
  KNIGHT = 'knight',
  ROOK = 'rook',
  QUEEN = 'queen',
  KING = 'king'
}

export enum TeamType {
  OPPONENT = 'b',
  OUR = 'w'
}

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  id: string;
  position: Position;
  type: PieceType;
  team: TeamType;
  hasMoved: boolean;
  isPawn?: boolean;
  possibleMoves: Position[];
  enPassant?: boolean;
}