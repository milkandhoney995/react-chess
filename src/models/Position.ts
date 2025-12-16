export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  samePosition(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }

  clone(): Position {
    return new Position(this.x, this.y)
  }
}