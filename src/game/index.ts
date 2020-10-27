import mitt from 'mitt'
import shuffleArray from 'shuffle-array'

import { Vector } from './vector'
import { DIRECTION_KEYS } from './direction'
import { Clock } from './clock'
import { Logic } from './logic'
import { Canvas } from './canvas'

const GRID_SQUARE_SIZE = 30
export const getMaximumGridSizeFromContainer = (container: HTMLElement): Vector => (
  new Vector(container.clientWidth, container.clientHeight).scale(1 / GRID_SQUARE_SIZE).floor()
)

const SNAKE_COLOR = 'hsl(0, 0%, 90%)'
const GRID_PATTERN_COLOR = 'hsla(0, 0%, 100%, 0.02)'

const getTargetColor = (h: number): string => `hsl(${h}, 100%, 40%)`
const TARGET_COLORS = [50, 150, 200, 300].map(getTargetColor)

export class Game {
  private readonly logic = new Logic(this.gridSize)
  private readonly clock = new Clock()
  public readonly canvas: Canvas = new Canvas(this.gridSize, GRID_SQUARE_SIZE)
  public readonly emitter = mitt()

  private readonly targetColorQueue = shuffleArray(TARGET_COLORS)

  public constructor (private readonly gridSize: Vector) {
    this.draw()
  }

  private start (): void {
    this.clock.tickDuration = 500
    this.clock.tick = () => this.tick()
    this.clock.start()
  }

  private tick (): void {
    this.logic.next()

    if (this.logic.gameOver) {
      this.gameOver()
      return
    }

    if (this.logic.targetReached) this.targetReached()

    this.draw()
  }

  private gameOver (): void {
    this.clock.running = false
    this.emitter.emit('game-over')
  }

  private targetReached (): void {
    this.targetColorQueue.push(this.targetColorQueue.shift() as string)
    this.clock.tickDuration = Math.max(40, this.clock.tickDuration - 20)
    this.emitter.emit('target-reached')
  }

  public init (): void {
    document.addEventListener('keyup', event => this.onKeyUp(event))
  }

  private onKeyUp ({ key }: KeyboardEvent): void {
    for (const [direction, directionKeys] of DIRECTION_KEYS) {
      if (directionKeys.includes(key)) {
        this.logic.setDirection(direction)
        break
      }
    }

    if (!this.clock.running && this.logic.direction !== null) this.start()
  }

  private drawGrid (): void {
    for (let y = 0; y < this.gridSize.y; y++) {
      for (let x = 0; x < this.gridSize.x; x++) {
        if ((x + y) % 2 === 0) continue
        this.canvas.drawSquare(new Vector(x, y), GRID_PATTERN_COLOR)
      }
    }
  }

  private draw (): void {
    this.canvas.clear()

    this.drawGrid()
    for (const piece of this.logic.pieces) this.canvas.drawSquare(piece, SNAKE_COLOR)
    this.canvas.drawCircle(this.logic.target, this.targetColorQueue[0])
  }

  public destroy (): void {
    this.canvas.element.remove()
    this.emitter.all.clear()
  }
}
