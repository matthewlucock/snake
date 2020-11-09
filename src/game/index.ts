import mitt from 'mitt'

import { shuffleArray } from 'snake/util'
import { Vector } from './vector'
import { DIRECTION_KEYS } from './direction'
import { Clock } from './clock'
import { Logic } from './logic'

import styles from './styles.scss'

const GRID_SQUARE_SIZE = 30
const GRID_CIRCLE_RADIUS = GRID_SQUARE_SIZE / 2

const SNAKE_COLOR_DARK = 'hsl(0, 0%, 90%)'
const SNAKE_COLOR_LIGHT = 'hsl(0, 0%, 10%)'
const GRID_PATTERN_COLOR_DARK = 'hsl(0, 0%, 100%)'
const GRID_PATTERN_COLOR_LIGHT = 'hsl(0, 0%, 0%)'
const GRID_PATTERN_ALPHA = 0.02

const TARGET_COLORS: readonly string[] = [50, 150, 200, 300].map(h => `hsl(${h}, 100%, 35%)`)

const getGridSizeFromContainer = (container: HTMLElement): Vector => (
  new Vector(container.clientWidth, container.clientHeight).scale(1 / GRID_SQUARE_SIZE).floor()
)

export class Game {
  private readonly clock = new Clock()
  private readonly logic: Logic
  private readonly canvas = document.createElement('canvas')
  private readonly ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
  public readonly emitter = mitt()

  private readonly gridSize: Vector
  private snakeColor = SNAKE_COLOR_DARK
  private gridPatternColor = GRID_PATTERN_COLOR_LIGHT
  private readonly targetColorQueue = shuffleArray(TARGET_COLORS)

  public constructor (container: HTMLElement) {
    this.gridSize = getGridSizeFromContainer(container)
    this.logic = new Logic(this.gridSize)

    this.canvas.className = styles.canvas

    const canvasSize = this.gridSize.scale(GRID_SQUARE_SIZE)
    this.canvas.width = canvasSize.x
    this.canvas.height = canvasSize.y

    container.append(this.canvas)
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

  private drawGrid (): void {
    this.ctx.save()
    this.ctx.globalAlpha = GRID_PATTERN_ALPHA
    this.ctx.beginPath()

    for (let y = 0; y < this.gridSize.y; y++) {
      for (let x = (y + 1) % 2; x < this.gridSize.x; x += 2) {
        this.ctx.rect(
          x * GRID_SQUARE_SIZE,
          y * GRID_SQUARE_SIZE,
          GRID_SQUARE_SIZE,
          GRID_SQUARE_SIZE
        )
      }
    }

    this.ctx.fillStyle = this.gridPatternColor
    this.ctx.fill()
    this.ctx.restore()
  }

  private drawSnake (): void {
    this.ctx.save()
    this.ctx.beginPath()

    for (const piece of this.logic.pieces) {
      const { x, y } = piece.scale(GRID_SQUARE_SIZE)
      this.ctx.rect(x, y, GRID_SQUARE_SIZE, GRID_SQUARE_SIZE)
    }

    this.ctx.fillStyle = this.snakeColor
    this.ctx.fill()
    this.ctx.restore()
  }

  private drawTarget (): void {
    this.ctx.save()
    this.ctx.beginPath()

    const { x, y } = this.logic.target.scale(GRID_SQUARE_SIZE)
    this.ctx.arc(x + GRID_CIRCLE_RADIUS, y + GRID_CIRCLE_RADIUS, GRID_CIRCLE_RADIUS, 0, 2 * Math.PI)

    this.ctx.fillStyle = this.targetColorQueue[0]
    this.ctx.fill()
    this.ctx.restore()
  }

  private draw (): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawGrid()
    this.drawSnake()
    this.drawTarget()
  }

  public init (): void {
    document.addEventListener('keyup', this.onKeyUp)
  }

  private readonly onKeyUp = ({ key }: KeyboardEvent): void => {
    for (const [direction, directionKeys] of DIRECTION_KEYS) {
      if (directionKeys.includes(key)) {
        this.logic.setDirection(direction)
        break
      }
    }

    if (!this.clock.running && this.logic.direction !== null) this.start()
  }

  public setLightTheme (lightTheme: boolean): void {
    if (lightTheme) {
      this.snakeColor = SNAKE_COLOR_LIGHT
      this.gridPatternColor = GRID_PATTERN_COLOR_LIGHT
    } else {
      this.snakeColor = SNAKE_COLOR_DARK
      this.gridPatternColor = GRID_PATTERN_COLOR_DARK
    }

    this.draw()
  }

  public destroy (): void {
    this.canvas.remove()
    document.removeEventListener('keyup', this.onKeyUp)
    this.emitter.all.clear()
  }
}
