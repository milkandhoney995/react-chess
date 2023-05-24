'use client';
import { useEffect, useRef, useState } from "react";
import Chessboard from "../Chessboard/Chessboard"
import { bishopMove,kingMove, knightMove, pawnMove, queenMove, rookMove } from "@/referee/rules";
import boardClasses from "../Chessboard/Chessboard.module.scss"
import Image from "next/image";
import { Piece, Position } from "@/models";
import { PieceType, TeamType } from "@/Types";
import { Pawn } from "@/models/Pawn";
import { initialBoard } from "@/Constants";
import { Board } from "@/models/Board";



export default function Referee() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    board.calculateAllMoves;
  }, []);

  function playMove(playedPiece: Piece, destination: Position): boolean {
    // If the playing piece doesn't have any moves return
    if (playedPiece.possibleMoves === undefined) return false;

    // Prevent the inactive team from playing
    if (playedPiece.team === TeamType.OUR
      && board.totalTurns % 2 !== 1) return false;
  if (playedPiece.team === TeamType.OPPONENT
      && board.totalTurns % 2 !== 0) return false;
    let playedMoveIsValid = false;

    const validMove = isValidMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    )

    if (!validMove) return false;

    const enPassantMove = isEnPassantMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team,
    );

    // Playmove modifies the board thus we need to call setBoard
    setBoard((previousBoard) => {
      const clonedBoard = board.clone();
      clonedBoard.totalTurns += 1;
      // Playing the move
      // この書き方をすると、Reactがboardは同じオブジェクトであると認識するのでNG
      // board.playMove(enPassantMove,
      //   validMove, playedPiece, destination);
      // return board;
      playedMoveIsValid = clonedBoard.playMove(enPassantMove,
        validMove, playedPiece,
        destination);

      return board.clone();
    })

    // This is for promoting a pawn
    let promotionRow = (playedPiece.team === TeamType.OUR) ? 7 : 0;

      if (destination.y === promotionRow && playedPiece.isPawn) {
        modalRef.current?.classList.remove(`${boardClasses.hidden}`);
        setPromotionPawn((previousPromotionPawn) => {
          const clonedPlayedPiece = playedPiece.clone();
          clonedPlayedPiece.position = destination.clone();
          return clonedPlayedPiece;
        });
      }

      return playedMoveIsValid;
  }

  function isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      // Attack logic
      // Attack in upper left / upper right / || bottom left / bottom right corner
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
            desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = board.pieces.find(
            (p) =>
                p.position.x === desiredPosition.x &&
                p.position.y === desiredPosition.y - pawnDirection &&
                p.isPawn &&
                (p as Pawn).enPassant
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
  team: TeamType
) {
  let validMove = false;
  switch (type) {
      case PieceType.PAWN:
          validMove = pawnMove(initialPosition, desiredPosition, team, board.pieces);
          break;
      case PieceType.KNIGHT:
          validMove = knightMove(initialPosition, desiredPosition, team, board.pieces);
          break;
      case PieceType.BISHOP:
          validMove = bishopMove(initialPosition, desiredPosition, team, board.pieces);
          break;
      case PieceType.ROOK:
          validMove = rookMove(initialPosition, desiredPosition, team, board.pieces);
          break;
      case PieceType.QUEEN:
          validMove = queenMove(initialPosition, desiredPosition, team, board.pieces);
          break;
      case PieceType.KING:
          validMove = kingMove(initialPosition, desiredPosition, team, board.pieces);
  }

  return validMove;
}

function promotePawn(pieceType: PieceType) {
  if (promotionPawn === undefined) {
      return;
  }

  setBoard((previousBoard) => {
      const clonedBoard = board.clone();
      clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
          if (piece.samePiecePosition(promotionPawn)) {
              results.push(new Piece(piece.position.clone(), pieceType,
              piece.team));
          } else {
            results.push(piece);
          }
          return results;
      }, [] as Piece[]);

      clonedBoard.calculateAllMoves();
      return clonedBoard;
  })

  modalRef.current?.classList.add(`${boardClasses.hidden}`);
}

function promotionTeamType() {
  return (promotionPawn?.team === TeamType.OUR) ? "w" : "b";
}

  return (
    <>
    <p style={{fontSize: "1.5rem"}}>{board.totalTurns}</p>
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
        pieces={board.pieces}
      />
    </>
  )
}