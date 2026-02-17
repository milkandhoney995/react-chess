import { NextRequest, NextResponse } from 'next/server';

// In-memory store for saved games
const savedGames: Map<string, { state: unknown; createdAt: string; updatedAt: string }> = new Map();

/**
 * 保存されたゲームの一覧を取得するエンドポイント
 * レスポンスにはゲームID、作成日時、更新日時が含まれる
 *
 * @returns {Array<{ gameId: string; createdAt: string; updatedAt: string }>} ゲームの一覧
 * @example
 * [
 *   {
 *     "gameId": "abc123",
 *     "createdAt": "2024-06-01T12:00:00Z",
 *     "updatedAt": "2024-06-01T12:30:00Z"
 *   },
 *   ...
 * ]
 */
export async function GET() {
  try {
    const games = Array.from(savedGames.entries()).map(([gameId, data]) => ({
      gameId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));

    return NextResponse.json(games);
  } catch (error) {
    console.error('Error listing games:', error);
    return NextResponse.json(
      { error: 'Failed to list games' },
      { status: 500 }
    );
  }
}
