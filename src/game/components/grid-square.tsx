import * as preact from 'preact'
import { useState, useLayoutEffect } from 'preact/hooks'
import clsx from 'clsx'

import type { Vector } from '../logic/vector'
import { getGridOffsetsForVector, GRID_SQUARE_SIZE } from '../grid'

import styles from '../game.scss'

type Props = Readonly<{ position: Vector, className?: string }>

export const GridSquare: preact.FunctionComponent<Props> = props => {
  const [left, setLeft] = useState<string>('')
  const [top, setTop] = useState<string>('')

  useLayoutEffect(() => {
    const offsets = getGridOffsetsForVector(props.position)
    setLeft(offsets.left)
    setTop(offsets.top)
  }, [props.position])

  return (
    <div
      className={clsx(styles.gridSquare, props.className)}
      style={{ width: GRID_SQUARE_SIZE, height: GRID_SQUARE_SIZE, left, top }}
    >
      {props.children}
    </div>
  )
}
