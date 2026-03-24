import { useDispatch, useSelector } from 'react-redux';
import { useSaveGameMutation, useLazyLoadGameQuery } from '@/store/api/chessApi';
import { setChessState } from '@/store/slices/chessSlice';
import { RootState } from '@/store';

/**
 * Custom hook for managing game persistence with RTK Query
 * Provides save/load functionality integrated with Redux state
 */
export const useChessGamePersistence = () => {
  const dispatch = useDispatch();
  const chessState = useSelector((state: RootState) => state.chess);
  const [saveGame, { isLoading: isSaving }] = useSaveGameMutation();
  const [triggerLoadGame, { isLoading, isFetching }] = useLazyLoadGameQuery();

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
      const result = await triggerLoadGame(gameId).unwrap();
      dispatch(setChessState(result.state));
      return result;
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
