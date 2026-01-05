'use client';

import classes from "./Chessboard.module.scss";
import { VERTICAL_AXIS, HORIZONTAL_AXIS } from "@/domain/chess/constants";
import { Piece, Position, TeamType } from "@/domain/chess/types";
import { getPieceAt, samePosition, getPieceStyle } from "@/domain/chess/utils";
import Square from "@/components/chess/Square/Square";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import { ChessAction } from "@/features/chess/actions";
import PromotionModal from "../PromotionModal/PromotionModal";

interface PromotionState {
  position: Position;
  team: TeamType;
}

interface Props {
  pieces: Piece[];
  possibleMoves: Position[];
  draggingPieceId: string | null;
  promotion?: PromotionState;
  dispatch: React.Dispatch<ChessAction>;
  onDragStart: (piece: Piece) => void;
  onDragEnd: () => void;
}

const Chessboard = ({
  pieces,
  possibleMoves,
  draggingPieceId,
  promotion,
  dispatch,
  onDragStart,
  onDragEnd,
}: Props) => {
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

  return (
    <div className={classes.wrapper}>
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
            const style = getPieceStyle(piece, dragState, draggingPieceId);
            const highlight = possibleMoves.some(m => samePosition(m, position));

            return (
              <Square
                key={`${x}-${yIndex}`}
                id={`${x}-${yIndex}`}
                piece={piece}
                number={x + yIndex + 2}
                highlight={highlight}
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