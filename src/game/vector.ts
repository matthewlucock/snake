export class Vector {
  public constructor (public x: number, public y: number) {}

  public get string (): string {
    return [this.x, this.y].join(',')
  }

  public equals ({ x, y }: Vector): boolean {
    return this.x === x && this.y === y
  }

  public add ({ x, y }: Vector): Vector {
    return new Vector(this.x + x, this.y + y)
  }

  public scale (scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar)
  }

  public floor (): Vector {
    return new Vector(Math.floor(this.x), Math.floor(this.y))
  }
}

export const UNIT_VECTOR_X = new Vector(1, 0)
export const UNIT_VECTOR_Y = new Vector(0, 1)
