import { Piece, PieceType, TeamType } from "@/domain/chess/types";

let idCounter = 0;
export const createId = () => `piece-${idCounter++}`;

export function createBoard(): Piece[] {
  const pieces: Piece[] = [];

  const backRank: PieceType[] = [
    PieceType.ROOK,
    PieceType.KNIGHT,
    PieceType.BISHOP,
    PieceType.QUEEN,
    PieceType.KING,
    PieceType.BISHOP,
    PieceType.KNIGHT,
    PieceType.ROOK,
  ];

  // OUR
  backRank.forEach((type, x) => {
    pieces.push({
      id: createId(),
      type,
      team: TeamType.OUR,
      position: { x, y: 0 },
      hasMoved: false,
      possibleMoves: [],
    });
  });

  for (let x = 0; x < 8; x++) {
    pieces.push({
      id: createId(),
      type: PieceType.PAWN,
      team: TeamType.OUR,
      position: { x, y: 1 },
      hasMoved: false,
      possibleMoves: [],
      enPassant: false,
    });
  }

  // OPPONENT
  backRank.forEach((type, x) => {
    pieces.push({
      id: createId(),
      type,
      team: TeamType.OPPONENT,
      position: { x, y: 7 },
      hasMoved: false,
      possibleMoves: [],
    });
  });

  for (let x = 0; x < 8; x++) {
    pieces.push({
      id: createId(),
      type: PieceType.PAWN,
      team: TeamType.OPPONENT,
      position: { x, y: 6 },
      hasMoved: false,
      possibleMoves: [],
      enPassant: false,
    });
  }

  return pieces;
}