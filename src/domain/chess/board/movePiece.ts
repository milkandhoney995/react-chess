import { Piece, Position, PieceType, TeamType } from "@/domain/chess/types";
import { cloneBoard } from "@/domain/chess/board/cloneBoard";
import { getPossibleMoves, samePosition } from "@/domain/chess/utils";

/* =====================
   次ターン用 possibleMoves 再計算
===================== */

function calculateAllMoves(pieces: Piece[], totalTurns: number): Piece[] {
  const currentTeam =
    totalTurns % 2 === 0 ? TeamType.OPPONENT : TeamType.OUR;

  const next = cloneBoard(pieces);
  return next.map(piece => ({
    ...piece,
    possibleMoves:
      piece.team === currentTeam
        ? getPossibleMoves(piece, next)
        : [],
  }));
}

/* =====================
   駒移動（キャスリング対応）
===================== */

export function movePiece(
  pieces: Piece[],
  from: Position,
  to: Position,
  totalTurns: number
): Piece[] {
  const board = cloneBoard(pieces);

  const movingPiece = board.find(p => samePosition(p.position, from));
  if (!movingPiece) return pieces;

  // 合法手判定
  const possibleMoves = getPossibleMoves(movingPiece, board);
  if (!possibleMoves.some(m => samePosition(m, to))) {
    return pieces;
  }

  const isCastling =
    movingPiece.type === PieceType.KING &&
    Math.abs(to.x - from.x) === 2 &&
    from.y === to.y;

  const pawnDir = movingPiece.team === TeamType.OUR ? 1 : -1;

  // en passant 判定
  const isEnPassant =
    movingPiece.type === PieceType.PAWN &&
    Math.abs(from.y - to.y) === 1 &&
    from.x !== to.x &&
    !board.some(p => samePosition(p.position, to));

  /* =====================
     駒の除去（capture / en passant）
  ===================== */

  let next = board.filter(p => {
    if (p.id === movingPiece.id) return true;

    // 通常キャプチャ
    if (samePosition(p.position, to)) return false;

    // en passant
    if (
      isEnPassant &&
      p.position.x === to.x &&
      p.position.y === to.y - pawnDir
    ) {
      return false;
    }

    return true;
  });

  /* =====================
     駒の移動
  ===================== */

  next = next.map(p => {
    // 移動した駒
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
          position: {
            x: isKingSide ? 5 : 3,
            y: from.y,
          },
          hasMoved: true,
        };
      }
    }

    // 他ポーンの enPassant フラグ解除
    if (p.type === PieceType.PAWN) {
      return { ...p, enPassant: false };
    }

    return p;
  });

  /* =====================
     ポーン2マス前進フラグ
  ===================== */

  next = next.map(p =>
    p.id === movingPiece.id &&
    p.type === PieceType.PAWN &&
    Math.abs(from.y - to.y) === 2
      ? { ...p, enPassant: true }
      : p
  );

  return calculateAllMoves(next, totalTurns + 1);
}