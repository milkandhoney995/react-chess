import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChessState, PromotionState } from '@/features/chess/game/types';
import { createBoard } from '@/domain/chess/board/createBoard';
import { Piece, PieceType, Position, TeamType } from '@/domain/chess/types';
import { checkWinningTeam, samePosition, isPromotionSquare } from '@/domain/chess/utils';
import { movePiece as movePieceUtil } from '@/domain/chess/board/movePiece';

const initialState: ChessState = {
  pieces: createBoard(),
  totalTurns: 0,
};

export const chessSlice = createSlice({
  name: 'chess',
  initialState,
  reducers: {
    movePiece: (
      state,
      action: PayloadAction<{ pieceId: string; to: Position }>
    ) => {
      // プロモーション待ち中は移動不可
      if (state.promotion) return;

      const piece = state.pieces.find(p => p.id === action.payload.pieceId);
      if (!piece) return;

      // ターンチェック
      const isTurn =
        (piece.team === TeamType.OUR && state.totalTurns % 2 === 0) ||
        (piece.team === TeamType.OPPONENT && state.totalTurns % 2 === 1);

      if (!isTurn) return;

      const newPieces = movePieceUtil(
        state.pieces,
        piece.position,
        action.payload.to,
        state.totalTurns
      );

      const hasMoved = newPieces.some(
        p => p.id === piece.id && !samePosition(p.position, piece.position)
      );

      if (!hasMoved) return;

      /* =====================
        プロモーション判定
      ===================== */
      const promotedPawn = newPieces.find(
        p =>
          p.id === piece.id &&
          p.type === PieceType.PAWN &&
          isPromotionSquare(p)
      );

      if (promotedPawn) {
        state.pieces = newPieces;
        state.promotion = {
          position: promotedPawn.position,
          team: promotedPawn.team,
        };
        return;
      }

      state.pieces = newPieces;
      state.totalTurns += 1;
      state.winningTeam = checkWinningTeam(newPieces);
    },

    promotePawn: (
      state,
      action: PayloadAction<{ position: Position; pieceType: PieceType }>
    ) => {
      if (!state.promotion) return;

      const promotedPieces = state.pieces.map(p =>
        samePosition(p.position, action.payload.position)
          ? {
              ...p,
              type: action.payload.pieceType,
            }
          : p
      );

      state.pieces = promotedPieces;
      state.promotion = undefined;
      state.totalTurns += 1;
      state.winningTeam = checkWinningTeam(promotedPieces);
    },

    resetGame: (state) => {
      state.pieces = createBoard();
      state.totalTurns = 0;
      state.winningTeam = undefined;
      state.promotion = undefined;
    },

    setChessState: (state, action: PayloadAction<ChessState>) => {
      return action.payload;
    },
  },
});

export const { movePiece, promotePawn, resetGame, setChessState } = chessSlice.actions;
export default chessSlice.reducer;
