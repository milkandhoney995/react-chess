import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import useDragAndDrop from "../useDragAndDrop";
import { Piece, PieceType, TeamType } from "../../domain/chess/types";

describe("useDragAndDrop", () => {
  const mockPiece: Piece = {
    id: "test-piece",
    type: PieceType.PAWN,
    team: TeamType.OUR,
    position: { x: 0, y: 1 },
    hasMoved: false,
    possibleMoves: [],
  };

  const mockOnDrop = vi.fn();
  const mockOnDragEnd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with no drag state", () => {
    const { result } = renderHook(() =>
      useDragAndDrop({ onDrop: mockOnDrop })
    );

    expect(result.current.dragState).toBeNull();
    expect(result.current.chessboardRef.current).toBeNull();
  });

  it("should start dragging on pointer down", () => {
    const { result } = renderHook(() =>
      useDragAndDrop({ onDrop: mockOnDrop })
    );

    const mockElement = {
      getBoundingClientRect: () => ({
        left: 100,
        top: 100,
        width: 400,
        height: 400,
      }),
    } as HTMLElement;

    const mockEvent = {
      preventDefault: vi.fn(),
      currentTarget: mockElement,
      clientX: 150,
      clientY: 150,
    } as unknown as React.PointerEvent;

    act(() => {
      result.current.onPointerDown(mockEvent, mockPiece);
    });

    expect(result.current.dragState).not.toBeNull();
    expect(result.current.dragState?.piece).toBe(mockPiece);
    expect(result.current.dragState?.offsetX).toBe(50);
    expect(result.current.dragState?.offsetY).toBe(50);
    expect(result.current.dragState?.clientX).toBe(150);
    expect(result.current.dragState?.clientY).toBe(150);
  });

  it("should update drag position on pointer move", () => {
    const { result } = renderHook(() =>
      useDragAndDrop({ onDrop: mockOnDrop })
    );

    // Start drag first
    const mockElement = {
      getBoundingClientRect: () => ({
        left: 100,
        top: 100,
        width: 400,
        height: 400,
      }),
    } as HTMLElement;

    const startEvent = {
      preventDefault: vi.fn(),
      currentTarget: mockElement,
      clientX: 150,
      clientY: 150,
    } as unknown as React.PointerEvent;

    act(() => {
      result.current.onPointerDown(startEvent, mockPiece);
    });

    // Move
    const moveEvent = {
      clientX: 200,
      clientY: 200,
    } as unknown as React.PointerEvent;

    act(() => {
      result.current.onPointerMove(moveEvent);
    });

    expect(result.current.dragState?.clientX).toBe(200);
    expect(result.current.dragState?.clientY).toBe(200);
  });

  it("should not update position when not dragging", () => {
    const { result } = renderHook(() =>
      useDragAndDrop({ onDrop: mockOnDrop })
    );

    const moveEvent = {
      clientX: 200,
      clientY: 200,
    } as unknown as React.PointerEvent;

    act(() => {
      result.current.onPointerMove(moveEvent);
    });

    expect(result.current.dragState).toBeNull();
  });

  it("should drop piece on pointer up", () => {
    const { result } = renderHook(() =>
      useDragAndDrop({ onDrop: mockOnDrop, onDragEnd: mockOnDragEnd })
    );

    // Mock chessboard ref
    const mockChessboard = {
      getBoundingClientRect: () => ({
        left: 100,
        top: 100,
        width: 400,
        height: 400,
      }),
    } as HTMLDivElement;

    result.current.chessboardRef.current = mockChessboard;

    // Start drag
    const mockElement = {
      getBoundingClientRect: () => ({
        left: 100,
        top: 100,
        width: 400,
        height: 400,
      }),
    } as HTMLElement;

    const startEvent = {
      preventDefault: vi.fn(),
      currentTarget: mockElement,
      clientX: 150,
      clientY: 150,
    } as unknown as React.PointerEvent;

    act(() => {
      result.current.onPointerDown(startEvent, mockPiece);
    });

    // End drag
    const endEvent = {
      clientX: 250, // Should map to x=1 (250-100)/100 = 1.5 -> floor(1) = 1
      clientY: 200, // Should map to y=6 (7 - (200-100)/100) = 7 - 1 = 6
    } as unknown as React.PointerEvent;

    act(() => {
      result.current.onPointerUp(endEvent);
    });

    expect(mockOnDrop).toHaveBeenCalledWith("test-piece", { x: 1, y: 6 });
    expect(mockOnDragEnd).toHaveBeenCalled();
    expect(result.current.dragState).toBeNull();
  });

  it("should handle drag end when no chessboard ref", () => {
    const { result } = renderHook(() =>
      useDragAndDrop({ onDrop: mockOnDrop, onDragEnd: mockOnDragEnd })
    );

    // Start drag
    const mockElement = {
      getBoundingClientRect: () => ({
        left: 100,
        top: 100,
        width: 400,
        height: 400,
      }),
    } as HTMLElement;

    const startEvent = {
      preventDefault: vi.fn(),
      currentTarget: mockElement,
      clientX: 150,
      clientY: 150,
    } as unknown as React.PointerEvent;

    act(() => {
      result.current.onPointerDown(startEvent, mockPiece);
    });

    // End drag without chessboard ref
    const endEvent = {
      clientX: 250,
      clientY: 200,
    } as unknown as React.PointerEvent;

    act(() => {
      result.current.onPointerUp(endEvent);
    });

    expect(mockOnDrop).not.toHaveBeenCalled();
    expect(mockOnDragEnd).toHaveBeenCalled();
    expect(result.current.dragState).toBeNull();
  });

  it("should handle drag end when not dragging", () => {
    const { result } = renderHook(() =>
      useDragAndDrop({ onDrop: mockOnDrop, onDragEnd: mockOnDragEnd })
    );

    const endEvent = {
      clientX: 250,
      clientY: 200,
    } as unknown as React.PointerEvent;

    act(() => {
      result.current.onPointerUp(endEvent);
    });

    expect(mockOnDrop).not.toHaveBeenCalled();
    expect(mockOnDragEnd).toHaveBeenCalled();
  });

  it("should clamp board position within bounds", () => {
    const { result } = renderHook(() =>
      useDragAndDrop({ onDrop: mockOnDrop })
    );

    // Mock chessboard ref
    const mockChessboard = {
      getBoundingClientRect: () => ({
        left: 100,
        top: 100,
        width: 400,
        height: 400,
      }),
    } as HTMLDivElement;

    result.current.chessboardRef.current = mockChessboard;

    // Start drag
    const mockElement = {
      getBoundingClientRect: () => ({
        left: 100,
        top: 100,
        width: 400,
        height: 400,
      }),
    } as HTMLElement;

    const startEvent = {
      preventDefault: vi.fn(),
      currentTarget: mockElement,
      clientX: 150,
      clientY: 150,
    } as unknown as React.PointerEvent;

    act(() => {
      result.current.onPointerDown(startEvent, mockPiece);
    });

    // End drag outside bounds
    const endEvent = {
      clientX: 50, // Left of board
      clientY: 50, // Above board
    } as unknown as React.PointerEvent;

    act(() => {
      result.current.onPointerUp(endEvent);
    });

    // Should clamp to (0,7) - left edge and top edge
    expect(mockOnDrop).toHaveBeenCalledWith("test-piece", { x: 0, y: 7 });
  });
});
