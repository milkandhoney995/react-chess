import { useRef, useState } from "react";
import { Piece, Position } from "@/domain/chess/types";
import { GRID_SIZE } from "@/domain/chess/constants";

interface DragState {
  piece: Piece;
  offsetX: number;
  offsetY: number;
  clientX: number;
  clientY: number;
}

interface Props {
  onDrop: (pieceId: string, position: Position) => void;
  onDragEnd?: () => void;
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

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

    setDragState(prev =>
      prev ? { ...prev, clientX: e.clientX, clientY: e.clientY } : null
    );
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragState || !chessboardRef.current) {
      setDragState(null);
      return;
    }

    const rect = chessboardRef.current.getBoundingClientRect();

    const x = clamp(
      Math.floor((e.clientX - rect.left) / GRID_SIZE),
      0,
      7
    );

    const y = clamp(
      7 - Math.floor((e.clientY - rect.top) / GRID_SIZE),
      0,
      7
    );

    onDrop(dragState.piece.id, { x, y });

    setDragState(null);
    onDragEnd?.();
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