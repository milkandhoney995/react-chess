import { NextRequest, NextResponse } from 'next/server';

// In-memory store for saved games (replace with database in production)
const savedGames: Map<string, { state: unknown; createdAt: string; updatedAt: string }> = new Map();

/**
 * 保存されたゲームを削除するエンドポイント
 *
 * @requires gameId - 削除するゲームのID
 * @returns { success: boolean } - 削除成功のフラグ
 * @error 404 - ゲームが見つからない場合
 * @error 500 - サーバーエラーが発生した場合
 *
 * @example
 * // クライアントからのリクエスト例
 * fetch('/api/chess/games/12345', { method: 'DELETE' })
 *   .then(response => response.json())
 *   .then(data => {
 *     if (data.success) {
 *       console.log('Game deleted successfully');
 *     } else {
 *       console.error('Failed to delete game');
 *     }
 *   });
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;

    if (!savedGames.has(gameId)) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    savedGames.delete(gameId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    );
  }
}
