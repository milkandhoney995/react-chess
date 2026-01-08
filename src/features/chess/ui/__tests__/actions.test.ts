
import { ChessUIAction } from "../actions";
import { PieceType, TeamType } from "@/domain/chess/types";

describe("ChessUIAction types", () => {
  const mockPiece = {
    id: "test-piece",
    type: PieceType.PAWN,
    team: TeamType.OUR,
    position: { x: 0, y: 1 },
    hasMoved: false,
    possibleMoves: [],
  };

  it("should create DRAG_START action", () => {
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

    expect(action.type).toBe("DRAG_START");
    expect(action.payload.piece).toBe(mockPiece);
    expect(action.payload.offsetX).toBe(10);
    expect(action.payload.offsetY).toBe(20);
    expect(action.payload.clientX).toBe(100);
    expect(action.payload.clientY).toBe(200);
  });

  it("should create DRAG_MOVE action", () => {
    const action: ChessUIAction = {
      type: "DRAG_MOVE",
      payload: {
        clientX: 150,
        clientY: 250,
      },
    };

    expect(action.type).toBe("DRAG_MOVE");
    expect(action.payload.clientX).toBe(150);
    expect(action.payload.clientY).toBe(250);
  });

  it("should create DRAG_END action", () => {
    const action: ChessUIAction = {
      type: "DRAG_END",
    };

    expect(action.type).toBe("DRAG_END");
  });

  it("should create DRAG_CANCEL action", () => {
    const action: ChessUIAction = {
      type: "DRAG_CANCEL",
    };

    expect(action.type).toBe("DRAG_CANCEL");
  });

  it("should have correct action type union", () => {
    const actions: ChessUIAction[] = [
      {
        type: "DRAG_START",
        payload: {
          piece: mockPiece,
          offsetX: 0,
          offsetY: 0,
          clientX: 0,
          clientY: 0,
        },
      },
      { type: "DRAG_MOVE", payload: { clientX: 0, clientY: 0 } },
      { type: "DRAG_END" },
      { type: "DRAG_CANCEL" },
    ];

    expect(actions).toHaveLength(4);
    expect(actions.map(a => a.type)).toEqual(["DRAG_START", "DRAG_MOVE", "DRAG_END", "DRAG_CANCEL"]);
  });
});
