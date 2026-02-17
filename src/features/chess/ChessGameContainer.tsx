"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChessGame from "@/components/chess/ChessGame";
import { movePiece, promotePawn } from "@/store/slices/chessSlice";
import { useChessGameViewModel } from "@/features/chess/viewModels/useChessGameViewModel";
import { Piece, PieceType, Position } from "@/domain/chess/types";
import { RootState } from "@/store";

const ChessGameContainer: React.FC = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.chess);
  const [draggingPieceId, setDraggingPieceId] = useState<string | null>(null); // UI専用
  const viewModel = useChessGameViewModel(state, draggingPieceId);

  return (
    <ChessGame
      viewModel={viewModel}
      draggingPieceId={draggingPieceId}
      onMovePiece={(id: string, pos: Position) =>
        dispatch(movePiece({ pieceId: id, to: pos }))
      }
      onPromote={(pos: Position, type: PieceType) =>
        dispatch(promotePawn({ position: pos, pieceType: type }))
      }
      onDragStart={(p: Piece) => setDraggingPieceId(p.id)}
      onDragEnd={() => setDraggingPieceId(null)}
    />
  );
};

export default ChessGameContainer;