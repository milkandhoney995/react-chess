import { NextRequest, NextResponse } from 'next/server';
import { movePiece as movePieceUtil } from '@/domain/chess/board/movePiece';
import { ChessState } from '@/features/chess/game/types';
import { Position, TeamType } from '@/domain/chess/types';
import { samePosition } from '@/domain/chess/utils';

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

    // Find the piece
    const piece = state.pieces.find(p => p.id === pieceId);
    if (!piece) {
      return NextResponse.json(
        { valid: false, reason: 'Piece not found' }
      );
    }

    // Verify it's the correct player's turn
    const isTurn =
      (piece.team === TeamType.OUR && state.totalTurns % 2 === 0) ||
      (piece.team === TeamType.OPPONENT && state.totalTurns % 2 === 1);

    if (!isTurn) {
      return NextResponse.json(
        { valid: false, reason: "It's not your turn" }
      );
    }

    // Try to move the piece
    const newPieces = movePieceUtil(
      state.pieces,
      piece.position,
      to,
      state.totalTurns
    );

    // Check if piece actually moved
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
