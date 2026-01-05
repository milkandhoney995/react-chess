"use client"

import styles from '@/app/page.module.scss'
import { useReducer, useState, useMemo } from "react";
import Chessboard from "@/components/chess/Chessboard/Chessboard";
import { chessReducer } from "@/features/chess/reducer";
import { initialChessState } from "@/features/chess/state";
import { selectPossibleMovesByPieceId } from "@/features/chess/selectors";
import { Position, PieceType, TeamType } from "@/domain/chess/types";
import { checkWinningTeam } from "@/domain/chess/utils";

export default function Home() {
  const [state, dispatch] = useReducer(chessReducer, initialChessState);
  const [draggingPieceId, setDraggingPieceId] = useState<string | null>(null);

  const possibleMoves: Position[] = useMemo(
    () => selectPossibleMovesByPieceId(draggingPieceId)(state),
    [draggingPieceId, state]
  );

  // チェック / チェックメイト情報
  const { checkedSquares, winningTeam } = useMemo(() => {
    const ourKing = state.pieces.find(p => p.type === PieceType.KING && p.team === TeamType.OUR);
    const opponentKing = state.pieces.find(p => p.type === PieceType.KING && p.team === TeamType.OPPONENT);
    const winner = checkWinningTeam(state.pieces);

    const squares: Position[] = [];

    if (!winner) {
      // 自分の王が攻撃されている場合
      if (ourKing) {
        const enemies = state.pieces.filter(p => p.team === TeamType.OPPONENT);
        if (enemies.some(e => e.possibleMoves.some(m => m.x === ourKing.position.x && m.y === ourKing.position.y))) {
          squares.push(ourKing.position);
        }
      }
      // 相手の王が攻撃されている場合
      if (opponentKing) {
        const enemies = state.pieces.filter(p => p.team === TeamType.OUR);
        if (enemies.some(e => e.possibleMoves.some(m => m.x === opponentKing.position.x && m.y === opponentKing.position.y))) {
          squares.push(opponentKing.position);
        }
      }
    }

    return { checkedSquares: squares, winningTeam: winner };
  }, [state.pieces]);

  return (
    <main className={styles.main}>
      {/* 勝利メッセージ */}
      {winningTeam && (
        <div className={styles.overlayMessage}>
          {winningTeam === TeamType.OUR ? "You Win!" : "You Lose!"}
        </div>
      )}
      {/* チェックメッセージ */}
      {!winningTeam && checkedSquares.length > 0 && (
        <div className={styles.overlayMessage}>Check!</div>
      )}

      <Chessboard
        pieces={state.pieces}
        possibleMoves={possibleMoves}
        draggingPieceId={draggingPieceId}
        promotion={state.promotion}
        checkedSquares={checkedSquares}
        dispatch={dispatch}
        onDragStart={(piece) => setDraggingPieceId(piece.id)}
        onDragEnd={() => setDraggingPieceId(null)}
      />
    </main>
  )
}