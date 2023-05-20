'use client';

import classes from "./Chessboard.module.scss"
import TileClasses from "../Title/Tile.module.scss"
import Tile from "../Title/Tile"
import { useRef, useState } from "react";
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  GRID_SIZE, Piece, Position,
  samePosition } from "../../Constants"

interface Props {
  updatePossibleMoves: () => void;
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[]
}

export default function Chessboard({updatePossibleMoves, playMove, pieces}: Props) {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null)
  const [grabPosition, setGrabPosition] = useState<Position>({x: -1, y: -1});
  // const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessboardRef = useRef<HTMLDivElement>(null);


  function grabPiece(e: React.MouseEvent) {
    updatePossibleMoves();
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;

    if (element.classList.contains(`${TileClasses.tile__image}`) && chessboard) {
      // GRID_SIZEで割ることで、0 < x < 8, 0 < y< 8になる
      // そのままだと、from bottom left to top rightになるので、subtract 800して、top leftが(0, 0)、bottom leftが(800, 0)になるようにする
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(Math.ceil((e.clientY- chessboard.offsetTop - 800) / GRID_SIZE));
      setGrabPosition({
        x: grabX,
        y: grabY
      });

      // 移動した駒の位置
      // setGridX(grabX);
      // setGridY(gridY);

      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element);
    }
  }

  function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";

      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      } else {
        activePiece.style.left = `${x}px`;
      }

      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      } else {
        activePiece.style.top = `${y}px`;
      }

    }
  }

  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;

    if (activePiece && chessboard) {
      // 動かした後のコマの位置
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(Math.ceil((e.clientY- chessboard.offsetTop - 800) / GRID_SIZE));

      // grabX, grabY: コマの位置(not changing value)
      const currentPiece = pieces.find(p => samePosition(p.position, grabPosition));

      if (currentPiece) {
        let success = playMove(currentPiece, {x, y});

        if (!success) {
          // 無効な移動だった場合、コマを元あった位置に戻す
          activePiece.style.position = "relative";
          activePiece.style.removeProperty('top');
          activePiece.style.removeProperty('left');
        }
      }

      setActivePiece(null);
    }
  }

  let board = [];

  for (let j = VERTICAL_AXIS.length - 1; j >= 0 ; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const number = j + i;
      const piece = pieces.find(p => samePosition(p.position, {x: i, y: j}));
      let image = piece ? piece.image : undefined;

      let currentPiece = activePiece !== null ? pieces.find(p => samePosition(p.position, grabPosition)) : undefined;
      // some()
      // Determines whether the specified callback function returns true for any element of an array.
      // @param predicate
      let highlight = currentPiece?.possibleMoves ?
      currentPiece.possibleMoves.some(p => samePosition(p, {x: i, y: j})) : false;

      board.push(<Tile key={`${j}, ${i}`} image={image} number={number} highlight={highlight} />)
    }
  }

  return (
    <>
      <div
        onMouseMove={e => movePiece(e)}
        onMouseDown={e => grabPiece(e)}
        onMouseUp={e => dropPiece(e)}
        className={classes.chessboard}
        ref={chessboardRef}
      >{board}</div>
    </>
  );
}