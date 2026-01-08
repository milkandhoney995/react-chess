
import { initialChessState } from "../state";
import { PieceType, TeamType } from "@/domain/chess/types";

describe("initialChessState", () => {
  it("should have correct initial values", () => {
    expect(initialChessState.totalTurns).toBe(0);
    expect(initialChessState.winningTeam).toBeUndefined();
    expect(initialChessState.promotion).toBeUndefined();
  });

  it("should have 32 pieces on the board", () => {
    expect(initialChessState.pieces).toHaveLength(32);
  });

  it("should have correct piece distribution", () => {
    const pieces = initialChessState.pieces;

    // Count pieces by type and team
    const ourPieces = pieces.filter(p => p.team === TeamType.OUR);
    const opponentPieces = pieces.filter(p => p.team === TeamType.OPPONENT);

    expect(ourPieces).toHaveLength(16);
    expect(opponentPieces).toHaveLength(16);

    // Check OUR team pieces
    expect(ourPieces.filter(p => p.type === PieceType.PAWN)).toHaveLength(8);
    expect(ourPieces.filter(p => p.type === PieceType.ROOK)).toHaveLength(2);
    expect(ourPieces.filter(p => p.type === PieceType.KNIGHT)).toHaveLength(2);
    expect(ourPieces.filter(p => p.type === PieceType.BISHOP)).toHaveLength(2);
    expect(ourPieces.filter(p => p.type === PieceType.QUEEN)).toHaveLength(1);
    expect(ourPieces.filter(p => p.type === PieceType.KING)).toHaveLength(1);

    // Check OPPONENT team pieces
    expect(opponentPieces.filter(p => p.type === PieceType.PAWN)).toHaveLength(8);
    expect(opponentPieces.filter(p => p.type === PieceType.ROOK)).toHaveLength(2);
    expect(opponentPieces.filter(p => p.type === PieceType.KNIGHT)).toHaveLength(2);
    expect(opponentPieces.filter(p => p.type === PieceType.BISHOP)).toHaveLength(2);
    expect(opponentPieces.filter(p => p.type === PieceType.QUEEN)).toHaveLength(1);
    expect(opponentPieces.filter(p => p.type === PieceType.KING)).toHaveLength(1);
  });

  it("should have pieces in correct starting positions", () => {
    const pieces = initialChessState.pieces;

    // Check OUR king position
    const ourKing = pieces.find(p => p.type === PieceType.KING && p.team === TeamType.OUR);
    expect(ourKing?.position).toEqual({ x: 4, y: 0 });

    // Check OPPONENT king position
    const opponentKing = pieces.find(p => p.type === PieceType.KING && p.team === TeamType.OPPONENT);
    expect(opponentKing?.position).toEqual({ x: 4, y: 7 });

    // Check OUR pawns are on y=1
    const ourPawns = pieces.filter(p => p.type === PieceType.PAWN && p.team === TeamType.OUR);
    expect(ourPawns.every(p => p.position.y === 1)).toBe(true);

    // Check OPPONENT pawns are on y=6
    const opponentPawns = pieces.filter(p => p.type === PieceType.PAWN && p.team === TeamType.OPPONENT);
    expect(opponentPawns.every(p => p.position.y === 6)).toBe(true);
  });

  it("should have all pieces with hasMoved false initially", () => {
    const pieces = initialChessState.pieces;
    expect(pieces.every(p => p.hasMoved === false)).toBe(true);
  });

  it("should have all pieces with empty possibleMoves initially", () => {
    const pieces = initialChessState.pieces;
    expect(pieces.every(p => p.possibleMoves.length === 0)).toBe(true);
  });

  it("should have unique piece IDs", () => {
    const pieces = initialChessState.pieces;
    const ids = pieces.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(pieces.length);
  });
});
