import { NextRequest, NextResponse } from 'next/server';

// In-memory store for saved games (replace with database in production)
const savedGames: Map<string, { state: unknown; createdAt: string; updatedAt: string }> = new Map();

// Initialize with sample game on startup
if (savedGames.size === 0) {
  // Games will be stored in memory for this session
}

/**
 * ゲームの状態をロードするAPIエンドポイント
 * クライアントからゲームIDを受け取り、そのゲームの状態を返す
 * 期待されるリクエスト:
 * @requires gameId: string - ロードしたいゲームのID
 * @example
 * GET /api/chess/load/abc123
 * @returns gameId: string - ロードされたゲームのID
 * @returns state: unknown - ゲームの状態（ChessStateオブジェクトなど）
 * @returns createdAt: string - ゲームの作成日時
 * @returns updatedAt: string - ゲームの最終更新日時
 * @example
 * {
 *   "gameId": "abc123",
 *   "state": { ... }, // ゲームの状態を表すオブジェクト
 *   "createdAt": "2024-06-01T12:00:00Z",
 *   "updatedAt": "2024-06-01T12:30:00Z"
 * }
 * */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;
    const game = savedGames.get(gameId);

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      gameId,
      state: game.state,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
    });
  } catch (error) {
    console.error('Error loading game:', error);
    return NextResponse.json(
      { error: 'Failed to load game' },
      { status: 500 }
    );
  }
}
