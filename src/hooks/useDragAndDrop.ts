import { useState, useRef } from "react";
import { Piece, Position } from "@/domain/chess/types";
import { GRID_SIZE } from "@/domain/chess/constants";

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
    setDragState({
      piece,
      pointerId: e.pointerId,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState || e.pointerId !== dragState.pointerId) return;
    setDragState({ ...dragState, clientX: e.clientX, clientY: e.clientY });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragState || !chessboardRef.current) return;

    const rect = chessboardRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / GRID_SIZE);
    const y = 7 - Math.floor((e.clientY - rect.top) / GRID_SIZE);

    playMove({ ...dragState.piece }, { x, y });
    setDragState(null);
  };

  return { chessboardRef, onPointerDown, onPointerMove, onPointerUp, dragState };
};

export default useDragAndDrop;