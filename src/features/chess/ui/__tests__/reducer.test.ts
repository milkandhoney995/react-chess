
import { chessUIReducer, initialChessUIState } from "../reducer";
import { ChessUIAction } from "../actions";
import { PieceType, TeamType } from "@/domain/chess/types";

describe("chessUIReducer", () => {
  const mockPiece = {
    id: "test-piece",
    type: PieceType.PAWN,
    team: TeamType.OUR,
    position: { x: 0, y: 1 },
    hasMoved: false,
    possibleMoves: [],
  };

  it("should return initial state for unknown action: 未知のアクションに対して初期状態を返す", () => {
    const action = { type: "UNKNOWN" } as any;
    const result = chessUIReducer(initialChessUIState, action);
    expect(result).toBe(initialChessUIState);
  });

  describe("DRAG_START", () => {
    it("should start dragging with correct state: ドラッグを開始し、正しい状態を設定する", () => {
      const action: ChessUIAction = {
        type: "DRAG_START",
        payload: {
          piece: mockPiece,
          offsetX: 10,
          offsetY: 20,
          clientX: 100,
          clientY: 200,
        },
      };

      const result = chessUIReducer(initialChessUIState, action);

      expect(result.drag).toEqual({
        piece: mockPiece,
        offsetX: 10,
        offsetY: 20,
        clientX: 100,
        clientY: 200,
      });
    });
  });

  describe("DRAG_MOVE", () => {
    it("should update drag position when dragging: ドラッグ中に位置を更新する", () => {
      // First start dragging
      const startAction: ChessUIAction = {
        type: "DRAG_START",
        payload: {
          piece: mockPiece,
          offsetX: 10,
          offsetY: 20,
          clientX: 100,
          clientY: 200,
        },
      };

      const stateAfterStart = chessUIReducer(initialChessUIState, startAction);

      // Then move
      const moveAction: ChessUIAction = {
        type: "DRAG_MOVE",
        payload: {
          clientX: 150,
          clientY: 250,
        },
      };

      const result = chessUIReducer(stateAfterStart, moveAction);

      expect(result.drag?.clientX).toBe(150);
      expect(result.drag?.clientY).toBe(250);
      expect(result.drag?.piece).toBe(mockPiece); // Other properties should remain
      expect(result.drag?.offsetX).toBe(10);
      expect(result.drag?.offsetY).toBe(20);
    });

    it("should not update position when not dragging: ドラッグしていない場合、位置を更新しない", () => {
      const moveAction: ChessUIAction = {
        type: "DRAG_MOVE",
        payload: {
          clientX: 150,
          clientY: 250,
        },
      };

      const result = chessUIReducer(initialChessUIState, moveAction);
      expect(result).toBe(initialChessUIState);
    });
  });

  describe("DRAG_END", () => {
    it("should clear drag state: ドラッグ状態をクリアする", () => {
      // First start dragging
      const startAction: ChessUIAction = {
        type: "DRAG_START",
        payload: {
          piece: mockPiece,
          offsetX: 10,
          offsetY: 20,
          clientX: 100,
          clientY: 200,
        },
      };

      const stateAfterStart = chessUIReducer(initialChessUIState, startAction);

      // Then end drag
      const endAction: ChessUIAction = {
        type: "DRAG_END",
      };

      const result = chessUIReducer(stateAfterStart, endAction);

      expect(result.drag).toBeNull();
    });
  });

  describe("DRAG_CANCEL", () => {
    it("should clear drag state: ドラッグ状態をクリアする", () => {
      // First start dragging
      const startAction: ChessUIAction = {
        type: "DRAG_START",
        payload: {
          piece: mockPiece,
          offsetX: 10,
          offsetY: 20,
          clientX: 100,
          clientY: 200,
        },
      };

      const stateAfterStart = chessUIReducer(initialChessUIState, startAction);

      // Then cancel drag
      const cancelAction: ChessUIAction = {
        type: "DRAG_CANCEL",
      };

      const result = chessUIReducer(stateAfterStart, cancelAction);

      expect(result.drag).toBeNull();
    });
  });
});
