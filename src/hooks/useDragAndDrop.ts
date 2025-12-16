import { useState, useRef } from "react";
import { Piece, Position } from "@/models";
import { GRID_SIZE } from "@/Constants";

interface UseDragAndDropProps {
  playMove: (piece: Piece, position: Position) => boolean;
}

interface DragState {
  piece: Piece;
  pointerId: number;
  offsetX: number;
  offsetY: number;
  clientX: number;
  clientY: number;
}

const useDragAndDrop = ({ playMove }: UseDragAndDropProps) => {
  const chessboardRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);

  const onPointerDown = (e: React.PointerEvent, piece: Piece) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDragState({
      piece,
      pointerId: e.pointerId,
      offsetX,
      offsetY,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState || e.pointerId !== dragState.pointerId) return;

    setDragState(prev =>
      prev
        ? {
            ...prev,
            clientX: e.clientX,
            clientY: e.clientY,
          }
        : null
    );
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragState || !chessboardRef.current) return;

    e.currentTarget.releasePointerCapture(dragState.pointerId);

    const rect = chessboardRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / GRID_SIZE);
    const y = 7 - Math.floor((e.clientY - rect.top) / GRID_SIZE);

    playMove(dragState.piece.clone(), new Position(x, y));
    setDragState(null);
  };

  return {
    chessboardRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    dragState,
  };
};

export default useDragAndDrop;