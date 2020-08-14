import { UNIT_VECTOR } from './vector'
import { Snake } from './snake'
import type { Direction } from './snake'
import { Canvas } from './canvas'

const BOARD_SIZE = UNIT_VECTOR.scale(20)
const SQUARE_SIZE = 30

const DIRECTION_KEYS: Readonly<{ [K in Direction]: readonly string[] }> = {
  left: ['a', 'ArrowLeft'],
  right: ['d', 'ArrowRight'],
  up: ['w', 'ArrowUp'],
  down: ['s', 'ArrowDown']
}

export class Game {
  private snake: Snake
  private readonly canvas: Canvas
  public canvasElement: HTMLCanvasElement
  private started: boolean = false

  public constructor () {
    this.snake = new Snake(BOARD_SIZE)

    this.canvas = new Canvas(BOARD_SIZE.scale(SQUARE_SIZE))
    this.canvasElement = this.canvas.element

    this.draw()
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
      this.canvas.drawSquare(piece.scale(SQUARE_SIZE), SQUARE_SIZE, 'green')
    }

    this.canvas.drawSquare(this.snake.target.scale(SQUARE_SIZE), SQUARE_SIZE, 'blue')
  }
}
