import { Piece, TeamType } from "@/domain/chess/types";

export interface ChessState {
  pieces: Piece[];
  totalTurns: number;
  winningTeam?: TeamType;
};