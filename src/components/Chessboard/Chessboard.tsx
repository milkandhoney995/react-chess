'use client';

import classes from "./Chessboard.module.scss"
import TileClasses from "../Title/Tile.module.scss"
import Tile from "../Title/Tile"
import { useRef, useState } from "react";
import Referee from "@/referee/Referee";
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  GRID_SIZE, Piece, TeamType, PieceType,
  initialBoardState, Position,
  samePosition } from "../../Constants"

export default function Chessboard() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null)
  const [grabPosition, setGrabPosition] = useState<Position>({x: -1, y: -1});
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessboardRef = useRef<HTMLDivElement>(null);
  const referee = new Referee();

  function grabPiece(e: React.MouseEvent) {
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
        const validMove = referee.isValidMove(
          grabPosition,
          {x, y},
          currentPiece.type,
          currentPiece.team,
          pieces
        )

        const isEnPassantMove = referee.isEnPassantMove(
          grabPosition, {x, y},
          currentPiece.type, currentPiece.team, pieces
        );

        const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;

        if (isEnPassantMove) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              piece.enPassant = false;
              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (!samePosition(piece.position, {x, y: y - pawnDirection})) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece);
            }
            return results;
          }, [] as Piece[])
          setPieces(updatedPieces);
        } else if (validMove) {
        // reduce()
          // results: array of results
          // piece: a single object from the initial array(= value), the current piece we're handling
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              // Special move
              piece.enPassant =
                Math.abs(grabPosition.y - y) === 2 &&
                piece.type === PieceType.PAWN;

              // x, y: 動かした後のコマの位置
              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (!samePosition(piece.position, {x, y})) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece);
            }

            return results;
          }, [] as Piece[])

        // コマの位置を更新する. And if a piece is attacked, remove it
        setPieces(updatedPieces);
        } else {
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

      board.push(<Tile key={`${j}, ${i}`} image={image} number={number} />)
    }
  }

  return (
    <div
      onMouseMove={e => movePiece(e)}
      onMouseDown={e => grabPiece(e)}
      onMouseUp={e => dropPiece(e)}
      className={classes.chessboard}
      ref={chessboardRef}
    >{board}</div>);
}