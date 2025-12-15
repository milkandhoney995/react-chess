import { useState, useRef } from 'react';
import { Piece, Position } from "@/models";
import { GRID_SIZE } from "@/Constants";

interface UseDragAndDropProps {
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[];
}

const useDragAndDrop = ({ playMove, pieces }: UseDragAndDropProps) => {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [draggingPiece, setDraggingPiece] = useState<Piece | null>(null);
  const chessboardRef = useRef<HTMLDivElement>(null);

  const grabPiece = (e: React.MouseEvent) => {
    const element = e.target as HTMLElement;
    console.log("Clicked element:", element);
    console.log("Element classes:", element.classList);

    // 動的に生成されたクラス名にマッチするか確認
    if (element.classList.contains("Tile-module-scss-module__ty3Weq__tile__image")) {
      console.log("Tile image clicked:", element);
      const chessboard = chessboardRef.current;
      if (chessboard) {
        const boardRect = chessboard.getBoundingClientRect();
        const grabX = Math.floor((e.clientX - boardRect.left) / GRID_SIZE);
        const grabY = 7 - Math.floor((e.clientY - boardRect.top) / GRID_SIZE);
        const position = new Position(grabX, grabY);

        console.log("Grab position:", position);

        const piece = pieces.find(p => p.samePosition(position));
        if (piece) {
          setDraggingPiece(piece);
          console.log("Piece found:", piece);
        }

        element.style.position = "fixed";
        element.style.left = `${e.clientX - GRID_SIZE / 2}px`;
        element.style.top = `${e.clientY - GRID_SIZE / 2}px`;
        element.style.pointerEvents = "none";
        element.style.zIndex = "1000";

        setActivePiece(element);
      }
    } else {
      console.log("Clicked element is not a tile image");
    }
  };



  const movePiece = (e: React.MouseEvent) => {
    if (!activePiece) return;

    const chessboard = chessboardRef.current;
    if (!chessboard) return;

    // 駒の位置をマウスの位置に合わせる
    activePiece.style.left = `${e.clientX - GRID_SIZE / 2}px`;
    activePiece.style.top = `${e.clientY - GRID_SIZE / 2}px`;

    console.log(`Moving piece to: ${e.clientX - GRID_SIZE / 2} ${e.clientY - GRID_SIZE / 2}`);
  };

  const dropPiece = (e: React.MouseEvent) => {
    const chessboard = chessboardRef.current;
    if (!activePiece || !chessboard) return;

    const rect = chessboard.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / GRID_SIZE);
    const y = 7 - Math.floor((e.clientY - rect.top) / GRID_SIZE);

    const currentPiece = draggingPiece;

    if (currentPiece) {
      const success = playMove(currentPiece.clone(), new Position(x, y));

      if (!success) {
        // 移動が失敗した場合、駒を元の位置に戻す
        activePiece.style.position = "relative";
        activePiece.style.removeProperty("top");
        activePiece.style.removeProperty("left");
        activePiece.style.removeProperty("z-index");
        activePiece.style.removeProperty("pointer-events");
      }
    }

    // 駒をドロップ後、状態をリセット
    setActivePiece(null);
    setDraggingPiece(null);
  };

  return {
    grabPiece,
    movePiece,
    dropPiece,
    chessboardRef,
    activePiece,
    draggingPiece
  };
};

export default useDragAndDrop;