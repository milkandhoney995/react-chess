import classes from "./Tile.module.scss"

interface Props {
  image?: string,
  number: number,
  highlight: boolean,
}
export default function Tile({image, number, highlight}: Props) {
  const className: string = [
    classes.tile,
    number % 2 === 0 ? classes.tile__blackTile : classes.tile__whiteTile,
    highlight && classes.tile__highlight
  ].filter(Boolean).join(' ');
  return (
    <div className={className}>
      { image && <div className={classes.tile__image} style={{ backgroundImage: `url(${image})`}}></div>}
    </div>
  )
}