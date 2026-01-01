import { Position } from "@/domain/chess/types";

export type ChessAction =
  | {
      type: "MOVE_PIECE";
      payload: {
        from: Position;
        to: Position;
      };
    }
  | { type: "NEXT_TURN" };