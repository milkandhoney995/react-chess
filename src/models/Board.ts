import { PieceType, TeamType } from "@/Types";
import { Pawn } from "./Pawn";
import { Piece } from "./Piece";
import { Position } from "./Position";
import { getPossibleBishopMoves, getPossibleKingMoves, getPossibleKnightMoves, getPossiblePawnMoves, getPossibleQueenMoves, getPossibleRookMoves } from "@/referee/rules";


export class Board {
  pieces: Piece[];
  constructor(
    pieces: Piece[]
  ) {
    this.pieces = pieces;
  }

  calculateAllMoves() {
    for (const piece of this.pieces) {
      piece.possibleMoves = this.getValidMoves(piece, this.pieces);
    }
  }

  getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
    switch(piece.type)
    {
      case PieceType.PAWN:
        return getPossiblePawnMoves(piece, boardState);
      case PieceType.KNIGHT:
        return getPossibleKnightMoves(piece, boardState);
      case PieceType.BISHOP:
        return getPossibleBishopMoves(piece, boardState);
      case PieceType.ROOK:
        return getPossibleRookMoves(piece, boardState);
      case PieceType.QUEEN:
        return getPossibleQueenMoves(piece, boardState);
      case PieceType.KING:
        return getPossibleKingMoves(piece, boardState);
      default:
        return [];
    }
  }

  playMove(
    enPassantMove: boolean,
    validMove: boolean,
    playedPiece: Piece,
    destination: Position
  ): boolean {
    const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;

    if (enPassantMove) {
      this.pieces = this.pieces.reduce((results, piece) => {
        if (piece.samePiecePosition(playedPiece)) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }
          piece.position.x = destination.x;
          piece.position.y = destination.y;
          results.push(piece);
        } else if (!piece.samePosition(new Position(destination.x, destination.y - pawnDirection) )) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }
          results.push(piece);
        }
        return results;
      }, [] as Piece[])

      this.calculateAllMoves();
    } else if (validMove) {
    // reduce()
    // results: array of results
    // piece: a single object from the initial array(= value), the current piece we're handling
    this.pieces = this.pieces.reduce((results, piece) => {
      // Piece that we're currently moving
      if (piece.samePiecePosition(playedPiece)) {
        // Special move
        if (piece.isPawn) {
          (piece as Pawn).enPassant = Math.abs(playedPiece.position.y - destination.y) === 2
        }

        // x, y: 動かした後のコマの位置
        piece.position.x = destination.x;
        piece.position.y = destination.y;

        results.push(piece);
      } else if (!piece.samePosition(destination)) {
        if (piece.isPawn) {
          (piece as Pawn).enPassant = false;
        }
        results.push(piece);
      }

      // The piece at the destination location
      // won't be pushed in the results
      return results;
    }, [] as Piece[])

    // コマの位置を更新する. And if a piece is attacked, remove it
    this.calculateAllMoves();
    } else {
      return false;
    }

    return true;
  }

  clone(): Board {
    return new Board(this.pieces.map(p => p.clone()))
    // NG: return Board we're currently in.
    // return this;
  }
 }