'use client';

import classes from "@/components/chess/Chessboard/Chessboard.module.scss";
import { VERTICAL_AXIS, HORIZONTAL_AXIS } from "@/domain/chess/constants";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import { CSSProperties } from "react";
import Square from "@/components/chess/Square/Square";
import { samePosition, samePiecePosition } from "@/domain/chess/utils";
import { Piece, Position } from "@/domain/chess/types";

interface Props {
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[];
  draggingPiece?: Piece | null;
  onPieceClick: (piece: Piece) => void;
}

const Chessboard = ({ playMove, pieces, draggingPiece, onPieceClick }: Props) => {
  const { onPointerDown, onPointerMove, onPointerUp, chessboardRef, dragState } =
    useDragAndDrop({ playMove, setDraggingPiece: () => {} });

  return (
    <div
      ref={chessboardRef}
      className={classes.chessboard}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {VERTICAL_AXIS.map((_, yIndex) =>
        HORIZONTAL_AXIS.map((_, x) => {
          const position: Position = { x, y: 7 - yIndex };
          const piece = pieces.find(p => samePosition(p.position, position));

          const isDragging = !!dragState && piece && samePiecePosition(dragState.piece, piece);

          const pieceStyle: CSSProperties | undefined = isDragging && dragState ? {
            position: "fixed",
            left: dragState.clientX - dragState.offsetX,
            top: dragState.clientY - dragState.offsetY,
            zIndex: 1000,
            pointerEvents: "none",
          } : undefined;

          // ハイライト判定
          const highlight = draggingPiece?.possibleMoves?.some(m => samePosition(m, position));

          return (
            <Square
              key={`${x}-${yIndex}`}
              piece={piece}
              number={x + yIndex + 2}
              highlight={!!highlight}
              pieceStyle={pieceStyle}
              onPointerDown={(e, p) => { onPointerDown(e, p); onPieceClick(p); }}
            />
          );
        })
      )}
    </div>
  );
};

export default Chessboard;