import type { Vector } from './vector'
import { UNIT_VECTOR_X, UNIT_VECTOR_Y } from './vector'

export type Direction = 'left' | 'right' | 'up' | 'down'

export const DIRECTION_VECTORS: Readonly<{ [K in Direction]: Vector }> = {
  left: UNIT_VECTOR_X.scale(-1),
  right: UNIT_VECTOR_X,
  up: UNIT_VECTOR_Y.scale(-1),
  down: UNIT_VECTOR_Y
}

export const directionsAreConflicting = (a: Direction, b: Direction): boolean => (
  (a === 'left' && b === 'right') ||
  (a === 'right' && b === 'left') ||
  (a === 'up' && b === 'down') ||
  (a === 'down' && b === 'up')
)
