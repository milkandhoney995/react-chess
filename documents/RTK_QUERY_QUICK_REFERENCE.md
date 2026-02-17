# RTK Query Quick Reference

## Import Examples

### Redux Hooks (Pre-typed)
```typescript
import { useAppDispatch, useAppSelector } from '@/hooks';

// Use pre-typed versions instead of useDispatch/useSelector
const dispatch = useAppDispatch();
const pieces = useAppSelector(state => state.chess.pieces);
```

### Chess Action Dispatchers
```typescript
import { useChessActions } from '@/hooks';

const { movePiece, promotePawn, resetGame } = useChessActions();

movePiece('pawn-1', { x: 4, y: 4 });
promotePawn({ x: 7, y: 7 }, PieceType.QUEEN);
resetGame();
```

### Chess State Selectors
```typescript
import { 
  useChessState,           // Full state
  useChessPieces,          // Just pieces
  useChessTotalTurns,      // Just turn count
  useChessWinningTeam,     // Just winner
  useChessPromotion        // Just promotion info
} from '@/hooks';

const state = useChessState();
const pieces = useChessPieces();
```

### RTK Query Hooks
```typescript
import { 
  useSaveGameMutation,     // Save game
  useLoadGameQuery,        // Load game
  useListGamesQuery,       // List games
  useDeleteGameMutation,   // Delete game
  useValidateMoveQuery     // Validate move
} from '@/store/api/chessApi';

// Mutation (POST, PUT, DELETE)
const [saveGame, { isLoading, error }] = useSaveGameMutation();
await saveGame({ state: currentState }).unwrap();

// Query (GET)
const { data, isLoading, isFetching } = useLoadGameQuery(gameId);
```

### Game Persistence
```typescript
import { useChessGamePersistence } from '@/hooks';

const { 
  saveGame,      // Save current game
  loadGame,      // Load a game
  isSaving,      // Is saving?
  isLoading      // Is loading?
} = useChessGamePersistence();
```

## Common Patterns

### Save Game on Move
```typescript
function ChessGame() {
  const { movePiece } = useChessActions();
  const { saveGame } = useChessGamePersistence();

  const handleMove = async (pieceId: string, pos: Position) => {
    movePiece(pieceId, pos);
    await saveGame(); // Auto-saves after move
  };
}
```

### Load and Display Games
```typescript
function GameLibrary() {
  const { data: games = [] } = useListGamesQuery();
  const dispatch = useAppDispatch();

  return (
    <ul>
      {games.map(game => (
        <li 
          key={game.gameId}
          onClick={() => {/* load game logic */}}
        >
          {game.gameId}
        </li>
      ))}
    </ul>
  );
}
```

### Display Game Status
```typescript
function GameStatus() {
  const state = useChessState();
  const winner = useChessWinningTeam();

  return (
    <div>
      <p>Move: {state.totalTurns}</p>
      {winner && <p>Winner: {winner}</p>}
    </div>
  );
}
```

### Validate Move Before Sending
```typescript
function ChessBoardSquare({ pieceId, position }) {
  const state = useChessState();
  const { data: validation } = useValidateMoveQuery(
    { state, pieceId, to: position },
    { skip: !pieceId } // Skip if no piece selected
  );

  return (
    <div className={validation?.valid ? 'valid-move' : ''}>
      {/* Square content */}
    </div>
  );
}
```

## API Endpoints

| Method | Path | Hook | Purpose |
|--------|------|------|---------|
| POST | `/api/chess/save` | `useSaveGameMutation` | Save game state |
| GET | `/api/chess/load/:gameId` | `useLoadGameQuery` | Load game state |
| GET | `/api/chess/games` | `useListGamesQuery` | List saved games |
| DELETE | `/api/chess/games/:gameId` | `useDeleteGameMutation` | Delete game |
| POST | `/api/chess/validate-move` | `useValidateMoveQuery` | Validate move |

## Error Handling

```typescript
// Mutation error handling
const [saveGame] = useSaveGameMutation();
try {
  const result = await saveGame({ state }).unwrap();
} catch (error) {
  console.error('Save failed:', error);
}

// Query error handling
const { data, error, isError } = useLoadGameQuery(gameId);
if (isError) {
  return <div>Error: {error.message}</div>;
}
```

## Type Safety Tips

✅ Always use pre-typed hooks:
```typescript
import { useAppDispatch, useAppSelector } from '@/hooks';
const dispatch = useAppDispatch(); // Fully typed dispatch
const state = useAppSelector(state => state.chess); // Fully typed
```

❌ Avoid generic hooks:
```typescript
import { useDispatch, useSelector } from 'react-redux';
const dispatch = useDispatch(); // NOT fully typed!
const state = useSelector(state => state.chess); // NOT fully typed!
```

## Testing Redux Components

Mock Redux store for component tests:
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import chessReducer from '@/store/slices/chessSlice';

const mockStore = configureStore({
  reducer: { chess: chessReducer }
});

render(
  <Provider store={mockStore}>
    <YourComponent />
  </Provider>
);
```

## Performance Optimization

### Use Granular Selectors
```typescript
// ✅ Good - only subscribes to pieces
const pieces = useChessPieces();

// ❌ Bad - subscribes to entire state, re-renders on any change
const { pieces } = useChessState();
```

### Use Query Skip
```typescript
// Only fetch when needed
const { data } = useLoadGameQuery(gameId, {
  skip: !gameId // Skip query if no gameId
});
```

### Use Normalization (Future)
For large chess datasets, consider using RTK Query's normalized caching:
```typescript
endpoints: (builder) => ({
  getGames: builder.query({
    query: () => '/games',
    serializeQueryArgs: ({ endpointName }) => endpointName,
    merge: (currentCache, newItems) => {
      currentCache.push(...newItems);
    },
    forceRefetch({ currentArg, previousArg }) {
      return currentArg !== previousArg;
    },
  }),
}),
```

---

For more details, see [RTK_QUERY_GUIDE.md](RTK_QUERY_GUIDE.md)
