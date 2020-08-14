import { Vector } from './vector'

export class Canvas {
  public readonly element: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D

  public constructor (private readonly size: Vector) {
    this.element = document.createElement('canvas')
    this.element.width = size.x
    this.element.height = size.y

    this.ctx = this.element.getContext('2d') as CanvasRenderingContext2D
  }

  public drawSquare (position: Vector, size: number, color: string): void {
    this.ctx.fillStyle = color
    this.ctx.fillRect(position.x, position.y, size, size)
  }

  public clear (): void {
    this.ctx.clearRect(0, 0, this.size.x, this.size.y)
  }
}
