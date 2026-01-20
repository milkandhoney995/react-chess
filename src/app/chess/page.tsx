"use client";

import styles from "@/app/page.module.scss";
import { useReducer, useState, useMemo } from "react";
import Chessboard from "@/components/chess/Chessboard/Chessboard";
import GameStatus from "@/components/chess/GameStatus/GameStatus";
import { chessReducer } from "@/features/chess/game/reducer";
import { initialChessState } from "@/features/chess/game/state";
import { selectCheckedSquares, selectIsCheck, selectPossibleMovesByPieceId, selectWinningTeam } from "@/features/chess/game/selectors";

export default function Home() {
  const [state, dispatch] = useReducer(chessReducer, initialChessState);
  const [draggingPieceId, setDraggingPieceId] = useState<string | null>(null);

  const possibleMoves = useMemo(
    () => selectPossibleMovesByPieceId(draggingPieceId)(state),
    [draggingPieceId, state]
  );

  return (
    <main className={styles.main}>
      <GameStatus
        winningTeam={selectWinningTeam(state)}
        isCheck={selectIsCheck(state)}
      />

      <Chessboard
        pieces={state.pieces}
        possibleMoves={possibleMoves}
        checkedSquares={selectCheckedSquares(state)}
        draggingPieceId={draggingPieceId}
        promotion={state.promotion}
        dispatch={dispatch}
        onDragStart={p => setDraggingPieceId(p.id)}
        onDragEnd={() => setDraggingPieceId(null)}
      />
    </main>
  );
}