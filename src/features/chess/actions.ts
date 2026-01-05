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