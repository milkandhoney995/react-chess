"use client";

import styles from "@/app/page.module.scss";
import { useReducer, useState } from "react";
import Chessboard from "@/components/chess/Chessboard/Chessboard";
import GameStatus from "@/components/chess/GameStatus/GameStatus";
import { chessReducer } from "@/features/chess/game/reducer";
import { initialChessState } from "@/features/chess/game/state";
import { selectCheckedSquares, selectIsCheck, selectWinningTeam } from "@/features/chess/game/selectors";
import { movePieceAction, promotePawn } from "@/features/chess/game/actions";
import { PieceType, Position } from "@/domain/chess/types";
import { useChessGameView } from "@/features/chess/game/viewModel";

const ChessGame = () => {
  const [state, dispatch] = useReducer(chessReducer, initialChessState);
  const [draggingPieceId, setDraggingPieceId] = useState<string | null>(null);

  const view = useChessGameView(state, draggingPieceId);

  /* =========================
   * 操作API（Application層）
   * ========================= */
  const movePiece = (pieceId: string, position: Position) => {
    dispatch(movePieceAction(pieceId, position));
  };

  const promote = (position: Position, type: PieceType) => {
    dispatch(promotePawn(position, type));
  };

  return (
    <main className={styles.main}>
      <GameStatus
        winningTeam={selectWinningTeam(state)}
        isCheck={selectIsCheck(state)}
      />

      <Chessboard
        pieces={state.pieces}
        possibleMoves={view.possibleMoves}
        checkedSquares={selectCheckedSquares(state)}
        draggingPieceId={draggingPieceId}
        promotion={state.promotion}
        onMovePiece={movePiece}
        onPromote={promote}
        onDragStart={p => setDraggingPieceId(p.id)}
        onDragEnd={() => setDraggingPieceId(null)}
      />
    </main>
  );
};

export default ChessGame;