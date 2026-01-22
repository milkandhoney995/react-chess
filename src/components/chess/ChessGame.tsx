'use client';

import React from "react";
import styles from "@/app/page.module.scss";
import Chessboard from "@/components/chess/Chessboard/Chessboard";
import GameStatus from "@/components/chess/GameStatus/GameStatus";
import { ChessGameViewModel } from "@/features/chess/viewModels/types";
import { Piece, PieceType, Position } from "@/domain/chess/types";

interface Props {
  viewModel: ChessGameViewModel;
  draggingPieceId: string | null;
  onMovePiece: (pieceId: string, position: Position) => void;
  onPromote: (position: Position, type: PieceType) => void;
  onDragStart: (piece: Piece) => void;
  onDragEnd: () => void;
}

const ChessGame: React.FC<Props> = ({
  viewModel,
  draggingPieceId,
  onMovePiece,
  onPromote,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <main className={styles.main}>
      <GameStatus {...viewModel.gameStatus} />
      <Chessboard
        squares={viewModel.chessboard.squares}
        draggingPiece={viewModel.chessboard.draggingPiece}
        promotion={viewModel.chessboard.promotion}
        draggingPieceId={draggingPieceId}
        onMovePiece={onMovePiece}
        onPromote={onPromote}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    </main>
  );
};

export default ChessGame;