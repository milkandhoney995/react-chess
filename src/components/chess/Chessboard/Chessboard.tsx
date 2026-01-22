'use client';

import React from "react";
import classes from "./Chessboard.module.scss";
import Square from "@/components/chess/Square/Square";
import PromotionModal from "@/components/chess/PromotionModal/PromotionModal";
import { PieceSvgMap } from "@/components/chess/PiecesSvg";
import { SquareView, PromotionView } from "@/features/chess/viewModels/types";
import { Position, Piece, PieceType } from "@/domain/chess/types";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import { getDraggingStyle, getPieceStyle } from "@/utils/ui";

interface Props {
  squares: SquareView[];
  draggingPiece?: { piece: Piece; x: number; y: number };
  draggingPieceId: string | null;
  promotion?: PromotionView;
  onMovePiece: (pieceId: string, position: Position) => void;
  onPromote: (position: Position, type: PieceType) => void;
  onDragStart: (piece: Piece) => void;
  onDragEnd: () => void;
}

const Chessboard: React.FC<Props> = ({
  squares,
  draggingPiece,
  draggingPieceId,
  promotion,
  onMovePiece,
  onPromote,
  onDragStart,
  onDragEnd,
}) => {
  const { chessboardRef, dragState, onPointerDown, onPointerMove, onPointerUp } =
    useDragAndDrop({
      onDrop: (pieceId, position) => {
        if (!promotion) {
          onMovePiece(pieceId, position);
        }
      },
      onDragEnd,
    });

  return (
    <div className={classes.chessboard__wrapper}>
      {/* チェス盤 */}
      <div
        ref={chessboardRef}
        className={classes.chessboard}
        onPointerMove={promotion ? undefined : onPointerMove}
        onPointerUp={promotion ? undefined : onPointerUp}
      >
        {squares.map((square) => (
          <Square
            key={square.id}
            id={square.id}
            piece={square.piece}
            highlight={square.highlight}
            isChecked={square.isChecked}
            pieceStyle={getPieceStyle(square.piece, draggingPieceId)}
            number={square.position.x + square.position.y + 2}
            onPointerDown={(e, piece) => {
              if (!promotion) {
                onPointerDown(e, piece);
                onDragStart(piece);
              }
            }}
          />
        ))}

        {/* ドラッグ中の駒描画 */}
        {dragState?.piece && PieceSvgMap[dragState.piece.type] && (
          <div
            className={classes.chessboard__draggingPiece}
            style={getDraggingStyle(dragState)}
          >
            {React.createElement(PieceSvgMap[dragState.piece.type], { team: dragState.piece.team })}
          </div>
        )}
      </div>

      {/* プロモーションモーダル */}
      {promotion && (
        <PromotionModal
          position={promotion.position}
          team={promotion.team}
          onPromote={onPromote}
        />
      )}
    </div>
  );
};

export default Chessboard;