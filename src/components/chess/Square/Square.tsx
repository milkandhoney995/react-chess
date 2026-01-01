import classes from "@/components/chess/Square/Square.module.scss";
import { Piece } from "@/domain/chess/types";
import { getPieceImage } from "@/domain/chess/utils";

interface Props {
  piece?: Piece;
  number: number;
  highlight: boolean;
  pieceStyle?: React.CSSProperties;
  onPointerDown: (e: React.PointerEvent, piece: Piece) => void;
}

const Square = ({ piece, number, highlight, pieceStyle, onPointerDown }: Props) => {
  const className = [
    classes.tile,
    number % 2 === 0 ? classes.tile__blackTile : classes.tile__whiteTile,
    highlight && classes.tile__highlight,
  ].filter(Boolean).join(" ");

  return (
    <div className={className}>
      {piece && (
        <img
          className={classes.tile__image}
          src={getPieceImage(piece)}
          style={pieceStyle}
          onPointerDown={(e) => onPointerDown(e, piece)}
          alt={`${piece.type}_${piece.team}`}
        />
      )}
    </div>
  );
};

export default Square;