import classes from "./Tile.module.scss"
import Image from "next/image"

interface Props {
  image?: string,
  number: number
}
export default function Tile({image, number}: Props) {
  if(number % 2 === 0) {
    return (
      <div
        className={`${classes.tile} ${classes.tile__blackTile}`}>
          { image &&
            <Image
              src={image}
              alt="piece"
              width={80}
              height={80}
            />
          }
      </div>
    )
  } else {

  }
  return (
    <div
      className={`${classes.tile} ${classes.tile__whiteTile}`}>
        { image &&
          <Image
            src={image}
            alt="piece"
            width={80}
            height={80}
          />
          }
    </div>)
}