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

  public drawSquare ({ x, y }: Vector, size: number, color: string): void {
    this.ctx.fillStyle = color
    this.ctx.fillRect(x, y, size, size)
  }

  public drawCircle ({ x, y }: Vector, size: number, color: string): void {
    const radius = size / 2
    this.ctx.beginPath()
    this.ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI)

    this.ctx.fillStyle = color
    this.ctx.fill()
  }

  public clear (): void {
    this.ctx.clearRect(0, 0, this.size.x, this.size.y)
  }
}
