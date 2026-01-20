import { PieceType, Position } from "@/domain/chess/types";

export type ChessAction =
  | {
      type: "MOVE_PIECE";
      payload: {
        pieceId: string;
        to: Position;
      };
    }
  | {
      type: "PROMOTE_PAWN";
      payload: {
        position: Position;
        pieceType: PieceType;
      };
    }
  | { type: "RESET_GAME" };


export const movePieceAction = (
  pieceId: string,
  to: Position
): ChessAction => ({
  type: "MOVE_PIECE",
  payload: { pieceId, to },
});

export const promotePawn = (
  position: Position,
  pieceType: PieceType
): ChessAction => ({
  type: "PROMOTE_PAWN",
  payload: { position, pieceType },
});

export const resetGame = (): ChessAction => ({
  type: "RESET_GAME",
});