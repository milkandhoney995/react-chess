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
    updatePossibleMoves();
  }, []);

  function updatePossibleMoves() {
    board.calculateAllMoves;
  }

  function playMove(
    playedPiece: Piece,
    destination: Position
  ): boolean {
    let playedMoveIsValid = false;

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

    // Playmove modifies the board thus we need to call setBoard
    setBoard((previousBpard) => {
      // Playing the move
      // この書き方をすると、Reactがboardは同じオブジェクトであると認識するのでNG
      // board.playMove(enPassantMove,
      //   validMove, playedPiece, destination);
      // return board;
      playedMoveIsValid = board.playMove(enPassantMove,
        validMove, playedPiece, destination);

      return board.clone();
    })

    // This is for promoting a pawn
    let promotionRow = (playedPiece.team === TeamType.OUR) ? 7 : 0;

    if (destination.y === promotionRow && playedPiece.isPawn) {
      modalRef.current?.classList.remove(`${boardClasses.hidden}`);
      setPromotionPawn(playedPiece);
    }
    return playedMoveIsValid;
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
        const piece = board.pieces.find(
          p =>
          p.position.x === desiredPosition.x &&
          p.position.y === desiredPosition.y - pawnDirection &&
          (p.isPawn && (p as Pawn).enPassant)// If a piece is under / above the attacked tile
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
        validMode = pawnMove(initialPosition, desiredPosition, team, board.pieces)
        break;
      case PieceType.KNIGHT:
        validMode = knightMove(initialPosition, desiredPosition, team, board.pieces);
        break;
      case PieceType.BISHOP:
        validMode = bishopMove(initialPosition, desiredPosition, team, board.pieces);
        break;
      case PieceType.ROOK:
        validMode = rookMove(initialPosition, desiredPosition, team, board.pieces);
        break;
      case PieceType.QUEEN:
        validMode = queenMove(initialPosition, desiredPosition, team, board.pieces);
        break;
      case PieceType.KING:
        validMode = kingMove(initialPosition, desiredPosition, team, board.pieces);
        break;
    }

    return validMode;
  }

  function promotePawn(pieceType: PieceType) {
    if (promotionPawn === undefined) { return; }
    board.pieces = board.pieces.reduce((results, piece) => {
      if (piece.samePiecePosition(promotionPawn)) {
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
       pieces={board.pieces}
      />
    </>
  )
}