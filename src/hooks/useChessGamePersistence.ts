import { useDispatch, useSelector } from 'react-redux';
import { useSaveGameMutation, useLoadGameQuery } from '@/store/api/chessApi';
import { setChessState } from '@/store/slices/chessSlice';
import { RootState } from '@/store';
import { ChessState } from '@/features/chess/game/types';

/**
 * Custom hook for managing game persistence with RTK Query
 * Provides save/load functionality integrated with Redux state
 */
export const useChessGamePersistence = () => {
  const dispatch = useDispatch();
  const chessState = useSelector((state: RootState) => state.chess);
  const [saveGame, { isLoading: isSaving }] = useSaveGameMutation();
  const { data: loadedGame, isLoading: isLoading, isFetching } = useLoadGameQuery('');

  const handleSaveGame = async (gameId?: string) => {
    try {
      const result = await saveGame({ state: chessState, gameId }).unwrap();
      return result.gameId;
    } catch (error) {
      console.error('Failed to save game:', error);
      throw error;
    }
  };

  const handleLoadGame = async (gameId: string) => {
    try {
      const result = await useLoadGameQuery(gameId);
      if (result.data) {
        dispatch(setChessState(result.data.state));
        return result.data;
      }
    } catch (error) {
      console.error('Failed to load game:', error);
      throw error;
    }
  };

  return {
    saveGame: handleSaveGame,
    loadGame: handleLoadGame,
    isSaving,
    isLoading,
    isFetching,
  };
};
