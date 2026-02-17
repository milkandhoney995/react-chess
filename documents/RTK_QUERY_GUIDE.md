# RTK Query Integration Guide

## Overview

This project uses **Redux Toolkit** (RTK) with **RTK Query** for state management and API integration. This provides:

- Centralized state management with Redux
- Automatic API caching and synchronization via RTK Query
- Type-safe Redux hooks
- Next.js API Route Handlers for backend endpoints

## Architecture

### Store Structure

```
src/store/
├── index.ts                 # Store configuration
├── api/
│   └── chessApi.ts         # RTK Query API definitions
└── slices/
    └── chessSlice.ts       # Chess game state slice
```

### API Routes

```
app/api/chess/
├── save/route.ts           # POST /api/chess/save
├── load/[gameId]/route.ts  # GET /api/chess/load/:gameId
├── games/route.ts          # GET /api/chess/games, DELETE /api/chess/games/:gameId
└── validate-move/route.ts  # POST /api/chess/validate-move
```

## Usage Examples

### 1. Saving Game State

```typescript
import { useChessGamePersistence } from '@/hooks';

function MyComponent() {
  const { saveGame, isSaving } = useChessGamePersistence();

  const handleSave = async () => {
    try {
      const gameId = await saveGame();
      console.log('Game saved:', gameId);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  return (
    <button onClick={handleSave} disabled={isSaving}>
      {isSaving ? 'Saving...' : 'Save Game'}
    </button>
  );
}
```

### 2. Loading Game State

```typescript
import { useLoadGameQuery } from '@/store/api/chessApi';
import { useDispatch } from 'react-redux';
import { setChessState } from '@/store/slices/chessSlice';

function LoadGameComponent({ gameId }: { gameId: string }) {
  const { data: game, isLoading, error } = useLoadGameQuery(gameId);
  const dispatch = useDispatch();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading game</div>;

  return (
    <button onClick={() => dispatch(setChessState(game.state))}>
      Restore Game
    </button>
  );
}
```

### 3. Listing Saved Games

```typescript
import { useListGamesQuery } from '@/store/api/chessApi';

function SavedGamesList() {
  const { data: games = [], isLoading } = useListGamesQuery();

  if (isLoading) return <div>Loading games...</div>;

  return (
    <ul>
      {games.map(game => (
        <li key={game.gameId}>{game.gameId}</li>
      ))}
    </ul>
  );
}
```

### 4. Dispatching Game Actions

```typescript
import { useChessActions } from '@/hooks';
import { Position, PieceType } from '@/domain/chess/types';

function ChessBoard() {
  const { movePiece, promotePawn, resetGame } = useChessActions();

  const handlePieceMove = (pieceId: string, position: Position) => {
    movePiece(pieceId, position);
  };

  const handlePromotion = (position: Position, type: PieceType) => {
    promotePawn(position, type);
  };

  const handleReset = () => {
    resetGame();
  };

  // ... rest of component
}
```

### 5. Accessing Game State

```typescript
import { 
  useChessState, 
  useChessPieces, 
  useChessWinningTeam,
  useChessPromotion 
} from '@/hooks';

function GameStatus() {
  const state = useChessState(); // Full state
  const pieces = useChessPieces(); // Just pieces
  const winningTeam = useChessWinningTeam(); // Just winning team
  const promotion = useChessPromotion(); // Just promotion state

  return (
    <div>
      <p>Total Turns: {state.totalTurns}</p>
      <p>Pieces: {pieces.length}</p>
      {winningTeam && <p>Winner: {winningTeam}</p>}
      {promotion && <p>Promotion at: {promotion.position.x}, {promotion.position.y}</p>}
    </div>
  );
}
```

## Redux Integration

### Provider Setup

The Redux provider is already configured in [src/app/layout.tsx](src/app/layout.tsx) with the `ReduxProvider` component.

### Middleware

RTK Query middleware is automatically included in the store configuration for:
- Automatic cache management
- Revalidation logic
- Request deduplication

## API Integration

### Current Endpoints

#### Save Game
```
POST /api/chess/save
Body: { state: ChessState, gameId?: string }
Response: { gameId: string, savedAt: string, state: ChessState }
```

#### Load Game
```
GET /api/chess/load/:gameId
Response: { gameId: string, state: ChessState, createdAt: string, updatedAt: string }
```

#### List Games
```
GET /api/chess/games
Response: Array<{ gameId: string, createdAt: string, updatedAt: string }>
```

#### Delete Game
```
DELETE /api/chess/games/:gameId
Response: { success: boolean }
```

#### Validate Move
```
POST /api/chess/validate-move
Body: { state: ChessState, pieceId: string, to: Position }
Response: { valid: boolean, reason?: string }
```

## Extending RTK Query

To add new API endpoints:

1. **Add endpoint to [src/store/api/chessApi.ts](src/store/api/chessApi.ts)**

```typescript
export const chessApi = createApi({
  // ... existing config
  endpoints: (builder) => ({
    // ... existing endpoints
    myNewEndpoint: builder.query({
      query: (params) => `/my-endpoint/${params}`,
    }),
  }),
});

export const { useMyNewEndpointQuery } = chessApi;
```

2. **Add corresponding Route Handler in [app/api/chess/](app/api/chess/)**

```typescript
// app/api/chess/my-endpoint/route.ts
export async function GET(request: NextRequest) {
  // Implementation
}
```

## Benefits

- ✅ **Automatic Caching**: RTK Query manages cache automatically
- ✅ **Type Safety**: Full TypeScript support throughout
- ✅ **Optimized Rendering**: Only relevant components re-render on state changes
- ✅ **Easy Testing**: Redux state is easy to test and mock
- ✅ **Persistence Ready**: Save/load game functionality built-in
- ✅ **Scalable**: Easy to extend with more API endpoints

## Next Steps

1. Add database integration (replace in-memory storage in Route Handlers)
2. Add authentication for multi-user games
3. Add WebSocket support for real-time multiplayer
4. Add game replay functionality
5. Add move history/undo functionality with RTK Query caching
