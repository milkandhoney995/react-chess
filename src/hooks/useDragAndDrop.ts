import { useState, useRef } from 'react';
import { Piece, Position } from "@/models";
import { GRID_SIZE } from "@/Constants";

interface UseDragAndDropProps {
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[];
}

interface DragState {
  piece: Piece;
  mouseX: number;
  mouseY: number;
}

const useDragAndDrop = ({ playMove, pieces }: UseDragAndDropProps) => {
  const chessboardRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);

  const grabPiece = (e: React.MouseEvent) => {
    const element = (e.target as HTMLElement).closest("[data-piece='true']") as HTMLElement | null;
    if (!element || !chessboardRef.current) return;

    const rect = chessboardRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / GRID_SIZE);
    const y = 7 - Math.floor((e.clientY - rect.top) / GRID_SIZE);
    const piece = pieces.find(p => p.samePosition(new Position(x, y)));
    if (!piece) return;

    console.log("Clicked element:", element);
    console.log("Element classes:", element.classList);

    setDragState({
      piece,
      mouseX: e.clientX,
      mouseY: e.clientY,
    });
  };



  const movePiece = (e: React.MouseEvent) => {
    if (!dragState) return;

    setDragState(prev =>
      prev
        ? {
            ...prev,
            mouseX: e.clientX,
            mouseY: e.clientY,
          }
        : null
    );
  };

  const dropPiece = (e: React.MouseEvent) => {
    if (!dragState || !chessboardRef.current) return;

    const rect = chessboardRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / GRID_SIZE);
    const y = 7 - Math.floor((e.clientY - rect.top) / GRID_SIZE);

    playMove(dragState.piece.clone(), new Position(x, y));

    setDragState(null);
  };

  return {
    chessboardRef,
    grabPiece,
    movePiece,
    dropPiece,
    dragState,
  };
};

export default useDragAndDrop;