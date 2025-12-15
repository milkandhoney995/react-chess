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

  // grabPositionの変更に依存せず、activePieceとdraggingPieceで動かす
  const grabPiece = (e: React.MouseEvent) => {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;

    if (element.classList.contains("tile__image") && chessboard) {
      const boardRect = chessboard.getBoundingClientRect();
      const grabX = Math.floor((e.clientX - boardRect.left) / GRID_SIZE);
      const grabY = 7 - Math.floor((e.clientY - boardRect.top) / GRID_SIZE);
      const position = new Position(grabX, grabY);

      // 駒を掴んだ際のスタイル設定
      element.style.position = "fixed";
      element.style.left = `${e.clientX - GRID_SIZE / 2}px`;
      element.style.top = `${e.clientY - GRID_SIZE / 2}px`;
      element.style.pointerEvents = "none";
      element.style.zIndex = "1000";

      setActivePiece(element);  // アクティブな駒をセット

      // 駒を掴んだ位置に対応するピースを設定
      const piece = pieces.find(p => p.samePosition(position));
      if (piece) {
        setDraggingPiece(piece);
      }
    }
  };

  const movePiece = (e: React.MouseEvent) => {
    if (!activePiece) return;

    // 駒の位置をマウスの位置に合わせる
    activePiece.style.left = `${e.clientX - GRID_SIZE / 2}px`;
    activePiece.style.top = `${e.clientY - GRID_SIZE / 2}px`;
  };

  const dropPiece = (e: React.MouseEvent) => {
    const chessboard = chessboardRef.current;
    if (!activePiece || !chessboard) return;

    const rect = chessboard.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / GRID_SIZE);
    const y = 7 - Math.floor((e.clientY - rect.top) / GRID_SIZE);

    // 移動後のピースを検索して、playMoveを呼び出す
    const currentPiece = pieces.find(p => p.samePosition(draggingPiece?.position || new Position(-1, -1)));

    if (currentPiece) {
      const success = playMove(currentPiece.clone(), new Position(x, y));

      if (!success) {
        // 移動が成功しなかった場合、駒を元の位置に戻す
        activePiece.style.position = "relative";
        activePiece.style.removeProperty("top");
        activePiece.style.removeProperty("left");
        activePiece.style.removeProperty("z-index");
        activePiece.style.removeProperty("pointer-events");
      }
    }

    setActivePiece(null);
    setDraggingPiece(null);  // ドロップ後に状態リセット
  };

  return {
    grabPiece,
    movePiece,
    dropPiece,
    chessboardRef,
    activePiece,
    draggingPiece
  };
}

export default useDragAndDrop;