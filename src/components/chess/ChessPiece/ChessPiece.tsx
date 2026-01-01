'use client';

import { useRef, useState } from "react";
import Chessboard from "@/components/chess/Chessboard/Chessboard";
import boardClasses from "@/components/chess/Chessboard/Chessboard.module.scss";
import Image from "next/image";
import { initialBoard, GRID_SIZE } from "@/domain/chess/constants";
import { samePosition, samePiecePosition, checkWinningTeam, getPossibleMoves } from "@/domain/chess/utils";
import { BoardData, Piece, PieceType, Position, TeamType } from "@/domain/chess/types";

const ChessPiece = () => {
  const [board, setBoard] = useState<BoardData>({ ...initialBoard });
  const [promotionPawn, setPromotionPawn] = useState<Piece | null>(null);
  const [draggingPiece, setDraggingPiece] = useState<Piece | null>(null); // ハイライト用
  const modalRef = useRef<HTMLDivElement>(null);
  const checkmateModalRef = useRef<HTMLDivElement>(null);

  // 駒移動
  const playMove = (piece: Piece, destination: Position) => {
    if (!piece.possibleMoves?.some(m => samePosition(m, destination))) return false;

    if ((piece.team === TeamType.OUR && board.totalTurns % 2 !== 1) ||
        (piece.team === TeamType.OPPONENT && board.totalTurns % 2 !== 0)) return false;

    const enPassant = isEnPassantMove(piece, destination);

    setBoard(prev => {
      const newBoard = { ...prev, totalTurns: prev.totalTurns + 1 };

      const idx = newBoard.pieces.findIndex(p => samePiecePosition(p, piece));
      if (idx === -1) return prev;

      newBoard.pieces[idx] = { ...piece, position: { ...destination }, hasMoved: true };

      if (enPassant) {
        newBoard.pieces = newBoard.pieces.filter(p =>
          !(p.isPawn && p.team !== piece.team && p.position.x === destination.x && p.position.y === piece.position.y)
        );
      }

      newBoard.winningTeam = checkWinningTeam(newBoard.pieces);
      if (newBoard.winningTeam) checkmateModalRef.current?.classList.remove(boardClasses.hidden);

      return newBoard;
    });

    const promotionRow = piece.team === TeamType.OUR ? 7 : 0;
    if (piece.isPawn && destination.y === promotionRow) {
      modalRef.current?.classList.remove(boardClasses.hidden);
      setPromotionPawn({ ...piece, position: { ...destination } });
    }

    setDraggingPiece(null); // ドロップ後ハイライト解除
    return true;
  };

  const isEnPassantMove = (piece: Piece, dest: Position) => {
    if (!piece.isPawn) return false;
    const dir = piece.team === TeamType.OUR ? 1 : -1;
    return board.pieces.some(p =>
      p.isPawn && p.team !== piece.team &&
      p.position.x === dest.x &&
      p.position.y === dest.y - dir &&
      p.enPassant
    );
  };

  const promotePawn = (type: PieceType) => {
    if (!promotionPawn) return;
    setBoard(prev => ({
      ...prev,
      pieces: prev.pieces.map(p =>
        samePiecePosition(p, promotionPawn) ? { ...p, type } : p
      ),
    }));
    modalRef.current?.classList.add(boardClasses.hidden);
    setPromotionPawn(null);
  };

  const promotionTeamType = () => promotionPawn?.team === TeamType.OUR ? "w" : "b";
  const restartGame = () => { checkmateModalRef.current?.classList.add(boardClasses.hidden); setBoard({ ...initialBoard }); };

  // 駒をクリックまたはドラッグ開始時
  const onPieceClick = (piece: Piece) => {
    const moves = getPossibleMoves(piece, board.pieces);
    setDraggingPiece({ ...piece, possibleMoves: moves });
  };


  return (
    <>
      <p style={{ fontSize: "1.5rem", textAlign: "center" }}>Total turns: {board.totalTurns}</p>

      {/* 昇格モーダル */}
      <div className={`${boardClasses.modal} ${boardClasses.hidden}`} ref={modalRef}>
        <div className={boardClasses.modal__body}>
          <Image onClick={() => promotePawn(PieceType.ROOK)} src={`/assets/images/rook_${promotionTeamType()}.png`} width={100} height={100} alt="Promote to rook" />
          <Image onClick={() => promotePawn(PieceType.BISHOP)} src={`/assets/images/bishop_${promotionTeamType()}.png`} width={100} height={100} alt="Promote to bishop" />
          <Image onClick={() => promotePawn(PieceType.KNIGHT)} src={`/assets/images/knight_${promotionTeamType()}.png`} width={100} height={100} alt="Promote to knight" />
          <Image onClick={() => promotePawn(PieceType.QUEEN)} src={`/assets/images/queen_${promotionTeamType()}.png`} width={100} height={100} alt="Promote to queen" />
        </div>
      </div>

      {/* チェックメイトモーダル */}
      <div className={`${boardClasses.modal} ${boardClasses.hidden}`} ref={checkmateModalRef}>
        <div className={boardClasses.modal__body}>
          <div className={boardClasses.checkmate__body}>
            <span>This winning team is {board.winningTeam === TeamType.OUR ? "white" : "black"}!</span>
            <button onClick={restartGame}>Play again</button>
          </div>
        </div>
      </div>

      {/* チェス盤 */}
      <Chessboard
        playMove={playMove}
        pieces={board.pieces}
        draggingPiece={draggingPiece}
        onPieceClick={onPieceClick}
      />
    </>
  );
};

export default ChessPiece;