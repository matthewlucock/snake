import { px } from '../util'
import { Vector } from './logic/vector'

export const GRID_SQUARE_SIZE = 30

export const getMaximumGridSizeFromContainer = (container: HTMLElement): Vector => (
  new Vector(container.clientWidth, container.clientHeight).scale(1 / GRID_SQUARE_SIZE).floor()
)

type GridOffsets = Readonly<{left: string, top: string }>
export const getGridOffsetsForVector = (vector: Vector): GridOffsets => {
  const { x, y } = vector.scale(GRID_SQUARE_SIZE)
  return { left: px(x), top: px(y) }
}
