import * as preact from 'preact'
import { useState, useLayoutEffect } from 'preact/hooks'

import type { Vector } from '../logic/vector'
import { GRID_SQUARE_SIZE, getGridOffsetsForVector } from '../grid'

type Props = Readonly<{ className: string, position: Vector, color?: string }>

export const GridSquare: preact.FunctionComponent<Props> = props => {
  const color = props.color !== undefined ? props.color : ''

  const [left, setLeft] = useState<string>('')
  const [top, setTop] = useState<string>('')

  useLayoutEffect(() => {
    const offsets = getGridOffsetsForVector(props.position)
    setLeft(offsets.left)
    setTop(offsets.top)
  }, [props.position])

  return (
    <div
      className={props.className}
      style={{
        width: GRID_SQUARE_SIZE,
        height: GRID_SQUARE_SIZE,
        left,
        top,
        backgroundColor: color
      }}
    />
  )
}
