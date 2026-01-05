import { useReducer, useRef } from "react";
import { Piece, Position } from "@/domain/chess/types";
import { GRID_SIZE } from "@/domain/chess/constants";
import {
  chessUIReducer,
  initialChessUIState,
} from "@/features/chess/ui/reducer";

interface Props {
  onDrop: (pieceId: string, position: Position) => void;
  onDragEnd?: () => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * クライアント座標 → チェス盤座標に変換
 * @param clientX
 * @param clientY
 * @param boardRect
*/
const getBoardPosition = (
  clientX: number,
  clientY: number,
  boardRect: DOMRect
): Position => {
  const x = clamp(Math.floor((clientX - boardRect.left) / GRID_SIZE), 0, 7);
  const y = clamp(7 - Math.floor((clientY - boardRect.top) / GRID_SIZE), 0, 7);

  return { x, y };
};

const useDragAndDrop = ({ onDrop, onDragEnd }: Props) => {
  const chessboardRef = useRef<HTMLDivElement>(null);
  const [uiState, dispatch] = useReducer(chessUIReducer, initialChessUIState);

  const dragState = uiState.drag;

  const onPointerDown = (e: React.PointerEvent, piece: Piece) => {
    e.preventDefault();

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    dispatch({
      type: "DRAG_START",
      payload: {
        piece,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        clientX: e.clientX,
        clientY: e.clientY,
      },
    });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState) return;

    dispatch({
      type: "DRAG_MOVE",
      payload: {
        clientX: e.clientX,
        clientY: e.clientY,
      },
    });
  };

  const finishDrag = () => {
    dispatch({ type: "DRAG_END" });
    onDragEnd?.();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragState || !chessboardRef.current) {
      finishDrag();
      return;
    }

    const rect = chessboardRef.current.getBoundingClientRect();
    const position = getBoardPosition(e.clientX, e.clientY, rect);

    onDrop(dragState.piece.id, position);
    finishDrag();
  };

  return {
    chessboardRef,
    dragState,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
};

export default useDragAndDrop;