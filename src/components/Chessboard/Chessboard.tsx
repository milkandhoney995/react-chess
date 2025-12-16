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
  const { grabPiece, movePiece, dropPiece, chessboardRef, dragState } = useDragAndDrop({ playMove, pieces });

  return (
    <div
      ref={chessboardRef}
      className={classes.chessboard}
      onMouseDown={grabPiece}
      onMouseMove={movePiece}
      onMouseUp={dropPiece}
    >
      {VERTICAL_AXIS.map((_, y) =>
        HORIZONTAL_AXIS.map((_, x) => {
          const position = new Position(x, 7 - y);
          const piece = pieces.find(p => p.samePosition(position));

          const isDragging =
            dragState?.piece.samePosition(piece?.position ?? new Position(-1, -1));

          const style: CSSProperties | undefined =
            isDragging && dragState
              ? {
                  position: "fixed" as const,
                  left: dragState.mouseX - GRID_SIZE / 2,
                  top: dragState.mouseY - GRID_SIZE / 2,
                  zIndex: 1000,
                  pointerEvents: "none",
                }
              : undefined;

          return (
            <Tile
              key={`${x}-${y}`}
              image={piece?.image}
              number={x + y + 2}
              highlight={false}
              pieceStyle={style}
            />
          );
        })
      )}
    </div>
  );
};
export default Chessboard;