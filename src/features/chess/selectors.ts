import { ChessState } from "@/features/chess/types";
import { Piece, TeamType } from "@/domain/chess/types";

export const selectCurrentTeam = (state: ChessState): TeamType =>
  state.totalTurns % 2 === 0 ? TeamType.OPPONENT : TeamType.OUR;

export const selectPiecesByTeam =
  (team: TeamType) =>
  (state: ChessState): Piece[] =>
    state.pieces.filter(p => p.team === team);