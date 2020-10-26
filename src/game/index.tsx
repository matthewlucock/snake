import * as preact from 'preact'
import { useRef, useEffect, useCallback } from 'preact/hooks'
import clsx from 'clsx'
import shuffleArray from 'shuffle-array'

import { useForceUpdate } from '../util'
import { Logic, Piece } from './logic'
import type { Direction } from './logic/direction'
import { getMaximumGridSizeFromContainer, getGridOffsetsForVector } from './grid'

import { GridSquare } from './components/grid-square'

import styles from './game.scss'


const TARGET_COLORS = [50, 150, 200, 300].map((h: number): string => `hsl(${h}, 100%, 50%)`)

export const DIRECTION_KEYS: ReadonlyMap<Direction, readonly string[]> = new Map([
  ['left', ['a', 'ArrowLeft']],
  ['right', ['d', 'ArrowRight']],
  ['up', ['w', 'ArrowUp']],
  ['down', ['s', 'ArrowDown']]
])

const getPieceFillClassName = ({ direction }: Piece): string => {
  console.log(direction)
  if (direction === 'left') return styles.left
  if (direction === 'right') return styles.right
  if (direction === 'up') return styles.up
  if (direction === 'down') return styles.down
  return ''
}

type Props = Readonly<{
  onTargetReached: () => void
  onGameOver: () => void
}>
let a = Date.now()
export const Game: preact.FunctionComponent<Props> = props => {
  const container = useRef<HTMLDivElement>()
  const body = useRef<HTMLDivElement>()
  const logic = useRef<Logic>()

  const tickDuration = useRef<number>(500)
  const looping = useRef<boolean>(false)
  const targetColorQueue = useRef<string[]>()

  const forceUpdate = useForceUpdate()

  /**
   * Init
   */

  useEffect(() => {
    const gridSize = getMaximumGridSizeFromContainer(container.current)

    logic.current = new Logic(gridSize)

    const { left: width, top: height } = getGridOffsetsForVector(gridSize)
    body.current.style.width = width
    body.current.style.height = height

    targetColorQueue.current = shuffleArray(TARGET_COLORS)

    forceUpdate()
  }, [])

  /**
   * Loop
   */

  const loop = useCallback((): void => {
    logic.current.next()

    if (logic.current.gameOver) {
      props.onGameOver()
      return
    }

    if (logic.current.targetReached) {
      targetColorQueue.current.push(targetColorQueue.current.shift() as string)
      props.onTargetReached()
    }

    forceUpdate()
    setTimeout(loop, tickDuration.current)
  }, [])

  const start = useCallback((): void => {
    looping.current = true
    loop()
  }, [])

  /**
   * Keyboard control
   */

  useEffect(() => {
    const onKeyUp = ({ key }: KeyboardEvent): void => {
      for (const [direction, directionKeys] of DIRECTION_KEYS) {
        if (directionKeys.includes(key)) {
          logic.current.setDirection(direction)
          break
        }
      }

      if (!looping.current && logic.current.direction !== null) start()
    }

    document.addEventListener('keyup', onKeyUp)
    return () => document.removeEventListener('keyup', onKeyUp)
  }, [])

  /**
   * Component
   */
  let b = Date.now()
  console.log(b-a)
  a=b
  console.log(2)
  return (
    <div ref={container} className={styles.container}>
      <div ref={body} className={styles.body}>
        {logic.current && (
          <preact.Fragment>
            <GridSquare
              position={logic.current.pieces[0].position}
              className={getPieceFillClassName(logic.current.pieces[0])}
            >
              <div className={styles.piece} style={{backgroundColor:'white'}} />
            </GridSquare>

            {logic.current.pieces.slice(1).map(piece => (
              <GridSquare position={piece.position}>
                <div className={styles.piece} />
              </GridSquare>
            ))}

            {logic.current.lastTail && (
              <GridSquare
                position={logic.current.lastTail.position}
                className={clsx(styles.tail, getPieceFillClassName(logic.current.lastTail))}
              >
                <div className={styles.piece} style={{backgroundColor: 'white'}} />
              </GridSquare>
            )}

            <GridSquare position={logic.current.target}>
              <div
                key={logic.current.target.string}
                className={styles.target}
                style={{ backgroundColor: targetColorQueue.current[0] }}
              />
            </GridSquare>
          </preact.Fragment>
        )}
      </div>
    </div>
  )
}