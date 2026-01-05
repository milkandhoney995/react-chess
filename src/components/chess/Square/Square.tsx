'use client';

import classes from "@/components/chess/Square/Square.module.scss";
import { Piece } from "@/domain/chess/types";
import { PieceSvgMap } from "../PiecesSvg";

interface Props {
  piece?: Piece;
  number: number;
  id: string;
  highlight: boolean;
  pieceStyle?: React.CSSProperties;
  onPointerDown: (e: React.PointerEvent, piece: Piece) => void;
}

const Square = ({ piece, number, id, highlight, pieceStyle, onPointerDown }: Props) => {
  const className = [
    classes.tile,
    number % 2 === 0 ? classes.tile__blackTile : classes.tile__whiteTile,
    highlight && classes.tile__highlight,
  ].filter(Boolean).join(" ");

  // SVG を取得
  const SvgPiece = piece ? PieceSvgMap[piece.type] : null;

  return (
    <div className={className}>
      {piece && SvgPiece && (
        <div
          id={id}
          className={classes.tile__image}
          style={pieceStyle}
          onPointerDown={(e) => onPointerDown(e, piece)}
        >
          <SvgPiece team={piece.team} />
        </div>
      )}
    </div>
  );
};

export default Square;