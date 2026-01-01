import { PieceType, TeamType, BoardData } from "@/domain/chess/types";
import { createId } from "@/domain/chess/board/createBoard";

export const VERTICAL_AXIS = ["1","2","3","4","5","6","7","8"];
export const HORIZONTAL_AXIS = ["a","b","c","d","e","f","g","h"];
export const GRID_SIZE = 100;

// 初期盤面データ
export const initialBoard: BoardData = {
  totalTurns: 1,
  pieces: [
    // 相手側
    { id: createId(), position: { x: 0, y: 7 }, type: PieceType.ROOK, team: TeamType.OPPONENT, hasMoved: false, possibleMoves: [] },
    { id: createId(), position: { x: 1, y: 7 }, type: PieceType.KNIGHT, team: TeamType.OPPONENT, hasMoved: false, possibleMoves: [] },
    { id: createId(), position: { x: 2, y: 7 }, type: PieceType.BISHOP, team: TeamType.OPPONENT, hasMoved: false, possibleMoves: [] },
    { id: createId(), position: { x: 3, y: 7 }, type: PieceType.QUEEN, team: TeamType.OPPONENT, hasMoved: false, possibleMoves: [] },
    { id: createId(), position: { x: 4, y: 7 }, type: PieceType.KING, team: TeamType.OPPONENT, hasMoved: false, possibleMoves: [] },
    { id: createId(), position: { x: 5, y: 7 }, type: PieceType.BISHOP, team: TeamType.OPPONENT, hasMoved: false, possibleMoves: [] },
    { id: createId(), position: { x: 6, y: 7 }, type: PieceType.KNIGHT, team: TeamType.OPPONENT, hasMoved: false, possibleMoves: [] },
    { id: createId(), position: { x: 7, y: 7 }, type: PieceType.ROOK, team: TeamType.OPPONENT, hasMoved: false, possibleMoves: [] },
    // 相手のポーン
    ...Array(8).fill(0).map((_, i) => ({
      id: createId(),
      position: { x: i, y: 6 },
      type: PieceType.PAWN,
      team: TeamType.OPPONENT,
      hasMoved: false,
      possibleMoves: [],
      isPawn: true,
      enPassant: false
    })),

    // 自分のポーン
    ...Array(8).fill(0).map((_, i) => ({
      id: createId(),
      position: { x: i, y: 1 },
      type: PieceType.PAWN,
      team: TeamType.OUR,
      hasMoved: false,
      possibleMoves: [],
      isPawn: true,
      enPassant: false
    })),

    // 自分側
    { id: createId(), position: { x: 0, y: 0 }, type: PieceType.ROOK, team: TeamType.OUR, hasMoved: false, possibleMoves: [] },
    { id: createId(), position: { x: 1, y: 0 }, type: PieceType.KNIGHT, team: TeamType.OUR, hasMoved: false, possibleMoves: [] },
    { id: createId(), position: { x: 2, y: 0 }, type: PieceType.BISHOP, team: TeamType.OUR, hasMoved: false, possibleMoves: [] },
    { id: createId(), position: { x: 3, y: 0 }, type: PieceType.QUEEN, team: TeamType.OUR, hasMoved: false, possibleMoves: [] },
    { id: createId(), position: { x: 4, y: 0 }, type: PieceType.KING, team: TeamType.OUR, hasMoved: false, possibleMoves: [] },
    { id: createId(), position: { x: 5, y: 0 }, type: PieceType.BISHOP, team: TeamType.OUR, hasMoved: false, possibleMoves: [] },
    { id: createId(), position: { x: 6, y: 0 }, type: PieceType.KNIGHT, team: TeamType.OUR, hasMoved: false, possibleMoves: [] },
    { id: createId(), position: { x: 7, y: 0 }, type: PieceType.ROOK, team: TeamType.OUR, hasMoved: false, possibleMoves: [] },
  ]
};