import { HORIZONTAL_AXIS, VERTICAL_AXIS } from "@/domain/chess/constants";
import { getPieceAt, samePosition } from "@/domain/chess/utils";
import { ChessState } from "@/features/chess/game/types";
import { ChessGameViewModel, SquareView } from "./types";
import { Position, TeamType } from "@/domain/chess/types";
import {
  selectIsCheck,
  selectIsCheckedSquare,
  selectPossibleMovesByPieceId,
  selectWinningTeam,
} from "@/features/chess/game/selectors";

/**
 * Domain / Game State → UI 表示専用データへの変換
 * @function useChessGameViewModel
 * @param {ChessState} state - チェスゲームの状態
 * @param {string | null} draggingPieceId - ドラッグ中の駒ID
 * @returns {ChessGameViewModel} チェスゲームの表示用ViewModel
 */
export const useChessGameViewModel = (
  state: ChessState,
  draggingPieceId: string | null
): ChessGameViewModel => {
  // セレクターを使用して必要なデータを抽出
  const isCheck = selectIsCheck(state);
  const winningTeam = selectWinningTeam(state);
  const possibleMoves = selectPossibleMovesByPieceId(draggingPieceId)(state);

  // チェス盤の各マス目の表示情報を生成
  const squares: SquareView[] = VERTICAL_AXIS.flatMap(
    (_: unknown, yIndex: number) =>
      HORIZONTAL_AXIS.map((_: unknown, x: number): SquareView => {
        const position: Position = { x, y: 7 - yIndex };
        const piece = getPieceAt(state.pieces, position);

        return {
          id: `${x}-${yIndex}`,
          position,
          piece,
          highlight: possibleMoves.some(m =>
            samePosition(m, position)
          ),
          isChecked: selectIsCheckedSquare(position)(state),
        };
      })
  );

  // プロモーション情報の生成
  const promotion = state.promotion
    ? {
        position: state.promotion.position,
        team: state.promotion.team,
      }
    : undefined;

  return {
    gameStatus: {
      isCheck,
      message: winningTeam
        ? winningTeam === TeamType.OUR
          ? "You Win!"
          : "You Lose!"
        : undefined,
    },
    chessboard: {
      squares,
      promotion,
    },
  };
};