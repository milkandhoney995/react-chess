'use client';

import React from "react";
import classes from "./Chessboard.module.scss";
import { VERTICAL_AXIS, HORIZONTAL_AXIS } from "@/domain/chess/constants";
import { Piece, Position, TeamType } from "@/domain/chess/types";
import { getPieceAt, samePosition, getPieceStyle, getDraggingStyle } from "@/domain/chess/utils";
import Square from "@/components/chess/Square/Square";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import { ChessAction } from "@/features/chess/game/actions";
import PromotionModal from "../PromotionModal/PromotionModal";
import { PieceSvgMap } from "../PiecesSvg";

interface PromotionState {
  position: Position;
  team: TeamType;
}

interface Props {
  pieces: Piece[];
  possibleMoves: Position[];
  draggingPieceId: string | null;
  promotion?: PromotionState;
  checkedSquares?: Position[];
  dispatch: React.Dispatch<ChessAction>;
  onDragStart: (piece: Piece) => void;
  onDragEnd: () => void;
}

const Chessboard: React.FC<Props> = ({
  pieces,
  possibleMoves,
  draggingPieceId,
  promotion,
  dispatch,
  onDragStart,
  onDragEnd,
  checkedSquares = [],
}) => {
  const {
    chessboardRef,
    dragState,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } = useDragAndDrop({
    onDrop: (pieceId, position) => {
      if (promotion) return; // プロモーション中は操作不可
      dispatch({
        type: "MOVE_PIECE",
        payload: { pieceId, to: position },
      });
    },
    onDragEnd,
  });

  const isChecked = (position: Position) =>
    checkedSquares?.some(pos => samePosition(pos, position));

  return (
    <div className={classes.chessboard__wrapper}>
      {/* ===== チェス盤 ===== */}
      <div
        ref={chessboardRef}
        className={classes.chessboard}
        onPointerMove={promotion ? undefined : onPointerMove}
        onPointerUp={promotion ? undefined : onPointerUp}
      >
        {VERTICAL_AXIS.map((_, yIndex) =>
          HORIZONTAL_AXIS.map((_, x) => {
            const position: Position = { x, y: 7 - yIndex };
            const piece = getPieceAt(pieces, position);
            const style = getPieceStyle(piece, draggingPieceId);
            const highlight = possibleMoves.some(m => samePosition(m, position));
            const checked = isChecked(position);

            return (
              <Square
                key={`${x}-${yIndex}`}
                id={`${x}-${yIndex}`}
                piece={piece}
                number={x + yIndex + 2}
                highlight={highlight}
                isChecked={checked}
                pieceStyle={style}
                onPointerDown={(e, p) => {
                  if (promotion) return;
                  onPointerDown(e, p);
                  onDragStart(p);
                }}
              />
            );
          })
        )}

        {/* ===== ドラッグ中の駒追従描画 ===== */}
        {dragState?.piece && (() => {
          const DraggingSvg = PieceSvgMap[dragState.piece.type];
          if (!DraggingSvg) return null;

          return (
            <div className={classes.chessboard__draggingPiece} style={getDraggingStyle(dragState)}>
              <DraggingSvg team={dragState.piece.team} />
            </div>
          );
        })()}
      </div>

      {/* ===== プロモーション UI ===== */}
      {promotion && (
        <PromotionModal
          position={promotion.position}
          team={promotion.team}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};

export default Chessboard;