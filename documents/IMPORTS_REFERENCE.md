# Redux Toolkit & RTK Query - Import Reference

## Redux Store & Hooks

### Store Configuration
```typescript
// src/store/index.ts
export const store: EnhancedStore<...>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Import in components:**
```typescript
import { store } from '@/store';
import type { RootState, AppDispatch } from '@/store';
```

---

## Pre-typed Redux Hooks

### Location: `src/store/hooks.ts`

**useAppDispatch** - Type-safe dispatch
```typescript
import { useAppDispatch } from '@/hooks';
// or
import { useAppDispatch } from '@/store/hooks';

const dispatch = useAppDispatch();
// TypeScript knows dispatch has type AppDispatch ✓
```

**useAppSelector** - Type-safe selector
```typescript
import { useAppSelector } from '@/hooks';
// or  
import { useAppSelector } from '@/store/hooks';

const pieces = useAppSelector(state => state.chess.pieces);
// TypeScript knows pieces type ✓
```

---

## Chess Redux Slice

### Location: `src/store/slices/chessSlice.ts`

**Exported Actions:**
```typescript
export const { 
  movePiece,      // (pieceId, to) => void
  promotePawn,    // (position, pieceType) => void
  resetGame,      // () => void
  setChessState   // (state) => void
} = chessSlice.actions;
```

**Exported Reducer:**
```typescript
export default chessSlice.reducer;
// Automatically registered in store
```

**Import actions in components:**
```typescript
import { movePiece, promotePawn, resetGame } from '@/store/slices/chessSlice';

const dispatch = useDispatch();
dispatch(movePiece({ pieceId: 'p1', to: { x: 4, y: 4 } }));
```

---

## RTK Query API

### Location: `src/store/api/chessApi.ts`

**Query Hooks:**
```typescript
export const {
  useLoadGameQuery,
  useListGamesQuery,
  useValidateMoveQuery,
} = chessApi;
```

**Mutation Hooks:**
```typescript
export const {
  useSaveGameMutation,
  useDeleteGameMutation,
} = chessApi;
```

**Import in components:**
```typescript
import { 
  useLoadGameQuery,
  useSaveGameMutation,
  useListGamesQuery,
  useDeleteGameMutation,
  useValidateMoveQuery
} from '@/store/api/chessApi';

// Query
const { data: game, isLoading } = useLoadGameQuery(gameId);

// Mutation
const [saveGame, { isLoading: isSaving }] = useSaveGameMutation();
await saveGame({ state: currentState }).unwrap();
```

---

## Chess Game Actions Custom Hook

### Location: `src/hooks/useChessActions.ts`

**Exported:**
```typescript
export const useChessActions = () => ({
  movePiece: (pieceId, to) => void,
  promotePawn: (position, pieceType) => void,
  resetGame: () => void,
  setChessState: (state) => void,
});
```

**Import in components:**
```typescript
import { useChessActions } from '@/hooks';

const { movePiece, promotePawn, resetGame } = useChessActions();
movePiece('pawn-1', { x: 4, y: 4 });
```

---

## Chess State Selectors Custom Hooks

### Location: `src/hooks/useChessSelectors.ts`

**Exported:**
```typescript
export const useChessState = () => ChessState;
export const useChessPieces = () => Piece[];
export const useChessTotalTurns = () => number;
export const useChessWinningTeam = () => TeamType | undefined;
export const useChessPromotion = () => PromotionState | undefined;
```

**Import in components:**
```typescript
import { 
  useChessState,
  useChessPieces,
  useChessTotalTurns,
  useChessWinningTeam,
  useChessPromotion
} from '@/hooks';

const state = useChessState();
const pieces = useChessPieces();
const turn = useChessTotalTurns();
const winner = useChessWinningTeam();
const promo = useChessPromotion();
```

---

## Chess Game Persistence Hook

### Location: `src/hooks/useChessGamePersistence.ts`

**Exported:**
```typescript
export const useChessGamePersistence = () => ({
  saveGame: (gameId?) => Promise<string>,
  loadGame: (gameId) => Promise<LoadedGame>,
  isSaving: boolean,
  isLoading: boolean,
  isFetching: boolean,
});
```

**Import in components:**
```typescript
import { useChessGamePersistence } from '@/hooks';

const { saveGame, loadGame, isSaving } = useChessGamePersistence();

// Save current game
const gameId = await saveGame();

// Load specific game
await loadGame(gameId);
```

---

## Barrel Export (All Hooks)

### Location: `src/hooks/index.ts`

**All-in-one import:**
```typescript
import { 
  // Redux hooks (pre-typed)
  useAppDispatch,
  useAppSelector,
  
  // Chess actions
  useChessActions,
  
  // Chess selectors
  useChessState,
  useChessPieces,
  useChessTotalTurns,
  useChessWinningTeam,
  useChessPromotion,
  
  // Persistence
  useChessGamePersistence,
  
  // Original hooks
  useDragAndDrop
} from '@/hooks';
```

---

## Redux Provider

### Location: `src/providers/ReduxProvider.tsx`

**Usage in layout:**
```typescript
import { ReduxProvider } from '@/providers/ReduxProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
```

---

## API Route Handlers

### Save Game: `app/api/chess/save/route.ts`
```typescript
import { saveParsing POST request
// POST /api/chess/save
// Body: { state: ChessState, gameId?: string }
// Returns: { gameId, savedAt, state }
```

### Load Game: `app/api/chess/load/[gameId]/route.ts`
```typescript
// GET /api/chess/load/:gameId
// Returns: { gameId, state, createdAt, updatedAt }
```

### List/Delete Games: `app/api/chess/games/route.ts`
```typescript
// GET /api/chess/games
// Returns: [{ gameId, createdAt, updatedAt }]
// DELETE /api/chess/games/:gameId
// Returns: { success: boolean }
```

### Validate Move: `app/api/chess/validate-move/route.ts`
```typescript
// POST /api/chess/validate-move
// Body: { state, pieceId, to }
// Returns: { valid: boolean, reason?: string }
```

---

## Type Definitions

### RootState
```typescript
type RootState = {
  chess: {
    pieces: Piece[];
    totalTurns: number;
    winningTeam?: TeamType;
    promotion?: PromotionState;
  };
  [chessApi.reducerPath]: {
    queries: {...};
    mutations: {...};
    provided: {...};
    subscriptions: {...};
  };
};
```

### AppDispatch
```typescript
type AppDispatch = typeof store.dispatch;
// Knows about all actions from all slices
```

---

## Common Import Patterns

### Simple Component
```typescript
import { useChessState, useChessActions } from '@/hooks';

export function MyComponent() {
  const state = useChessState();
  const { movePiece } = useChessActions();
  // ...
}
```

### With API Integration
```typescript
import { useChessState, useChessActions } from '@/hooks';
import { useSaveGameMutation } from '@/store/api/chessApi';

export function GameController() {
  const state = useChessState();
  const { movePiece } = useChessActions();
  const [saveGame] = useSaveGameMutation();
  // ...
}
```

### With Pre-typed Hooks
```typescript
import { useAppDispatch, useAppSelector } from '@/hooks';
import { movePiece } from '@/store/slices/chessSlice';

export function ChessBoard() {
  const dispatch = useAppDispatch();
  const pieces = useAppSelector(state => state.chess.pieces);
  
  const handleMove = () => {
    dispatch(movePiece({ ... }));
  };
  // ...
}
```

### With Persistence
```typescript
import { 
  useChessState, 
  useChessGamePersistence,
  useChessActions
} from '@/hooks';

export function GameManager() {
  const state = useChessState();
  const { resetGame } = useChessActions();
  const { saveGame, loadGame } = useChessGamePersistence();
  // ...
}
```

---

## Recommended Import Organization

### By Priority

**1️⃣ Use Specific Custom Hooks First**
```typescript
import { useChessActions, useChessPieces } from '@/hooks';
```

**2️⃣ Use Query/Mutation Hooks When Needed**
```typescript
import { useSaveGameMutation } from '@/store/api/chessApi';
```

**3️⃣ Use Pre-typed Hooks Only When Necessary**
```typescript
import { useAppDispatch, useAppSelector } from '@/hooks';
```

**4️⃣ Direct Redux Rarely (Almost Never)**
```typescript
import { useDispatch, useSelector } from 'react-redux'; // ❌ Avoid
```

---

## Tree Shaking & Bundle Size

✅ **Good** - Only imports what's used:
```typescript
import { useChessPieces } from '@/hooks';
// Only useChessPieces bundled
```

❌ **Bad** - Imports everything:
```typescript
import { useChessState, useChessPieces, useChessActions } from '@/hooks';
// All hooks bundled even if not used
```

✅ **Better** - Import separately:
```typescript
import { useChessPieces } from '@/hooks/useChessSelectors';
import { useChessActions } from '@/hooks/useChessActions';
```

---

For complete examples, see:
- [RTK_QUERY_QUICK_REFERENCE.md](RTK_QUERY_QUICK_REFERENCE.md)
- [RTK_QUERY_GUIDE.md](RTK_QUERY_GUIDE.md)
