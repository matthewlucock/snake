import { Vector } from './vector'
import type { Direction } from './direction'
import { DIRECTION_VECTORS, directionsAreConflicting, getOppositeDirection } from './direction'

export type Piece = Readonly<{ position: Vector, direction: Direction | null }>

export class Logic {
  public readonly pieces: Piece[]
  public direction: Direction | null
  private head: Piece
  public target: Vector

  public lastTail: Piece | null

  public targetReached: boolean = false
  public gameOver: boolean = false

  public constructor (private readonly size: Vector) {
    this.head = { position: size.scale(1 / 2).floor(), direction: null }
    this.pieces = [this.head]
    this.direction = null
    this.target = this.getNewTarget()
    this.lastTail = null
  }

  private positionIsOutOfBounds ({ x, y }: Vector): boolean {
    return x < 0 || x >= this.size.x || y < 0 || y >= this.size.y
  }

  private isPiece (position: Vector): boolean {
    return this.pieces.some(piece => piece.position.equals(position))
  }

  public next (): void {
    if (this.direction === null) throw new Error('Snake moved without direction')

    this.targetReached = false

    if (this.pieces.length === 1) {
      this.lastTail = {
        position: this.head.position,
        direction: this.head.direction === 'right' ? 'left' : this.head.direction
      }
    }
    this.head = {
      position: this.head.position.add(DIRECTION_VECTORS[this.direction]),
      direction: this.direction
    }

    if (this.isPiece(this.head.position) || this.positionIsOutOfBounds(this.head.position)) {
      this.gameOver = true
      return
    }

    this.pieces.unshift(this.head)

    if (this.head.position.equals(this.target)) {
      this.target = this.getNewTarget()
      this.targetReached = true
    } else if (this.pieces.length > 1) {
      this.lastTail = this.pieces.pop() as Piece
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
