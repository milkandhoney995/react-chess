import { DragState } from "@/domain/chess/types";
import { ChessUIAction } from "./actions";

export interface ChessUIState {
  drag: DragState | null;
}

export const initialChessUIState: ChessUIState = {
  drag: null,
};

export const chessUIReducer = (
  state: ChessUIState,
  action: ChessUIAction
): ChessUIState => {
  switch (action.type) {
    case "DRAG_START":
      return {
        ...state,
        drag: {
          piece: action.payload.piece,
          offsetX: action.payload.offsetX,
          offsetY: action.payload.offsetY,
          clientX: action.payload.clientX,
          clientY: action.payload.clientY,
        },
      };

    case "DRAG_MOVE":
      if (!state.drag) return state;
      return {
        ...state,
        drag: {
          ...state.drag,
          clientX: action.payload.clientX,
          clientY: action.payload.clientY,
        },
      };

    case "DRAG_END":
    case "DRAG_CANCEL":
      return {
        ...state,
        drag: null,
      };

    default:
      return state;
  }
};