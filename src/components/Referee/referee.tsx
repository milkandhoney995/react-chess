'use client';
import { useEffect, useRef, useState } from "react";
import { initialBoardState, PieceType, TeamType, samePosition } from "@/Constants";
import Chessboard from "../Chessboard/Chessboard"
import { bishopMove, getPossibleBishopMoves, getPossibleKingMoves, getPossibleKnightMoves, getPossiblePawnMoves, getPossibleQueenMoves, getPossibleRookMoves, kingMove, knightMove, pawnMove, queenMove, rookMove } from "@/referee/rules";
import boardClasses from "../Chessboard/Chessboard.module.scss"
import Image from "next/image";
import { Piece, Position } from "@/models";



export default function Referee() {
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updatePossibleMoves();
  }, []);

  function updatePossibleMoves() {
    setPieces((currentPieces) => { // update currentPieces
      return currentPieces.map(p => { // create a reference to the previous value
        p.possibleMoves = getValidMoves(p, currentPieces);
        return p;
      });
    });
  }

  function playMove(playedPiece: Piece, destination: Position): boolean {
    const validMove = isValidMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    )

    const enPassantMove = isEnPassantMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team,
    );

    const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;

    if (enPassantMove) {
      const updatedPieces = pieces.reduce((results, piece) => {
        if (samePosition(piece.position, playedPiece.position)) {
          piece.enPassant = false;
          piece.position.x = destination.x;
          piece.position.y = destination.y;
          results.push(piece);
        } else if (!samePosition(piece.position, new Position(destination.x, destination.y - pawnDirection) )) {
          if (piece.type === PieceType.PAWN) {
            piece.enPassant = false;
          }
          results.push(piece);
        }
        return results;
      }, [] as Piece[])

      updatePossibleMoves();
      setPieces(updatedPieces);
    } else if (validMove) {
    // reduce()
    // results: array of results
    // piece: a single object from the initial array(= value), the current piece we're handling
    const updatedPieces = pieces.reduce((results, piece) => {
      if (samePosition(piece.position, playedPiece.position)) {
        // Special move
        piece.enPassant =
          Math.abs(playedPiece.position.y - destination.y) === 2 &&
          piece.type === PieceType.PAWN;

        // x, y: 動かした後のコマの位置
        piece.position.x = destination.x;
        piece.position.y = destination.y;

        let promotionRow = (piece.team === TeamType.OUR) ? 7 : 0;

        if (destination.y === promotionRow && piece.type === PieceType.PAWN) {
          modalRef.current?.classList.remove(`${boardClasses.hidden}`);
          setPromotionPawn(piece);
        }
        results.push(piece);
      } else if (!samePosition(piece.position, new Position(destination.x, destination.y))) {
        if (piece.type === PieceType.PAWN) {
          piece.enPassant = false;
        }
        results.push(piece);
      }

      return results;
    }, [] as Piece[])

    // コマの位置を更新する. And if a piece is attacked, remove it
    updatePossibleMoves();
    setPieces(updatedPieces);
    } else {
      return false;
    }
    return true;
  }

  function isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      // Attack logic
      // Attack in upper left / upper right / || bottom left / bottom right corner
      if ((desiredPosition.x - initialPosition.x === -1 && desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === pawnDirection) {
        const piece = pieces.find(
          p =>
          p.position.x === desiredPosition.x &&
          p.position.y === desiredPosition.y - pawnDirection &&
          p.enPassant// If a piece is under / above the attacked tile
        );
        if (piece) {
          return true;
        }
      }
    }

    return false;
  }

  function isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
  ) {
    let validMode = false;
    switch (type) {
      case PieceType.PAWN:
        validMode = pawnMove(initialPosition, desiredPosition, team, pieces)
        break;
      case PieceType.KNIGHT:
        validMode = knightMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.BISHOP:
        validMode = bishopMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.ROOK:
        validMode = rookMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.QUEEN:
        validMode = queenMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.KING:
        validMode = kingMove(initialPosition, desiredPosition, team, pieces);
        break;
    }

    return validMode;
  }

  function getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
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

  function promotePawn(pieceType: PieceType) {
    if (promotionPawn === undefined) { return; }
    const updatedPieces = pieces.reduce((results, piece) => {
      if (samePosition(piece.position, promotionPawn?.position)) {
        piece.type = pieceType;
        const teamType = piece.team === TeamType.OUR ? "w" : "b";
        let image = "";
        switch(pieceType) {
          case PieceType.ROOK: {
            image = "rook";
            break;
          }
          case PieceType.BISHOP: {
            image = "bishop";
            break;
          }
          case PieceType.KNIGHT: {
            image = "knight";
            break;
          }
          case PieceType.QUEEN: {
            image = "queen";
            break;
          }
        }
        piece.image = `/assets/images/${image}_${teamType}.png`
      }
      results.push(piece)
      return results
    }, [] as Piece[])

    updatePossibleMoves();
    setPieces(updatedPieces);
    modalRef.current?.classList.add(`${boardClasses.hidden}`)
  }

  function promotionTeamType() {
    return (promotionPawn?.team === TeamType.OUR) ? "w" : "b";
  }

  return (
    <>
      <div className={`${boardClasses.pawnPromotionModal} ${boardClasses.hidden}`} ref={modalRef}>
        <div className={boardClasses.pawnPromotionModal__body}>
          <Image onClick={() => promotePawn(PieceType.ROOK)} src={`/assets/images/rook_${promotionTeamType()}.png`} width={100} height={100} alt="debug" />
          <Image onClick={() => promotePawn(PieceType.BISHOP)} src={`/assets/images/bishop_${promotionTeamType()}.png`}  width={100} height={100} alt="debug" />
          <Image onClick={() => promotePawn(PieceType.KNIGHT)} src={`/assets/images/knight_${promotionTeamType()}.png`}  width={100} height={100} alt="debug" />
          <Image onClick={() => promotePawn(PieceType.QUEEN)} src={`/assets/images/queen_${promotionTeamType()}.png`}  width={100} height={100} alt="debug" />
        </div>
      </div>
      <Chessboard
       playMove={playMove}
       pieces={pieces}
      />
    </>
  )
}