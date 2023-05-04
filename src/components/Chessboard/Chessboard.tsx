import classes from "./Chessboard.module.scss"

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function Chessboard() {
  let board = [];

  for (let j = verticalAxis.length - 1; j >= 0 ; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
      const number = j + i;
      // debug: [{horizontalAxis[i]}{verticalAxis[j]}]
      if(number % 2 === 0) {
        board.push(
          <div className={`${classes.chessboard__tile} ${classes.chessboard__blackTile}`}>[{horizontalAxis[i]}{verticalAxis[j]}]</div>
        );
      } else {
        board.push(
          <div className={`${classes.chessboard__tile} ${classes.chessboard__whiteTile}`}>[{horizontalAxis[i]}{verticalAxis[j]}]</div>
        );
      }
    }
  }

  return <div className={classes.chessboard}>{board}</div>;
}