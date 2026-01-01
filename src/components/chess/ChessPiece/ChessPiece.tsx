'use client';

import { useReducer, useState, useMemo } from "react";
import Chessboard from "@/components/chess/Chessboard/Chessboard";
import { chessReducer } from "@/features/chess/reducer";
import { initialChessState } from "@/features/chess/state";
import { selectPossibleMovesByPieceId } from "@/features/chess/selectors";
import { Position } from "@/domain/chess/types";

const ChessPiece = () => {
  const [state, dispatch] = useReducer(chessReducer, initialChessState);

  // UI専用：現在ドラッグ中の駒ID
  const [draggingPieceId, setDraggingPieceId] = useState<string | null>(null);

  // 移動可能マス（selector経由）
  const possibleMoves: Position[] = useMemo(
    () => selectPossibleMovesByPieceId(draggingPieceId)(state),
    [draggingPieceId, state]
  );

  return (
    <Chessboard
      pieces={state.pieces}
      possibleMoves={possibleMoves}
      draggingPieceId={draggingPieceId}
      dispatch={dispatch}
      onDragStart={(piece) => setDraggingPieceId(piece.id)}
      onDragEnd={() => setDraggingPieceId(null)}
    />
  );
};

export default ChessPiece;