import { Piece } from "@/domain/chess/types";

export type ChessUIAction =
  | {
      type: "DRAG_START";
      payload: {
        piece: Piece;
        offsetX: number;
        offsetY: number;
        clientX: number;
        clientY: number;
      };
    }
  | {
      type: "DRAG_MOVE";
      payload: {
        clientX: number;
        clientY: number;
      };
    }
  | { type: "DRAG_END" }
  | { type: "DRAG_CANCEL" };