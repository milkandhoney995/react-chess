import classes from "@/components/chess/Square/Square.module.scss"
import { Piece } from "@/models"

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
  ]
    .filter(Boolean)
    .join(" ");

  const imageStyle = piece ? { backgroundImage: `url(${piece.image})` } : undefined;

  return (
    <div className={className}>
      {piece && (
        <div
          className={classes.tile__image}
          style={{ ...imageStyle, ...pieceStyle }}
          onPointerDown={(e) => onPointerDown(e, piece)}
        />
      )}
    </div>
  );
};

export default Square;