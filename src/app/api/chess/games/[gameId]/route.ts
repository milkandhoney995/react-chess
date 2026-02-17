import { NextRequest, NextResponse } from 'next/server';

// In-memory store for saved games (replace with database in production)
const savedGames: Map<string, { state: unknown; createdAt: string; updatedAt: string }> = new Map();

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
