import { Piece, Position } from "@/domain/chess/types";
import { PieceType, TeamType } from "@/domain/chess/types";
import { cloneBoard } from "@/domain/chess/board/cloneBoard";
import { getPossibleMoves } from "@/domain/chess/utils";

function calculateAllMoves(pieces: Piece[], totalTurns: number): Piece[] {
  const currentTeam =
    totalTurns % 2 === 0 ? TeamType.OPPONENT : TeamType.OUR;

  let next = cloneBoard(pieces);
  next = next.map(piece => ({
    ...piece,
    possibleMoves:
      piece.team === currentTeam
        ? getPossibleMoves(piece, next)
        : [],
  }));

  return next;
}

export function movePiece(
  pieces: Piece[],
  from: Position,
  to: Position,
  totalTurns: number
): Piece[] {
  const board = cloneBoard(pieces);

  const movingPiece = board.find(
    p => p.position.x === from.x && p.position.y === from.y
  );
  if (!movingPiece) return pieces;

  const pawnDir = movingPiece.team === TeamType.OUR ? 1 : -1;

  // en passant
  const enPassantTarget =
    movingPiece.type === PieceType.PAWN &&
    Math.abs(from.y - to.y) === 1 &&
    from.x !== to.x &&
    !board.some(p => p.position.x === to.x && p.position.y === to.y);

  let next = board.filter(p => {
    if (p.id === movingPiece.id) return true;
    if (p.position.x === to.x && p.position.y === to.y) return false;

    if (
      enPassantTarget &&
      p.position.x === to.x &&
      p.position.y === to.y - pawnDir
    ) {
      return false;
    }

    return true;
  });

  next = next.map(p =>
    p.id === movingPiece.id
      ? {
          ...p,
          position: { ...to },
          hasMoved: true,
          enPassant:
            p.type === PieceType.PAWN &&
            Math.abs(from.y - to.y) === 2,
        }
      : p.type === PieceType.PAWN
      ? { ...p, enPassant: false }
      : p
  );

  return calculateAllMoves(next, totalTurns + 1);
}