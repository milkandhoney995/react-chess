import { useSelector } from 'react-redux';
import { RootState } from '@/store';

/**
 * Custom hook for reading chess state from Redux
 * Provides type-safe access to all chess-related selectors
 */
export const useChessState = () => {
  return useSelector((state: RootState) => state.chess);
};

/**
 * Custom hook for accessing individual chess state properties
 */
export const useChessPieces = () => {
  return useSelector((state: RootState) => state.chess.pieces);
};

export const useChessTotalTurns = () => {
  return useSelector((state: RootState) => state.chess.totalTurns);
};

export const useChessWinningTeam = () => {
  return useSelector((state: RootState) => state.chess.winningTeam);
};

export const useChessPromotion = () => {
  return useSelector((state: RootState) => state.chess.promotion);
};
