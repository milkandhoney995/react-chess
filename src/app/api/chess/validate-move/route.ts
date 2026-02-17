import { NextRequest, NextResponse } from 'next/server';
import { movePiece as movePieceUtil } from '@/domain/chess/board/movePiece';
import { ChessState } from '@/features/chess/game/types';
import { Position, TeamType } from '@/domain/chess/types';
import { samePosition } from '@/domain/chess/utils';

/**
 * 駒の移動が有効かどうかを検証するAPIエンドポイント
 * クライアントから現在のゲーム状態、移動させたい駒のID、移動先の位置を受け取り、
 * 移動がルール上有効かどうかを判定して返す
 *
 * 期待されるリクエスト:
 * @requires state: ChessState - 現在のゲーム状態を表すオブジェクト
 * @requires pieceId: string - 移動させたい駒のID
 * @requires to: Position - 移動先の位置を表すオブジェクト
 * @example
 * {
 *   "state": { ... }, // ChessStateオブジェクト
 *   "pieceId": "abc123",
 *   "to": { "x": 4, "y": 4 }
 * }
 *
 * @returns valid: boolean - 移動が有効かどうか
 * @returns reason?: string - 無効な場合の理由（オプション）
 * @example
 * {
 *   "valid": true
 *
 * }
 * */
export async function POST(request: NextRequest) {
  try {
    const { state, pieceId, to } = await request.json() as {
      state: ChessState;
      pieceId: string;
      to: Position;
    };

    if (!state || !pieceId || !to) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // 駒を特定
    const piece = state.pieces.find(p => p.id === pieceId);
    if (!piece) {
      return NextResponse.json(
        { valid: false, reason: 'Piece not found' }
      );
    }

    // ターンチェック
    const isTurn =
      (piece.team === TeamType.OUR && state.totalTurns % 2 === 0) ||
      (piece.team === TeamType.OPPONENT && state.totalTurns % 2 === 1);

    if (!isTurn) {
      return NextResponse.json(
        { valid: false, reason: "It's not your turn" }
      );
    }

    // 駒を移動
    const newPieces = movePieceUtil(
      state.pieces,
      piece.position,
      to,
      state.totalTurns
    );

    // 移動が成功したかを判定
    const hasMoved = newPieces.some(
      p => p.id === piece.id && !samePosition(p.position, piece.position)
    );

    return NextResponse.json({
      valid: hasMoved,
      reason: hasMoved ? undefined : 'Invalid move',
    });
  } catch (error) {
    console.error('Error validating move:', error);
    return NextResponse.json(
      { error: 'Failed to validate move' },
      { status: 500 }
    );
  }
}
