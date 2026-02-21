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
    // ゲームの状態を保存（新規保存または上書き保存）
    saveGame: builder.mutation<SaveGameResponse, SaveGameRequest>({
      query: (payload) => ({
        url: '/save',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Game'],
    }),

    // ゲームIDを指定して保存したゲームを読み込む
    loadGame: builder.query<LoadGameResponse, string>({
      query: (gameId) => `/load/${gameId}`,
      providesTags: ['Game'],
    }),

    // 保存したゲームの一覧を取得
    listGames: builder.query<
      Array<{ gameId: string; createdAt: string; updatedAt: string }>,
      void
    >({
      query: () => '/games',
      providesTags: ['Game'],
    }),

    // 保存したゲームを削除
    deleteGame: builder.mutation<{ success: boolean }, string>({
      query: (gameId) => ({
        url: `/games/${gameId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Game'],
    }),

    // 駒の動きを検証
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
