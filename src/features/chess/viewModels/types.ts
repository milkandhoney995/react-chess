import { Piece, Position, TeamType } from "@/domain/chess/types";

/**
 * チェスゲームの表示用ViewModelの型
 * @interface GameStatusView
 * @property {string} [message] - ゲームステータスメッセージ
 * @property {boolean} isCheck - チェック状態か
*/
export interface GameStatusView {
  message?: string;
  isCheck: boolean;
}

/**
 * チェス盤のマスの表示用ViewModelの型
 * @interface SquareView
 * @property {string} id - マスのID
 * @property {Position} position - マスの位置
 * @property {Piece | null} piece - マスにある駒、または null
 * @property {boolean} highlight - マスがハイライトされているか
 * @property {boolean} isChecked - マスがチェックされているか
*/
export interface SquareView {
  id: string;
  position: Position;
  piece: Piece | undefined;
  highlight: boolean;
  isChecked: boolean;
}

/**
 * ドラッグ中の駒の表示用ViewModelの型
 * @interface DraggingPieceView
 * @property {Piece} piece - ドラッグ中の駒
 * @property {number} x - ドラッグ中の駒のX座標
 * @property {number} y - ドラッグ中の駒のY座標
*/
export interface DraggingPieceView {
  piece: Piece;
  x: number;
  y: number;
}

/**
 * プロモーション時の表示用ViewModelの型
 * @interface PromotionView
 * @property {Position} position - プロモーションする位置
 * @property {TeamType} team - プロモーションするチーム
*/
export interface PromotionView {
  position: Position;
  team: TeamType;
}

/**
 * チェス盤の表示用ViewModelの型
 * @interface ChessboardView
 * @property {SquareView[]} squares - チェス盤のマスの配列
 * @property {DraggingPieceView} [draggingPiece] - ドラッグ中の駒、または undefined
 * @property {PromotionView} [promotion] - プロモーション状態、または undefined
*/
export interface ChessboardView {
  squares: SquareView[];
  draggingPiece?: DraggingPieceView;
  promotion?: PromotionView;
}

/**
 * チェスゲーム全体の表示用ViewModelの型
 * @interface ChessGameViewModel
 * @property {GameStatusView} gameStatus - ゲームステータスのViewModel
 * @property {ChessboardView} chessboard - チェス盤のViewModel
*/
export interface ChessGameViewModel {
  gameStatus: GameStatusView;
  chessboard: ChessboardView;
}