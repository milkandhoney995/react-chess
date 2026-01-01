'use client';
import { useRef, useState } from "react";
import Chessboard from "@/components/chess/Chessboard/Chessboard";
import boardClasses from "@/components/chess/Chessboard/Chessboard.module.scss";
import Image from "next/image";
import { initialBoard } from "@/domain/chess/constants";
import { samePosition, samePiecePosition, checkWinningTeam } from "@/domain/chess/utils";
import { BoardData, Piece, PieceType, Position, TeamType } from "@/domain/chess/types";

const Referee = () => {
  const [board, setBoard] = useState<BoardData>({ ...initialBoard });
  const [promotionPawn, setPromotionPawn] = useState<Piece | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const checkmateModalRef = useRef<HTMLDivElement>(null);

  function playMove(playedPiece: Piece, destination: Position): boolean {
    if (!playedPiece.possibleMoves) return false;

    // チームの順番チェック
    if ((playedPiece.team === TeamType.OUR && board.totalTurns % 2 !== 1) ||
        (playedPiece.team === TeamType.OPPONENT && board.totalTurns % 2 !== 0)) {
      return false;
    }

    // 合法手か確認
    const isValidDestination = playedPiece.possibleMoves.some(move =>
      samePosition(move, destination)
    );
    if (!isValidDestination) return false;

    const enPassant = isEnPassantMove(playedPiece, destination);

    // ボード更新
    setBoard(prev => {
      const newBoard = { ...prev, totalTurns: prev.totalTurns + 1 };

      // 駒移動処理
      const movingPieceIndex = newBoard.pieces.findIndex(p =>
        samePiecePosition(p, playedPiece)
      );

      if (movingPieceIndex === -1) return prev;

      newBoard.pieces[movingPieceIndex] = {
        ...playedPiece,
        position: { ...destination },
        hasMoved: true,
      };

      // エンパッサン処理
      if (enPassant) {
        newBoard.pieces = newBoard.pieces.filter(p =>
          !(p.isPawn &&
            p.team !== playedPiece.team &&
            p.position.x === destination.x &&
            p.position.y === playedPiece.position.y)
        );
      }

      // 勝利判定（簡略化）
      newBoard.winningTeam = checkWinningTeam(newBoard.pieces);

      if (newBoard.winningTeam !== undefined) {
        checkmateModalRef.current?.classList.remove(boardClasses.hidden);
      }

      return newBoard;
    });

    // 昇格処理
    const promotionRow = playedPiece.team === TeamType.OUR ? 7 : 0;
    if (playedPiece.isPawn && destination.y === promotionRow) {
      modalRef.current?.classList.remove(boardClasses.hidden);
      setPromotionPawn({ ...playedPiece, position: { ...destination } });
    }

    return true;
  }

  function isEnPassantMove(piece: Piece, destination: Position) {
    if (!piece.isPawn) return false;
    const dir = piece.team === TeamType.OUR ? 1 : -1;

    return board.pieces.some(p =>
      p.isPawn &&
      p.team !== piece.team &&
      p.position.x === destination.x &&
      p.position.y === destination.y - dir &&
      (p as Piece).enPassant
    );
  }

  function promotePawn(pieceType: PieceType) {
    if (!promotionPawn) return;

    setBoard(prev => {
      const newPieces = prev.pieces.map(p =>
        samePiecePosition(p, promotionPawn)
          ? { ...p, type: pieceType }
          : p
      );

      return {
        ...prev,
        pieces: newPieces,
      };
    });

    modalRef.current?.classList.add(boardClasses.hidden);
    setPromotionPawn(null);
  }

  function promotionTeamType() {
    return promotionPawn?.team === TeamType.OUR ? "w" : "b";
  }

  function restartGame() {
    checkmateModalRef.current?.classList.add(boardClasses.hidden);
    setBoard({ ...initialBoard });
  }

  return (
    <>
      <p style={{ fontSize: "1.5rem", textAlign: "center" }}>Total turns: {board.totalTurns}</p>

      <div className={`${boardClasses.modal} ${boardClasses.hidden}`} ref={modalRef}>
        <div className={boardClasses.modal__body}>
          <Image onClick={() => promotePawn(PieceType.ROOK)} src={`/assets/images/rook_${promotionTeamType()}.png`} width={100} height={100} alt="Promote pawn to rook" />
          <Image onClick={() => promotePawn(PieceType.BISHOP)} src={`/assets/images/bishop_${promotionTeamType()}.png`} width={100} height={100} alt="Promote pawn to bishop" />
          <Image onClick={() => promotePawn(PieceType.KNIGHT)} src={`/assets/images/knight_${promotionTeamType()}.png`} width={100} height={100} alt="Promote pawn to knight" />
          <Image onClick={() => promotePawn(PieceType.QUEEN)} src={`/assets/images/queen_${promotionTeamType()}.png`} width={100} height={100} alt="Promote pawn to queen" />
        </div>
      </div>

      <div className={`${boardClasses.modal} ${boardClasses.hidden}`} ref={checkmateModalRef}>
        <div className={boardClasses.modal__body}>
          <div className={boardClasses.checkmate__body}>
            <span>This winning team is {board.winningTeam === TeamType.OUR ? "white" : "black"}!</span>
            <button onClick={restartGame}>Play again</button>
          </div>
        </div>
      </div>

      <Chessboard playMove={playMove} pieces={board.pieces} />
    </>
  );
};

export default Referee;