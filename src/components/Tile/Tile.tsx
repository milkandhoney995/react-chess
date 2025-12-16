import classes from "./Tile.module.scss"
import { Piece } from "@/models"

interface Props {
  piece?: Piece;
  number: number;
  highlight: boolean;
  pieceStyle?: React.CSSProperties;
  onGrabPiece: (e: React.MouseEvent, piece: Piece) => void;
}

const Tile = ({ number, piece, highlight, pieceStyle, onGrabPiece }: Props) => {
  const className = [
    classes.tile,
    number % 2 === 0 ? classes.tile__blackTile : classes.tile__whiteTile,
    highlight && classes.tile__highlight,
  ]
    .filter(Boolean)
    .join(" ");

  const imageStyle: React.CSSProperties | undefined = piece
    ? { backgroundImage: `url(${piece.image})` }
    : undefined;

  return (
    <div className={className}>
      {piece && (
        <div
          className={classes.tile__image}
          style={{ ...imageStyle, ...pieceStyle }}
          onMouseDown={(e) => onGrabPiece(e, piece)}
        />
      )}
    </div>
  );
};

export default Tile;