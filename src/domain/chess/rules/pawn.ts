import { Piece, Position, PieceType, TeamType } from "@/domain/chess/types";
import {
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "@/domain/chess/rules/general";
import { samePosition } from "@/domain/chess/utils";

/* =====================
   Public API
===================== */
export const getPossiblePawnMoves = (
  pawn: Piece,
  board: Piece[]
): Position[] => {
  return [
    ...getForwardMoves(pawn, board),
    ...getCaptureMoves(pawn, board),
    ...getEnPassantMoves(pawn, board),
  ];
};

/* =====================
   Helpers
===================== */

const getForwardMoves = (pawn: Piece, board: Piece[]): Position[] => {
  const moves: Position[] = [];
  const dir = getPawnDirection(pawn.team);

  const oneStep = move(pawn.position, 0, dir);
  if (tileIsOccupied(oneStep, board)) return moves;

  moves.push(oneStep);

  if (isPawnStartRow(pawn)) {
    const twoStep = move(pawn.position, 0, dir * 2);
    if (!tileIsOccupied(twoStep, board)) {
      moves.push(twoStep);
    }
  }

  return moves;
};

/* =====================
   Capture
===================== */
const getCaptureMoves = (pawn: Piece, board: Piece[]): Position[] => {
  const dir = getPawnDirection(pawn.team);

  return [-1, 1]
    .map(dx => move(pawn.position, dx, dir))
    .filter(pos =>
      tileIsOccupiedByOpponent(pos, board, pawn.team)
    );
};

/* =====================
   En Passant
===================== */
/**
 * ポーンのエンパッサン移動を取得
 * @param pawn 移動元のポーン駒
 * @param board 盤上の全ての駒
 * @return エンパッサン移動可能な位置の配列
*/
const getEnPassantMoves = (pawn: Piece, board: Piece[]): Position[] => {
  const dir = getPawnDirection(pawn.team);
  const moves: Position[] = [];

  for (const dx of [-1, 1]) {
    const sidePos = move(pawn.position, dx, 0);
    const sidePawn = board.find(
      p =>
        p.type === PieceType.PAWN &&
        p.team !== pawn.team &&
        p.enPassant === true &&
        samePosition(p.position, sidePos)
    );

    if (sidePawn) {
      moves.push(move(pawn.position, dx, dir));
    }
  }

  return moves;
};

/* =====================
   Utilities
===================== */
/**
 * ポーンの進行方向を取得
 * @param team ポーンのチーム
 * @return 進行方向（OUR チームなら +1、OPPONENT チームなら -1）
*/
const getPawnDirection = (team: TeamType): number =>
  team === TeamType.OUR ? 1 : -1;

/**
 * ポーンが初期位置にいるかどうか
 * @param pawn 確認するポーン駒
 * @return 初期位置にいる場合は true、そうでない場合は false
*/
const isPawnStartRow = (pawn: Piece): boolean =>
  pawn.position.y === (pawn.team === TeamType.OUR ? 1 : 6);

/**
 * 指定した移動量だけ移動した、駒の新しい位置を取得
 * @param position 元の位置
 * @param dx x方向の移動量
 * @param dy y方向の移動量
 * @return 移動後の位置
*/
const move = (
  position: Position,
  dx: number,
  dy: number
): Position => ({
  x: position.x + dx,
  y: position.y + dy,
});