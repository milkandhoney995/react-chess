import classes from "./Tile.module.scss"
interface Props {
  image?: string;
  number: number;
  highlight: boolean;
  pieceStyle?: React.CSSProperties;
}

const Tile = ({ number, image, highlight, pieceStyle }: Props) => {
  const className = [
    classes.tile,
    number % 2 === 0 ? classes.tile__blackTile : classes.tile__whiteTile,
    highlight && classes.tile__highlight,
  ]
    .filter(Boolean)
    .join(" ");

  const file = String.fromCharCode(97 + (number % 8)); // a-h
  const rank = Math.floor(number / 8) + 1; // 1-8
  const squareName = `${file}${rank}`;

  const handleTileClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // バブリングを止める
    // 必要に応じて他の処理を追加
  };

  const imageStyle: React.CSSProperties = {
    backgroundImage: `url(${image})`,
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
          style={{ ...imageStyle, ...pieceStyle }}
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
