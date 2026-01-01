import { ChessState } from "./types";
import { Piece, Position, TeamType } from "@/domain/chess/types";
import { getPossibleMoves } from "@/domain/chess/utils";

export const selectPossibleMovesByPieceId =
  (pieceId: string | null) =>
  (state: ChessState): Position[] => {
    if (!pieceId) return [];

    const piece = state.pieces.find(p => p.id === pieceId);
    if (!piece) return [];

    return getPossibleMoves(piece, state.pieces);
  };

export const selectCurrentTeam = (state: ChessState): TeamType =>
  state.totalTurns % 2 === 0 ? TeamType.OUR : TeamType.OPPONENT;

export const selectPiecesByTeam =
  (team: TeamType) =>
  (state: ChessState): Piece[] =>
    state.pieces.filter(p => p.team === team);