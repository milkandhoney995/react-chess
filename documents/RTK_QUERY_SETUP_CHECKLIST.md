# RTK Query Setup Checklist ✅

## Installation & Setup

- [x] **Redux Toolkit installed** (`@reduxjs/toolkit`)
- [x] **React-Redux installed** (`react-redux`)
- [x] **Store configured** (`src/store/index.ts`)
- [x] **ReduxProvider added to layout** (`src/app/layout.tsx`)
- [ ] **Run `npm install`** to install dependencies (you still need to do this)

## Core Files Created

- [x] **Store Configuration**
  - [x] `src/store/index.ts` - Store setup
  - [x] `src/store/hooks.ts` - Pre-typed hooks

- [x] **Redux Slice**
  - [x] `src/store/slices/chessSlice.ts` - Game state management

- [x] **RTK Query API**
  - [x] `src/store/api/chessApi.ts` - API definitions

- [x] **Custom Hooks**
  - [x] `src/hooks/useChessActions.ts` - Action dispatchers
  - [x] `src/hooks/useChessSelectors.ts` - State selectors
  - [x] `src/hooks/useChessGamePersistence.ts` - Persistence helpers
  - [x] `src/hooks/index.ts` - Barrel export

- [x] **Provider**
  - [x] `src/providers/ReduxProvider.tsx` - Redux wrapper component

- [x] **API Routes**
  - [x] `app/api/chess/save/route.ts` - POST /api/chess/save
  - [x] `app/api/chess/load/[gameId]/route.ts` - GET /api/chess/load/:gameId
  - [x] `app/api/chess/games/route.ts` - GET/DELETE /api/chess/games
  - [x] `app/api/chess/validate-move/route.ts` - POST /api/chess/validate-move

- [x] **Updated Components**
  - [x] `src/app/layout.tsx` - Added ReduxProvider
  - [x] `src/features/chess/ChessGameContainer.tsx` - Using Redux hooks

## Documentation Created

- [x] `RTK_QUERY_GUIDE.md` - Complete usage guide
- [x] `RTK_QUERY_QUICK_REFERENCE.md` - Quick reference with examples
- [x] `RTK_QUERY_ARCHITECTURE.md` - Architecture diagrams
- [x] `RTK_QUERY_IMPLEMENTATION.md` - Implementation summary

## Before Running Tests

- [ ] Run `npm install` to install Redux Toolkit and React-Redux
- [ ] Verify no TypeScript errors: `npm run lint`
- [ ] Run tests: `npm test` (should pass)
- [ ] Start dev server: `npm run dev`

## Quick Start Guide

### 1. Install Dependencies
```bash
npm install @reduxjs/toolkit react-redux
```

### 2. Basic Usage in Component

```typescript
import { useChessActions, useChessState } from '@/hooks';

function MyComponent() {
  const { movePiece } = useChessActions();
  const state = useChessState();

  return (
    <button onClick={() => movePiece('pawn-1', { x: 4, y: 4 })}>
      Move
    </button>
  );
}
```

### 3. Save/Load Games

```typescript
import { useChessGamePersistence } from '@/hooks';

function SaveButton() {
  const { saveGame, isSaving } = useChessGamePersistence();

  return (
    <button 
      onClick={() => saveGame()}
      disabled={isSaving}
    >
      Save Game
    </button>
  );
}
```

### 4. RTK Query Endpoints

```typescript
import { 
  useSaveGameMutation,
  useLoadGameQuery,
  useListGamesQuery 
} from '@/store/api/chessApi';

// Save
const [saveGame] = useSaveGameMutation();

// Load
const { data: game } = useLoadGameQuery(gameId);

// List
const { data: games } = useListGamesQuery();
```

## Common Tasks

### Accessing Game State
```typescript
import { useChessState } from '@/hooks';
const state = useChessState(); // Full state
// Or use granular selectors:
import { useChessPieces, useChessWinningTeam } from '@/hooks';
```

### Dispatching Actions
```typescript
import { useChessActions } from '@/hooks';
const { movePiece, promotePawn, resetGame } = useChessActions();
```

### Saving/Loading
```typescript
import { useChessGamePersistence } from '@/hooks';
const { saveGame, loadGame } = useChessGamePersistence();
```

### Using Pre-typed Hooks
```typescript
import { useAppDispatch, useAppSelector } from '@/hooks';
const dispatch = useAppDispatch(); // Fully typed
const state = useAppSelector(state => state.chess); // Fully typed
```

## Testing

### Test a Redux reducer
```typescript
import { chessSlice } from '@/store/slices/chessSlice';

test('movePiece action', () => {
  const initialState = chessSlice.getInitialState();
  const action = { ...chessSlice.actions.movePiece(...) };
  const result = chessSlice.reducer(initialState, action);
  expect(result.totalTurns).toBe(1);
});
```

### Test a component with Redux
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import chessReducer from '@/store/slices/chessSlice';

const mockStore = configureStore({
  reducer: { chess: chessReducer }
});

render(
  <Provider store={mockStore}>
    <MyComponent />
  </Provider>
);
```

## API Endpoints Reference

| Endpoint | Method | RTK Query Hook | Purpose |
|----------|--------|---|---------|
| `/api/chess/save` | POST | `useSaveGameMutation` | Save game state |
| `/api/chess/load/:gameId` | GET | `useLoadGameQuery` | Load saved game |
| `/api/chess/games` | GET | `useListGamesQuery` | List all saved games |
| `/api/chess/games/:gameId` | DELETE | `useDeleteGameMutation` | Delete a game |
| `/api/chess/validate-move` | POST | `useValidateMoveQuery` | Validate a move |

## Extending RTK Query

### Add a new API endpoint

1. **Add to `src/store/api/chessApi.ts`:**
```typescript
endpoints: (builder) => ({
  myNewEndpoint: builder.query({
    query: (params) => `/my-endpoint/${params}`,
    providesTags: ['Game'],
  }),
});

export const { useMyNewEndpointQuery } = chessApi;
```

2. **Create Route Handler in `app/api/chess/my-endpoint/route.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Implementation
  return NextResponse.json({ data: 'result' });
}
```

3. **Use in component:**
```typescript
import { useMyNewEndpointQuery } from '@/store/api/chessApi';
const { data } = useMyNewEndpointQuery(params);
```

## Performance Optimization

- [x] Use granular selectors (e.g., `useChessPieces` instead of `useChessState`)
- [x] Use RTK Query's `skip` parameter to prevent unnecessary requests
- [ ] Implement normalized caching for large datasets
- [ ] Add request deduplication (already built-in)
- [ ] Monitor Redux devtools in development

## Troubleshooting

### "Cannot find module '@/store'"
- Make sure `tsconfig.json` has the path alias configured
- Run `npm install` to ensure all packages are installed

### "Provider is not defined"
- Make sure `ReduxProvider` is imported and used in `layout.tsx`
- Check that `ReduxProvider` is wrapping `{children}`

### Stale data issues
- Use RTK Query's invalidation tags to refresh cache
- Check the `tagTypes` and `providesTags`/`invalidatesTags` configuration

### State not updating
- Ensure you're using `dispatch` correctly
- Check Redux DevTools to see action history
- Verify reducers are in the store config

## Next Steps

1. **Database Integration**
   - Replace in-memory storage with database
   - Update Route Handlers to use database queries

2. **Authentication**
   - Add user authentication
   - Store games per user

3. **Real-time Updates**
   - Add WebSocket support for multiplayer
   - Use RTK Query subscriptions

4. **Game Features**
   - Move history/undo
   - Game statistics
   - Achievements

5. **Testing**
   - Add unit tests for reducers
   - Add integration tests for API routes
   - Add component tests with mock store

## Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [React-Redux Hooks API](https://react-redux.js.org/api/hooks)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## Support Files

- 📖 [RTK Query Guide](RTK_QUERY_GUIDE.md)
- ⚡ [Quick Reference](RTK_QUERY_QUICK_REFERENCE.md)
- 🏗️ [Architecture](RTK_QUERY_ARCHITECTURE.md)
- 📝 [Implementation Summary](RTK_QUERY_IMPLEMENTATION.md)

---

✅ **Setup Complete!** You're ready to use RTK Query in your chess application.

**Next Action:** Run `npm install` to install the dependencies, then you can start building!
