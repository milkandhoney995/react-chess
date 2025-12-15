import classes from "./Tile.module.scss"
interface Props {
  image?: string;
  number: number;
  highlight: boolean;
}

const Tile = ({ number, image, highlight }: Props) => {
  const className: string = [
  classes.tile,
  number % 2 === 0 ? classes.tile__blackTile : classes.tile__whiteTile,
  highlight && classes.tile__highlight,
  image && classes.tile__pieceImage
].filter(Boolean).join(' ');

  // Convert number to chess coordinates (a1, b2, etc.)
  const file = String.fromCharCode(97 + (number % 8)); // a-h
  const rank = Math.floor(number / 8) + 1; // 1-8
  const squareName = `${file}${rank}`;

  return (
    <div
      className={className}
      role="gridcell"
      aria-label={`Square ${squareName}${image ? ', occupied' : ', empty'}`}
      tabIndex={-1}
    >
      { image &&
      <div
        style={{ backgroundImage: `url(${image})` }}
        className={classes.tile__image}
        role="img"
        aria-label={`Chess piece on ${squareName}`}
      ></div>}
    </div>
  )
}

export default Tile;