"use client";

import { useReducer, useState } from "react";
import ChessGame from "@/components/chess/ChessGame";
import { chessReducer } from "@/features/chess/game/reducer";
import { initialChessState } from "@/features/chess/game/state";
import { movePieceAction, promotePawn } from "@/features/chess/game/actions";
import { useChessGameViewModel } from "@/features/chess/viewModels/useChessGameViewModel";
import { Piece, PieceType, Position } from "@/domain/chess/types";

const ChessGameContainer: React.FC = () => {
  const [state, dispatch] = useReducer(chessReducer, initialChessState);
  const [draggingPieceId, setDraggingPieceId] = useState<string | null>(null); // UI専用
  const viewModel = useChessGameViewModel(state, draggingPieceId);

  return (
    <ChessGame
      viewModel={viewModel}
      draggingPieceId={draggingPieceId}
      onMovePiece={(id: string, pos: Position) =>
        dispatch(movePieceAction(id, pos))
      }
      onPromote={(pos: Position, type: PieceType) =>
        dispatch(promotePawn(pos, type))
      }
      onDragStart={(p: Piece) => setDraggingPieceId(p.id)}
      onDragEnd={() => setDraggingPieceId(null)}
    />
  );
};

export default ChessGameContainer;