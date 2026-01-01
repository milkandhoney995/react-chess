import { Piece } from "@/domain/chess/types";

export function cloneBoard(pieces: Piece[]) {
  return pieces.map(piece => ({
    ...piece,
    position: { ...piece.position },
    possibleMoves: piece.possibleMoves
      ? piece.possibleMoves.map(m => ({ ...m }))
      : [],
  }));
}