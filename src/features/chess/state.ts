import { ChessState } from "@/features/chess/types";
import { createBoard } from "@/domain/chess/board/createBoard";

export const initialChessState: ChessState = {
  pieces: createBoard(),
  totalTurns: 0,
};