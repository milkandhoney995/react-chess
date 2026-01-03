'use client';

import { CSSProperties } from "react";
import classes from "./Chessboard.module.scss";
import { VERTICAL_AXIS, HORIZONTAL_AXIS } from "@/domain/chess/constants";
import { Piece, Position } from "@/domain/chess/types";
import { samePosition } from "@/domain/chess/utils";
import Square from "@/components/chess/Square/Square";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import { ChessAction } from "@/features/chess/actions";

interface Props {
  pieces: Piece[];
  possibleMoves: Position[];
  draggingPieceId: string | null;
  dispatch: React.Dispatch<ChessAction>;
  onDragStart: (piece: Piece) => void;
  onDragEnd: () => void;
}

const Chessboard = ({
  pieces,
  possibleMoves,
  draggingPieceId,
  dispatch,
  onDragStart,
  onDragEnd,
}: Props) => {
  const {
    chessboardRef,
    dragState,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } = useDragAndDrop({
    onDrop: (pieceId, position) => {
      dispatch({
        type: "MOVE_PIECE",
        payload: { pieceId, to: position },
      });
    },
    onDragEnd,
  });

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

          const isDragging =
            dragState && piece && dragState.piece.id === piece.id;

          const pieceStyle: CSSProperties | undefined =
            isDragging && dragState
              ? {
                  position: "fixed",
                  left: dragState.clientX - dragState.offsetX,
                  top: dragState.clientY - dragState.offsetY,
                  zIndex: 1000,
                  pointerEvents: "none",
                }
              : undefined;

          // ★ 追加: draggingPieceId を使った半透明
          const draggingStyle: CSSProperties = piece && piece.id === draggingPieceId
            ? { opacity: 0.5 }
            : {};
          // ★ 移動可能マスのハイライト判定
          const highlight = possibleMoves.some(m =>
            samePosition(m, position)
          );

          return (
            <Square
              key={`${x}-${yIndex}`}
              piece={piece}
              number={x + yIndex + 2}
              highlight={highlight}
              pieceStyle={{ ...pieceStyle, ...draggingStyle }}
              onPointerDown={(e, p) => {
                onPointerDown(e, p);
                onDragStart(p);
              }}
            />
          );
        })
      )}
    </div>
  );
};

export default Chessboard;