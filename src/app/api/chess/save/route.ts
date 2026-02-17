import { NextRequest, NextResponse } from 'next/server';

// In-memory store for saved games (replace with database in production)
const savedGames: Map<string, { state: unknown; createdAt: string; updatedAt: string }> = new Map();

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
