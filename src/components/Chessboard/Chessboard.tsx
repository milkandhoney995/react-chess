import classes from "./Chessboard.module.scss"
import Tile from "../Title/Tile"

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

interface Piece {
  image: string,
  x: number,
  y: number
}

const pieces: Piece[] = [];

for (let p = 0; p < 2; p++) {
  const type = (p === 0) ? "b" : "w";
  const y = (p === 0) ? 7 : 0;

  pieces.push({image: `/assets/images/rook_${type}.png`, x: 0, y: y });
  pieces.push({image: `/assets/images/rook_${type}.png`, x: 7, y: y });
  pieces.push({image: `/assets/images/knight_${type}.png`, x: 1, y: y });
  pieces.push({image: `/assets/images/knight_${type}.png`, x: 6, y: y });
  pieces.push({image: `/assets/images/bishop_${type}.png`, x: 2, y: y });
  pieces.push({image: `/assets/images/bishop_${type}.png`, x: 5, y: y });
  pieces.push({image: `/assets/images/queen_${type}.png`, x: 3, y: y });
  pieces.push({image: `/assets/images/king_${type}.png`, x: 4, y: y });
}

for (let i = 0; i < 8; i++) {
  pieces.push({image: "/assets/images/bishop_b.png", x: i, y: 6 })
};
for (let i = 0; i < 8; i++) {
  pieces.push({image: "/assets/images/bishop_w.png", x: i, y: 1 })
};

export default function Chessboard() {
  let board = [];

  for (let j = verticalAxis.length - 1; j >= 0 ; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
      const number = j + i;
      let image = undefined;

      pieces.forEach(p =>{
        if (p.x === i && p.y === j) {
          image = p.image;
        }
      })

      board.push(<Tile image={image} number={number} />)
    }
  }

  return <div className={classes.chessboard}>{board}</div>;
}