import { useRef, useState } from "react";
import { DragState, Piece, Position } from "@/domain/chess/types";
import { GRID_SIZE } from "@/domain/chess/constants";

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
  const [dragState, setDragState] = useState<DragState | null>(null);

  const onPointerDown = (e: React.PointerEvent, piece: Piece) => {
    e.preventDefault();

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    setDragState({
      piece,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState) return;

    setDragState({
      ...dragState,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };

  const resetDrag = () => {
    setDragState(null);
    onDragEnd?.();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragState || !chessboardRef.current) {
      setDragState(null);
      return;
    }

    const boardRect = chessboardRef.current.getBoundingClientRect();
    const position = getBoardPosition(
      e.clientX,
      e.clientY,
      boardRect
    );

    onDrop(dragState.piece.id, position);
    resetDrag();
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