export class Vector {
  public constructor (public x: number, public y: number) {}

  public equals ({ x, y }: Vector): boolean {
    return this.x === x && this.y === y
  }

  public add ({ x, y }: Vector): Vector {
    return new Vector(this.x + x, this.y + y)
  }

  public scale (scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar)
  }

  public round (): Vector {
    return new Vector(Math.round(this.x), Math.round(this.y))
  }
}

export const UNIT_VECTOR_X: Vector = new Vector(1, 0)
export const UNIT_VECTOR_Y: Vector = new Vector(0, 1)
export const UNIT_VECTOR: Vector = UNIT_VECTOR_X.add(UNIT_VECTOR_Y)
