import { NextRequest, NextResponse } from 'next/server';

// In-memory store for saved games (replace with database in production)
const savedGames: Map<string, { state: unknown; createdAt: string; updatedAt: string }> = new Map();

// Initialize with sample game on startup
if (savedGames.size === 0) {
  // Games will be stored in memory for this session
}

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
