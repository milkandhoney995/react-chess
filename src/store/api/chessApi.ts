import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ChessState } from '@/features/chess/game/types';
import { Position } from '@/domain/chess/types';

interface SaveGameRequest {
  state: ChessState;
  gameId?: string;
}

interface SaveGameResponse {
  gameId: string;
  savedAt: string;
  state: ChessState;
}

interface LoadGameResponse {
  gameId: string;
  state: ChessState;
  createdAt: string;
  updatedAt: string;
}

export const chessApi = createApi({
  reducerPath: 'chessApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/chess',
  }),
  tagTypes: ['Game'],
  endpoints: (builder) => ({
    // Save current game state
    saveGame: builder.mutation<SaveGameResponse, SaveGameRequest>({
      query: (payload) => ({
        url: '/save',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Game'],
    }),

    // Load game state
    loadGame: builder.query<LoadGameResponse, string>({
      query: (gameId) => `/load/${gameId}`,
      providesTags: ['Game'],
    }),

    // Get list of saved games
    listGames: builder.query<
      Array<{ gameId: string; createdAt: string; updatedAt: string }>,
      void
    >({
      query: () => '/games',
      providesTags: ['Game'],
    }),

    // Delete a saved game
    deleteGame: builder.mutation<{ success: boolean }, string>({
      query: (gameId) => ({
        url: `/games/${gameId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Game'],
    }),

    // Validate a move
    validateMove: builder.query<
      { valid: boolean; reason?: string },
      { state: ChessState; pieceId: string; to: Position }
    >({
      query: (payload) => ({
        url: '/validate-move',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {
  useSaveGameMutation,
  useLoadGameQuery,
  useListGamesQuery,
  useDeleteGameMutation,
  useValidateMoveQuery,
} = chessApi;
