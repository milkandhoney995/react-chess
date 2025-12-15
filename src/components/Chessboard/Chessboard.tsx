'use client';

import classes from "./Chessboard.module.scss"
import Tile from "../Tile/Tile"
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
} from "@/Constants";
import { Piece, Position } from "@/models";
import useDragAndDrop from "@/hooks/useDragAndDrop";

interface Props {
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[];
}
const Chessboard = ({ playMove, pieces }: Props) => {
  const { grabPiece, movePiece, dropPiece, chessboardRef, activePiece, draggingPiece } = useDragAndDrop({ playMove, pieces });

  // Boardのクリック時にグラブイベントを呼び出す
  let board = [];

  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const number = j + i + 2;
      const piece = pieces.find((p) =>
        p.samePosition(new Position(i, j))
      );
      let image = piece ? piece.image : undefined;

      // let currentPiece = activePiece !== null ? pieces.find(p => p.samePosition(grabPosition)) : undefined;
      let highlight = draggingPiece?.possibleMoves ?
        draggingPiece.possibleMoves.some(p => p.samePosition(new Position(i, j))) : false;

      board.push(<Tile key={`${j},${i}`} image={image} number={number} highlight={highlight} />);
    }
  }
  return (
    <div
      onMouseMove={(e) => movePiece(e)}
      onMouseDown={(e) => grabPiece(e)}
      onMouseUp={(e) => dropPiece(e)}
      className={classes.chessboard}
      ref={chessboardRef}
      role="grid"
      aria-label="Chess board"
      aria-rowcount={8}
      aria-colcount={8}
    >
      {board}
    </div>
  );
};
export default Chessboard;