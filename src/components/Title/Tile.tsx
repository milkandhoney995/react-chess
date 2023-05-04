import classes from "./Tile.module.scss"
import Image from "next/image"

interface Props {
  image?: string,
  number: number
}
export default function Tile({image, number}: Props) {
  if(number % 2 === 0) {
    return (
      <div className={`${classes.tile} ${classes.tile__blackTile}`}>
       { image && <div className={classes.tile__image} style={{ backgroundImage: `url(${image})`}}></div>}
      </div>
    )
  } else {

  }
  return (
    <div className={`${classes.tile} ${classes.tile__whiteTile}`}>
      { image && <div className={classes.tile__image} style={{ backgroundImage: `url(${image})`}}></div>}
    </div>)
}