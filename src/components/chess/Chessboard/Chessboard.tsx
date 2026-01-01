'use client';

import classes from "@/components/chess/Chessboard/Chessboard.module.scss"
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE } from "@/domain/chess/constants";
import { Piece, Position } from "@/models";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import { CSSProperties } from "react";
import Square from "@/components/chess/Square/Square";

interface Props {
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[];
}

const Chessboard = ({ playMove, pieces }: Props) => {
  const { onPointerDown, onPointerMove, onPointerUp, chessboardRef, dragState } =
    useDragAndDrop({ playMove });

  return (
    <div
      ref={chessboardRef}
      className={classes.chessboard}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {VERTICAL_AXIS.map((_, y) =>
        HORIZONTAL_AXIS.map((_, x) => {
          const position = new Position(x, 7 - y);
          const piece = pieces.find(p => p.samePosition(position));

          // ドラッグ中の駒かどうか
          const isDragging =
            !!dragState && piece?.samePiecePosition(dragState.piece);

          // ドラッグ中の駒スタイル
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

          // 移動可能マスのハイライト
          const highlight =
            !!dragState?.piece.possibleMoves?.some((move) =>
              move.samePosition(position)
            );

          return (
            <Square
              key={`${x}-${y}`}
              piece={piece}
              number={x + y + 2}
              highlight={highlight}
              pieceStyle={pieceStyle}
              onPointerDown={onPointerDown}
            />
          );
        })
      )}
    </div>
  );
};

export default Chessboard;