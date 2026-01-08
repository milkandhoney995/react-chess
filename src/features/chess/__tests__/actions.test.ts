
import { ChessAction } from "../actions";
import { PieceType, Position } from "@/domain/chess/types";

describe("ChessAction types", () => {
  it("should create MOVE_PIECE action: MOVE_PIECEアクションを作成する", () => {
    const action: ChessAction = {
      type: "MOVE_PIECE",
      payload: {
        pieceId: "pawn-1",
        to: { x: 0, y: 1 } as Position,
      },
    };

    expect(action.type).toBe("MOVE_PIECE");
    expect(action.payload.pieceId).toBe("pawn-1");
    expect(action.payload.to).toEqual({ x: 0, y: 1 });
  });

  it("should create PROMOTE_PAWN action: PROMOTE_PAWNアクションを作成する", () => {
    const action: ChessAction = {
      type: "PROMOTE_PAWN",
      payload: {
        position: { x: 0, y: 7 } as Position,
        pieceType: PieceType.QUEEN,
      },
    };

    expect(action.type).toBe("PROMOTE_PAWN");
    expect(action.payload.position).toEqual({ x: 0, y: 7 });
    expect(action.payload.pieceType).toBe(PieceType.QUEEN);
  });

  it("should create RESET_GAME action: RESET_GAMEアクションを作成する", () => {
    const action: ChessAction = {
      type: "RESET_GAME",
    };

    expect(action.type).toBe("RESET_GAME");
  });

  it("should have correct action type union: 正しいアクションタイプのユニオンを持っているか", () => {
    const actions: ChessAction[] = [
      { type: "MOVE_PIECE", payload: { pieceId: "test", to: { x: 0, y: 0 } } },
      { type: "PROMOTE_PAWN", payload: { position: { x: 0, y: 0 }, pieceType: PieceType.QUEEN } },
      { type: "RESET_GAME" },
    ];

    expect(actions).toHaveLength(3);
    expect(actions.map(a => a.type)).toEqual(["MOVE_PIECE", "PROMOTE_PAWN", "RESET_GAME"]);
  });
});
