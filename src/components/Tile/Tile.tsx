import classes from "./Tile.module.scss"
interface Props {
  image?: string;
  number: number;
  highlight: boolean;
}

export default function Tile({ number, image, highlight }: Props) {
  const className: string = [
  classes.tile,
  number % 2 === 0 ? classes.tile__blackTile : classes.tile__whiteTile,
  highlight && classes.tile__highlight,
  image && classes.tile__pieceImage
].filter(Boolean).join(' ');
  return (
    <div className={className}>
      { image &&
      <div
        style={{ backgroundImage: `url(${image})` }}
        className={classes.tile__image}></div>}
    </div>
  )
}