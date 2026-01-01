import { Position } from "@/domain/chess/types";

export type ChessAction =
  | {
      type: "MOVE_PIECE";
      payload: {
        pieceId: string;
        to: Position;
      };
    }
  | { type: "RESET_GAME" };