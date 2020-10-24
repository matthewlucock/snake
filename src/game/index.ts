import shuffleArray from 'shuffle-array'

import { Vector } from './vector'
import { DIRECTION_KEYS } from './direction'
import { Logic } from './logic'
import { Canvas } from './canvas'

const GRID_SQUARE_SIZE = 30
export const getMaximumGridSizeFromContainer = (container: HTMLElement): Vector => (
  new Vector(container.clientWidth, container.clientHeight).scale(1 / GRID_SQUARE_SIZE).floor()
)

const SNAKE_COLOR = 'hsl(0, 0%, 100%)'

const getTargetColor = (h: number): string => `hsl(${h}, 100%, 50%)`
const TARGET_COLORS = [50, 150, 200, 300].map(getTargetColor)

export class Game {
  private readonly logic = new Logic(this.gridSize)
  private readonly canvas: Canvas = new Canvas(this.gridSize.scale(GRID_SQUARE_SIZE))
  public canvasElement: HTMLCanvasElement = this.canvas.element

  private readonly targetColorQueue = shuffleArray(TARGET_COLORS)
  private looping: boolean = false

  public readonly emitter = this.logic.emitter

  public constructor (private readonly gridSize: Vector) {
    this.draw()

    this.logic.emitter.on('target-reached', (): void => {
      this.targetColorQueue.push(this.targetColorQueue.shift() as string)
    })

    this.logic.emitter.on('game-over', (): void => {
      this.looping = false
    })
  }

  public init (): void {
    document.addEventListener('keyup', event => this.onKeyUp(event))
  }

  private start (): void {
    this.looping = true
    this.loop()
  }

  private loop (): void {
    if (!this.looping) return

    this.logic.next()
    this.draw()

    setTimeout(() => this.loop(), 500)
  }

  private onKeyUp ({ key }: KeyboardEvent): void {
    for (const [direction, directionKeys] of DIRECTION_KEYS) {
      if (directionKeys.includes(key)) {
        this.logic.setDirection(direction)
        break
      }
    }

    if (!this.looping && this.logic.direction !== null) this.start()
  }

  private draw (): void {
    this.canvas.clear()

    for (const piece of this.logic.pieces) {
      this.canvas.drawSquare(piece.scale(GRID_SQUARE_SIZE), GRID_SQUARE_SIZE, SNAKE_COLOR)
    }

    this.canvas.drawCircle(
      this.logic.target.scale(GRID_SQUARE_SIZE),
      GRID_SQUARE_SIZE,
      this.targetColorQueue[0]
    )
  }

  public destroy (): void {
    this.canvasElement.remove()
    this.emitter.all.clear()
  }
}
