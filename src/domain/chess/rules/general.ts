import { Piece, Position } from "@/domain/chess/types";
import { TeamType } from "@/domain/chess/types";
import { samePosition } from "@/domain/chess/utils";

/**
  * 指定した位置に駒が存在するか
  * @param position 確認する位置
  * @param board 盤上の全ての駒
  * @return 駒が存在する場合は true、存在しない場合は false
*/
export const tileIsOccupied = (
  position: Position,
  board: Piece[]
): boolean =>
  board.some(p => samePosition(p.position, position));

/**
  * 指定した位置に相手の駒が存在するか
  * @param position 確認する位置
  * @param board 盤上の全ての駒
  * @param team 自分のチーム
  * @return 相手の駒が存在する場合は true、存在しない場合は false
*/
export const tileIsOccupiedByOpponent = (
  position: Position,
  board: Piece[],
  team: TeamType
): boolean =>
  board.some(
    p => samePosition(p.position, position) && p.team !== team
  );

  /**
  * 指定した位置が空白、または相手の駒であるか
  * @param position 確認する位置
  * @param board 盤上の全ての駒
  * @param team 自分のチーム
  * @return 空白、または相手の駒である場合は true、それ以外は false
*/
export const tileIsEmptyOrOccupiedByOpponent = (
  position: Position,
  board: Piece[],
  team: TeamType
): boolean =>
  !tileIsOccupied(position, board) ||
  tileIsOccupiedByOpponent(position, board, team);