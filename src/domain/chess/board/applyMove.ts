import { Piece, Position, PieceType, TeamType } from "@/domain/chess/types";
import { cloneBoard } from "@/domain/chess/board/cloneBoard";
import { samePosition } from "@/domain/chess/utils";

export function applyMove(
  pieces: Piece[],
  from: Position,
  to: Position
): Piece[] {
  const board = cloneBoard(pieces);

  const movingPiece = board.find(p => samePosition(p.position, from));
  if (!movingPiece) return pieces;

  const pawnDir = movingPiece.team === TeamType.OUR ? 1 : -1;

  /* =====================
    en passant 捕獲判定
  ===================== */
  let enPassantCapturedPawnId: string | null = null;

  if (
    movingPiece.type === PieceType.PAWN &&
    from.x !== to.x &&
    !board.some(p => samePosition(p.position, to))
  ) {
    const targetPos = { x: to.x, y: to.y - pawnDir };
    const targetPawn = board.find(
      p =>
        p.type === PieceType.PAWN &&
        p.team !== movingPiece.team &&
        p.enPassant === true &&
        samePosition(p.position, targetPos)
    );

    if (targetPawn) {
      enPassantCapturedPawnId = targetPawn.id;
    }
  }

  const isCastling =
    movingPiece.type === PieceType.KING &&
    Math.abs(to.x - from.x) === 2 &&
    from.y === to.y;

  /* =====================
    駒の除去
  ===================== */
  let next = board.filter(p => {
    if (p.id === movingPiece.id) return true;
    if (samePosition(p.position, to)) return false;
    if (p.id === enPassantCapturedPawnId) return false;
    return true;
  });

  /* =====================
    駒の移動
  ===================== */
  next = next.map(p => {
    if (p.id === movingPiece.id) {
      return {
        ...p,
        position: { ...to },
        hasMoved: true,
        enPassant: false,
      };
    }

    // キャスリング時のルーク移動
    if (
      isCastling &&
      p.type === PieceType.ROOK &&
      p.team === movingPiece.team &&
      p.position.y === from.y
    ) {
      const isKingSide = to.x > from.x;

      if (
        (isKingSide && p.position.x === 7) ||
        (!isKingSide && p.position.x === 0)
      ) {
        return {
          ...p,
          position: { x: isKingSide ? 5 : 3, y: from.y },
          hasMoved: true,
        };
      }
    }

    if (p.type === PieceType.PAWN) {
      return { ...p, enPassant: false };
    }

    return p;
  });

  /* =====================
    en passant フラグ更新
  ===================== */
  next = next.map(p =>
    p.id === movingPiece.id &&
    p.type === PieceType.PAWN &&
    Math.abs(from.y - to.y) === 2
      ? { ...p, enPassant: true }
      : { ...p, enPassant: false }
  );

  return next;
}