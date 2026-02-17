# RTK Query Architecture Diagram

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Components                             │
│  (ChessGame, Chessboard, Square, GameStatus, etc.)              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │      Custom Hooks Layer            │
        ├────────────────────────────────────┤
        │ ✓ useChessActions                  │
        │   - movePiece()                    │
        │   - promotePawn()                  │
        │   - resetGame()                    │
        │                                    │
        │ ✓ useChessSelectors                │
        │   - useChessState()                │
        │   - useChessPieces()               │
        │   - useChessWinningTeam()          │
        │                                    │
        │ ✓ useChessGamePersistence          │
        │   - saveGame()                     │
        │   - loadGame()                     │
        │                                    │
        │ ✓ useAppDispatch/useAppSelector    │
        │   (Pre-typed Redux hooks)          │
        └────────────────────────────────────┘
                    │           │
        ┌───────────┘           └───────────┐
        │                                   │
        ▼                                   ▼
    ┌─────────────────┐         ┌──────────────────┐
    │  Redux Store    │         │  RTK Query API   │
    │  (chessSlice)   │         │                  │
    ├─────────────────┤         ├──────────────────┤
    │ State:          │         │ Queries:         │
    │ • pieces[]      │         │ • loadGame       │
    │ • totalTurns    │         │ • listGames      │
    │ • winningTeam   │         │ • validateMove   │
    │ • promotion     │         │                  │
    │                 │         │ Mutations:       │
    │ Actions:        │         │ • saveGame       │
    │ • MOVE_PIECE    │         │ • deleteGame     │
    │ • PROMOTE_PAWN  │         │                  │
    │ • RESET_GAME    │         │ (+ Caching)      │
    │ • SET_STATE     │         │ (+ Invalidation) │
    └─────────────────┘         └──────────────────┘
            │                           │
            └───────────┬───────────────┘
                        │
                        ▼
        ┌───────────────────────────────────┐
        │  Redux Middleware                 │
        │  • Immer (immutable updates)      │
        │  • RTK Query middleware           │
        │  • Logger (dev only)              │
        └───────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────┐
        │  Redux Store State Tree           │
        ├───────────────────────────────────┤
        │ {                                 │
        │   chess: {                        │
        │     pieces: [...],                │
        │     totalTurns: 42,               │
        │     winningTeam: null,            │
        │     promotion: null               │
        │   },                              │
        │   chessApi: {                     │
        │     queries: {...},               │
        │     mutations: {...}              │
        │   }                               │
        │ }                                 │
        └───────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────┐
        │  Network Layer                    │
        │  (Fetch API)                      │
        └───────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┬─────────────────┐
        │               │               │                 │
        ▼               ▼               ▼                 ▼
    POST/save       GET/load       GET/games       POST/validate
    │               │              │               │
    ▼               ▼              ▼               ▼
┌──────────┐   ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Next.js  │   │ Next.js  │  │ Next.js  │  │ Next.js  │
│ Route    │   │ Route    │  │ Route    │  │ Route    │
│ Handler  │   │ Handler  │  │ Handler  │  │ Handler  │
└──────────┘   └──────────┘  └──────────┘  └──────────┘
   │               │              │              │
   ▼               ▼              ▼              ▼
 Save State    Load State   List Games    Validate Move
 to Memory     from Memory  from Memory   using Util Fn
```

## Component Integration

```
src/app/layout.tsx
│
└─ ReduxProvider
   │
   └─ All child components can now:
      ├─ Dispatch Redux actions
      ├─ Select from Redux store
      ├─ Call RTK Query endpoints
      └─ Use custom hooks
```

## File Dependencies

```
ChessGameContainer
├─ useChessActions → movePiece, promotePawn
├─ useChessState → read current state
├─ useDispatch → for custom dispatch
└─ useSelector → for direct state access

ChessGame (child)
├─ useChessGameViewModel → format state for display
├─ ChessPieces (utilities from domain)
└─ GameStatus (child)

Store
├─ configureStore
│  ├─ chessSlice (game state)
│  └─ chessApi (RTK Query)
│
└─ Middleware
   ├─ Immer
   ├─ RTK Query
   └─ Logger (dev)

chessApi
├─ useLoadGameQuery
├─ useSaveGameMutation
├─ useListGamesQuery
├─ useDeleteGameMutation
└─ useValidateMoveQuery

Route Handlers
├─ /api/chess/save → POST
├─ /api/chess/load/[gameId] → GET
├─ /api/chess/games → GET, DELETE
└─ /api/chess/validate-move → POST
```

## State Update Flow (Example: Move Piece)

```
1. User clicks piece on board
   ↓
2. ChessGameContainer.onMovePiece called
   ↓
3. Dispatch movePiece action
   dispatch(movePiece({ pieceId: '...', to: {...} }))
   ↓
4. Redux Middleware (Immer)
   Updates state immutably
   ↓
5. chessSlice reducer
   • Find piece
   • Call movePieceUtil (domain logic)
   • Update pieces array
   • Increment totalTurns
   • Check for winner
   ↓
6. State updated in Redux store
   ↓
7. Components subscribed to state
   useChessPieces() → component re-renders
   ↓
8. UI updates reflect new piece position
   ↓
9. (Optional) Call RTK Query
   saveGame() → persists to backend
```

## Caching Strategy

```
RTK Query Cache
├─ Query: loadGame
│  └─ Cached: {gameId → gameState}
│
├─ Query: listGames
│  └─ Cached: [games list]
│
└─ Mutation: saveGame
   └─ Invalidates: ['Game'] tag
      └─ Re-fetches: loadGame, listGames
```

## Type Flow

```
Redux State (chessSlice.ts)
    ↓
RootState type
    ↓
useAppSelector
    ↓
Component knows exact state type
    ↓
TypeScript catches errors ✓

RTK Query Response
    ↓
saveGame payload type
    ↓
useSaveGameMutation
    ↓
Component knows exact response type
    ↓
TypeScript catches errors ✓
```

## Error Boundaries

```
Component
    │
    └─ try/catch around async RTK Query
    │
    └─ Error boundary for render errors
    │
    └─ RTK Query handles network errors
    │
    └─ Route Handlers provide validation errors
```

---

See [RTK_QUERY_GUIDE.md](RTK_QUERY_GUIDE.md) for more implementation details.
