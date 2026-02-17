import { NextRequest, NextResponse } from 'next/server';

// In-memory store for saved games (replace with database in production)
const savedGames: Map<string, { state: unknown; createdAt: string; updatedAt: string }> = new Map();

/**
 * ゲームの状態を保存するエンドポイント
 * クライアントからゲームの状態を受け取り、保存する。
 * ゲームIDが提供されない場合は新しいIDを生成する。
 *
 * 期待されるリクエスト:
 * @requires state: unknown - 保存するゲームの状態を表すオブジェクト
 * @optional gameId: string - 保存するゲームのID（省略可能）
 * @example
 * {
 *   "state": { ... }, // ゲームの状態を表すオブジェクト
 *   "gameId": "optional_game_id" // 省略可能
 * }
 * @returns gameId: string - 保存されたゲームのID
 * @returns savedAt: string - ゲームが保存された日時のISO文字列
 * @returns state: unknown - 保存されたゲームの状態
 * @example
 * {
 *   "gameId": "game_123456789",
 *   "savedAt": "2024-06-01T12:34:56.789Z",
 *   "state": { ... } // 保存されたゲームの状態を表すオブジェクト
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { state, gameId } = await request.json();

    if (!state) {
      return NextResponse.json(
        { error: 'Game state is required' },
        { status: 400 }
      );
    }

    const id = gameId || `game_${Date.now()}`;
    const now = new Date().toISOString();

    savedGames.set(id, {
      state,
      createdAt: savedGames.has(id) ? (savedGames.get(id)?.createdAt || now) : now,
      updatedAt: now,
    });

    return NextResponse.json({
      gameId: id,
      savedAt: now,
      state,
    });
  } catch (error) {
    console.error('Error saving game:', error);
    return NextResponse.json(
      { error: 'Failed to save game' },
      { status: 500 }
    );
  }
}
