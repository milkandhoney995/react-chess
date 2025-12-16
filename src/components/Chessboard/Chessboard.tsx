'use client';

import classes from "./Chessboard.module.scss"
import Tile from "../Tile/Tile"
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  GRID_SIZE,
} from "@/Constants";
import { Piece, Position } from "@/models";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import { CSSProperties } from "react";

interface Props {
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[];
}

const Chessboard = ({ playMove, pieces }: Props) => {
  const {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    chessboardRef,
    dragState,
  } = useDragAndDrop({ playMove });

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

          const isDragging =
            !!dragState && piece?.samePiecePosition(dragState.piece);

          const pieceStyle: CSSProperties | undefined =
            isDragging && dragState
              ? {
                  position: "fixed",
                  left: dragState.clientX - GRID_SIZE / 2,
                  top: dragState.clientY - GRID_SIZE / 2,
                  zIndex: 1000,
                  pointerEvents: "none",
                }
              : undefined;

          // 今ドラッグしている駒がルール上動かせるマスをハイライトする
          const highlight =
            !!dragState?.piece.possibleMoves?.some(move =>
              move.samePosition(position)
            );

          return (
            <Tile
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