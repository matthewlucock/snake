import shuffleArray from 'shuffle-array'

import { UNIT_VECTOR } from './vector'
import { Snake } from './snake'
import type { Direction } from './snake'
import { Canvas } from './canvas'

const BOARD_SIZE = UNIT_VECTOR.scale(20)
const GRID_SQUARE_SIZE = 30

const SNAKE_COLOR = 'hsl(0, 0%, 100%)'

const getTargetColor = (h: number): string => `hsl(${h}, 100%, 50%)`
const TARGET_COLORS = [50, 150, 200, 300].map(getTargetColor)

const DIRECTION_KEYS: Readonly<{ [K in Direction]: readonly string[] }> = {
  left: ['a', 'ArrowLeft'],
  right: ['d', 'ArrowRight'],
  up: ['w', 'ArrowUp'],
  down: ['s', 'ArrowDown']
}

export class Game {
  private snake: Snake = new Snake(BOARD_SIZE)
  private readonly canvas: Canvas = new Canvas(BOARD_SIZE.scale(GRID_SQUARE_SIZE))
  public canvasElement: HTMLCanvasElement = this.canvas.element

  private readonly targetColorQueue = shuffleArray(TARGET_COLORS)
  private started: boolean = false

  public readonly emitter = this.snake.emitter

  public constructor () {
    this.draw()

    this.snake.emitter.on('target-reached', (): void => {
      this.targetColorQueue.push(this.targetColorQueue.shift() as string)
    })
  }

  public init (): void {
    document.addEventListener('keyup', event => this.onKeyUp(event))
  }

  private start (): void {
    this.started = true
    this.loop()
  }

  private reset (): void {
    this.snake = new Snake(BOARD_SIZE)
    this.draw()
    this.started = false
  }

  private loop (): void {
    this.snake.next()

    if (this.snake.gameOver) {
      this.reset()
      return
    }

    this.draw()
    setTimeout(() => this.loop(), 500)
  }

  private onKeyUp (event: KeyboardEvent): void {
    const { key } = event

    if (DIRECTION_KEYS.left.includes(key)) {
      this.snake.setDirection('left')
    } else if (DIRECTION_KEYS.right.includes(key)) {
      this.snake.setDirection('right')
    } else if (DIRECTION_KEYS.up.includes(key)) {
      this.snake.setDirection('up')
    } else if (DIRECTION_KEYS.down.includes(key)) {
      this.snake.setDirection('down')
    }

    if (!this.started && this.snake.direction !== null) this.start()
  }

  private draw (): void {
    this.canvas.clear()

    for (const piece of this.snake.pieces) {
      this.canvas.drawSquare(piece.scale(GRID_SQUARE_SIZE), GRID_SQUARE_SIZE, SNAKE_COLOR)
    }

    this.canvas.drawCircle(
      this.snake.target.scale(GRID_SQUARE_SIZE),
      GRID_SQUARE_SIZE,
      this.targetColorQueue[0]
    )
  }
}
