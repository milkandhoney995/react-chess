import { Piece, PieceType, Position, TeamType } from "@/domain/chess/types";
import { samePosition } from "@/domain/chess/utils";

/**
 * チェックされている王を返す
 * チェックされていなければ null
 * @param pieces 盤上の全ての駒
 * @return チェックされている王のチームと位置、または null
 */
export function getCheckedKing(
  pieces: Piece[]
): {
  team: TeamType;
  position: Position;
} | null {
  const kings = pieces.filter(p => p.type === PieceType.KING);

  for (const king of kings) {
    const enemies = pieces.filter(p => p.team !== king.team);

    const isChecked = enemies.some(enemy =>
      enemy.possibleMoves.some(m =>
        samePosition(m, king.position)
      )
    );

    if (isChecked) {
      return {
        team: king.team,
        position: king.position,
      };
    }
  }

  return null;
}