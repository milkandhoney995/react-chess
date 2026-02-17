import { useDispatch } from 'react-redux';
import { movePiece, promotePawn, resetGame, setChessState } from '@/store/slices/chessSlice';
import { Position, PieceType } from '@/domain/chess/types';
import { ChessState } from '@/features/chess/game/types';

/**
 * Custom hook for dispatching chess game actions
 * Provides type-safe action dispatchers for all game operations
 */
export const useChessActions = () => {
  const dispatch = useDispatch();

  return {
    movePiece: (pieceId: string, to: Position) => {
      dispatch(movePiece({ pieceId, to }));
    },
    promotePawn: (position: Position, pieceType: PieceType) => {
      dispatch(promotePawn({ position, pieceType }));
    },
    resetGame: () => {
      dispatch(resetGame());
    },
    setChessState: (state: ChessState) => {
      dispatch(setChessState(state));
    },
  };
};
