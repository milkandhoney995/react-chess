import { DragState, Piece } from "@/domain/chess/types";
import { CSSProperties } from "react";

/**
 * 駒のスタイルを計算
 * @param piece 対象の駒
 * @param draggingPieceId 現在ドラッグ中の駒ID
 * @returns CSSProperties または undefined
 */
export function getPieceStyle(
  piece: Piece | undefined,
  draggingPieceId: string | null
): CSSProperties | undefined {
  if (!piece) return undefined;
  if (piece.id === draggingPieceId) {
    return { opacity: 0 };
  }
  return undefined;
}

/**
 * ドラッグ中の駒のスタイルを計算
 * @param dragState ドラッグ状態
 * @returns CSSProperties
 */
export function getDraggingStyle(
  dragState: DragState
): CSSProperties {
  return {
    position: "fixed",
    left: dragState.clientX - dragState.offsetX,
    top: dragState.clientY - dragState.offsetY,
    zIndex: 1000,
    pointerEvents: "none",
  };
}