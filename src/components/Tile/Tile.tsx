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

  const file = String.fromCharCode(97 + (number % 8)); // a-h
  const rank = Math.floor(number / 8) + 1; // 1-8
  const squareName = `${file}${rank}`;

  const handleTileClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // バブリングを止める
    // 必要に応じて他の処理を追加
  };

  return (
    <div
      className={className}
      role="gridcell"
      aria-label={`Square ${squareName}${image ? ', occupied' : ', empty'}`}
      tabIndex={-1}
      onClick={handleTileClick}  // クリック時に呼ばれる
    >
      {image && (
        <div
          style={{ backgroundImage: `url(${image})` }}
          className={classes.tile__image}
          data-piece="true"
          role="img"
          aria-label={`Chess piece on ${squareName}`}
        ></div>
      )}
    </div>
  );
};

export default Tile;
