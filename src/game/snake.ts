import mitt from 'mitt'

import { Vector, UNIT_VECTOR_X, UNIT_VECTOR_Y } from './vector'

export type Direction = 'left' | 'right' | 'up' | 'down'

const DIRECTION_VECTORS: Readonly<{ [K in Direction]: Vector }> = {
  left: UNIT_VECTOR_X.scale(-1),
  right: UNIT_VECTOR_X,
  up: UNIT_VECTOR_Y.scale(-1),
  down: UNIT_VECTOR_Y
}

const directionsAreConflicting = (a: Direction, b: Direction): boolean => (
  (a === 'left' && b === 'right') ||
  (a === 'right' && b === 'left') ||
  (a === 'up' && b === 'down') ||
  (a === 'down' && b === 'up')
)

export class Snake {
  public readonly pieces: Vector[]
  public direction: Direction | null
  private head: Vector
  public target: Vector
  public readonly emitter = mitt()

  public constructor (private readonly size: Vector) {
    this.head = size.scale(1 / 2).floor()
    this.pieces = [this.head]
    this.direction = null
    this.target = this.getNewTarget()
  }

  private positionIsOutOfBounds ({ x, y }: Vector): boolean {
    return x < 0 || x >= this.size.x || y < 0 || y >= this.size.y
  }

  private isPiece (position: Vector): boolean {
    return this.pieces.some(piece => piece.equals(position))
  }

  public next (): void {
    if (this.direction === null) throw new Error('Snake moved without direction')

    this.head = this.head.add(DIRECTION_VECTORS[this.direction])

    if (this.isPiece(this.head) || this.positionIsOutOfBounds(this.head)) {
      this.emitter.emit('game-over')
      return
    }

    this.pieces.unshift(this.head)

    if (this.head.equals(this.target)) {
      this.target = this.getNewTarget()
      this.emitter.emit('target-reached')
    } else if (this.pieces.length > 1) {
      this.pieces.pop()
    }
  }

  public setDirection (direction: Direction): void {
    if (this.direction !== null && directionsAreConflicting(direction, this.direction)) return
    this.direction = direction
  }

  private getNewTarget (): Vector {
    let newTarget: Vector

    do {
      newTarget = new Vector(
        Math.floor(Math.random() * this.size.x),
        Math.floor(Math.random() * this.size.y)
      )
    } while (this.isPiece(newTarget))

    return newTarget
  }
}
