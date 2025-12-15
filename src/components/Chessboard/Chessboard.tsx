'use client';

import classes from "./Chessboard.module.scss"
import TileClasses from "../Tile/Tile.module.scss"
import Tile from "../Tile/Tile"
import { useRef, useState } from "react";
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  GRID_SIZE,
} from "@/Constants";
import { Piece, Position } from "@/models";
import useDragAndDrop from "@/hooks/useDragAndDrop";

interface Props {
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[];
}

const Chessboard = ({playMove, pieces} : Props) => {
  const { grabPiece, movePiece, dropPiece, chessboardRef, activePiece, draggingPiece } = useDragAndDrop({ playMove, pieces });
  // function grabPiece(e: React.MouseEvent) {
  //   const element = e.target as HTMLElement;
  //   const chessboard = chessboardRef.current;

  //   if (element.classList.contains(TileClasses.tile__image) && chessboard) {
  //     const boardRect = chessboard.getBoundingClientRect();
  //     // GRID_SIZEで割ることで、0 < x < 8, 0 < y< 8になる
  //     // そのままだと、from bottom left to top rightになるので、subtract 800して、top leftが(0, 0)、bottom leftが(800, 0)になるようにする
  //     const grabX = Math.floor((e.clientX - boardRect.left) / GRID_SIZE);
  //     const grabY = 7 - Math.floor((e.clientY - boardRect.top) / GRID_SIZE);
  //     const position = new Position(grabX, grabY);
  //     setGrabPosition(position);

  //     const piece = pieces.find(p => p.samePosition(position));
  //     if (piece) setDraggingPiece(piece);


  //     element.style.position = "fixed";
  //     element.style.left = `${e.clientX - GRID_SIZE / 2}px`;
  //     element.style.top = `${e.clientY - GRID_SIZE / 2}px`;
  //     element.style.pointerEvents = "none";
  //     element.style.zIndex = "1000";

  //     setActivePiece(element);
  //   }
  // }

  // function movePiece(e: React.MouseEvent) {
  //   if (!activePiece) return;

  //   activePiece.style.left = `${e.clientX - GRID_SIZE / 2}px`;
  //   activePiece.style.top = `${e.clientY - GRID_SIZE / 2}px`;
  // }

  // function dropPiece(e: React.MouseEvent) {
  //   const chessboard = chessboardRef.current;
  //   if (!activePiece || !chessboard) return;

  //   const rect = chessboard.getBoundingClientRect();
  //   // 動かした後のコマの位置
  //   const x = Math.floor((e.clientX - rect.left) / GRID_SIZE);
  //   const y = 7 - Math.floor((e.clientY - rect.top) / GRID_SIZE);
  //   // 動かす前のコマの位置
  //   const currentPiece = pieces.find(p => p.samePosition(grabPosition));

  //   if (currentPiece) {
  //     const success = playMove(
  //       currentPiece.clone(),
  //       new Position(x, y)
  //     );

  //     if (!success) {
  //       activePiece.style.position = "relative";
  //       activePiece.style.removeProperty("top");
  //       activePiece.style.removeProperty("left");
  //       activePiece.style.removeProperty("z-index");
  //       activePiece.style.removeProperty("pointer-events");
  //     }
  //   }

  //   setActivePiece(null);
  //   setDraggingPiece(null);

  // }

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
    <>
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
    </>
  );
}

export default Chessboard;