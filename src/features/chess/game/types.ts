import { Piece, Position, TeamType } from "@/domain/chess/types";


export interface PromotionState {
  position: Position;
  team: TeamType;
}

export interface ChessState {
  pieces: Piece[];
  totalTurns: number;
  winningTeam?: TeamType;
  promotion?: PromotionState;
};