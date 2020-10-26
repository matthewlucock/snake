import { Vector } from './vector'

export class Canvas {
  public readonly element: HTMLCanvasElement = document.createElement('canvas')
  private readonly ctx = this.element.getContext('2d') as CanvasRenderingContext2D
  private readonly canvasSize: Vector = this.gridSize.scale(this.gridSquareSize)

  private readonly circleRadius: number = this.gridSquareSize / 2

  public constructor (private readonly gridSize: Vector, private readonly gridSquareSize: number) {
    this.element.width = this.canvasSize.x
    this.element.height = this.canvasSize.y
  }

  public drawSquare (position: Vector, color: string): void {
    this.ctx.fillStyle = color

    const { x, y } = position.scale(this.gridSquareSize)
    this.ctx.fillRect(x, y, this.gridSquareSize, this.gridSquareSize)
  }

  public drawCircle (position: Vector, color: string): void {
    const { x, y } = position.scale(this.gridSquareSize)

    this.ctx.beginPath()
    this.ctx.arc(x + this.circleRadius, y + this.circleRadius, this.circleRadius, 0, 2 * Math.PI)
    this.ctx.fillStyle = color
    this.ctx.fill()
  }

  public clear (): void {
    this.ctx.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y)
  }
}
